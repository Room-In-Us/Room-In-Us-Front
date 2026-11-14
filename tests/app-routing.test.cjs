const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const router = require('react-router-dom');
const { StaticRouter } = require('react-router-dom/server');
const { createMemoryHistory, createRouter } = require('@remix-run/router');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));

function sourcePath(relative) {
  const baseline = process.env.APP_ROUTING_BASELINE;
  if (baseline) {
    for (const candidate of [relative, relative.replace(/\.tsx$/, '.jsx')]) {
      const filename = path.join(baseline, candidate);
      if (fs.existsSync(filename)) return filename;
    }
  }
  return path.join(root, relative);
}

// Real App, layout, React rendering and React Router matching/history run here.
// Pages, map loading and auth snapshots are local stand-ins: no API or map script runs.
function appHarness({ loggedIn = false, isMobile = false } = {}) {
  const cache = new Map(), atoms = new Map(), writes = [];
  const badge = name => () => React.createElement('span', { 'data-ui': name });
  const component = name => {
    const Page = () => React.createElement('section', { 'data-page': name });
    Object.defineProperty(Page, 'name', { value: name });
    return Page;
  };
  const styled = new Proxy(() => () => ({ children }) => React.createElement('div', null, children), {
    get: () => () => ({ children }) => React.createElement('div', null, children),
  });
  const LoadScript = ({ children }) => children;
  function load(relative) {
    if (cache.has(relative)) return cache.get(relative);
    const filename = sourcePath(relative), module = { exports: {} };
    const requireModule = id => {
      if (id === 'react' || id === 'react/jsx-runtime' || id === 'react-router-dom') return require(id);
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === '@react-google-maps/api') return { LoadScript };
      if (id === 'recoil') return {
        atom: config => { atoms.set(config.key, config.default); return config.key; },
        useSetRecoilState: key => value => { atoms.set(key, value); writes.push({ key, value }); },
      };
      if (id.endsWith('/hooks/useAuthSession')) return { __esModule: true, default: () => loggedIn };
      if (id.endsWith('/hooks/useDevice')) return { __esModule: true, default: () => ({ isMobile }) };
      if (id.endsWith('/widgets/MainLayOut')) return load('src/widgets/MainLayOut.tsx');
      if (id.endsWith('/model/locationAtom')) return load('src/features/location/model/locationAtom.ts');
      if (id.endsWith('/components/Header')) return { __esModule: true, default: badge('Header') };
      if (id.endsWith('/components/Footer')) return { __esModule: true, default: badge('Footer') };
      if (id.endsWith('/styles/DatePickerGlobalStyle')) return { __esModule: true, default: badge('DatePickerGlobalStyle') };
      if (id.endsWith('.css')) return {};
      return { __esModule: true, default: component(id.split('/').at(-1)) };
    };
    const source = fs.readFileSync(filename, 'utf8').replaceAll('import.meta.env.VITE_GOOGLE_MAPS_API_KEY', "'map-key-for-test'");
    const code = ts.transpileModule(source, { fileName: filename, compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, require: requireModule }, { filename });
    cache.set(relative, module.exports); return module.exports;
  }
  const App = load('src/app/App.tsx').default;
  return {
    App, atoms, writes,
    tree: () => App(),
    setLoggedIn: value => { loggedIn = value; },
    render(location) { return renderToStaticMarkup(React.createElement(StaticRouter, { location }, React.createElement(App))); },
    routes() { return router.createRoutesFromElements(App().props.children[0].props.children); },
  };
}

const publicRoutes = [
  ['/', 'LandingPage'], ['/home', 'MainPage'], ['/login', 'LoginPage'], ['/signup', 'SignupPage'],
  ['/auth/callback', 'AuthCallback'], ['/auth/error', 'AuthError'], ['/location', 'LocationPage'],
  ['/level', 'LevelPage'], ['/genre', 'GenrePage'], ['/theme/001', 'ThemeDetailPage'],
  ['/theme/001/review/009', 'ReviewDetailPage'], ['/review/share', 'ReviewSharePage'],
  ['/survey', 'SurveyPage'], ['/search', 'SerachPage'], ['/terms', 'TermsPage'], ['/privacy', 'PrivacyPage'],
];
const protectedRoutes = [
  ['/mypage', 'MyPage'], ['/mypage/preferences', 'PreferencesPage'], ['/mypage/reservations', 'ReservationsPage'],
  ['/mypage/favorites', 'FavoritesPage'], ['/mypage/reviews', 'ReviewsPage'],
];

test('all public routes preserve direct entry/refresh matching under all three auth snapshots', () => {
  for (const loggedIn of [null, false, true]) {
    const app = appHarness({ loggedIn });
    for (const [url, page] of publicRoutes) {
      assert.match(app.render(url), new RegExp(`data-page="${page}"`), `${url}: ${loggedIn}`);
      assert.equal(app.render(url), appHarness({ loggedIn }).render(url), `fresh entry at ${url}`);
    }
    const matches = router.matchRoutes(app.routes(), '/theme/001/review/009?view=full#records');
    assert.deepEqual(matches.at(-1).params, { themeId: '001', reviewId: '009' });
    assert.equal(app.writes.length, 0);
  }
});

test('protected routes retain loading → member page/404 with no login redirect added', () => {
  const app = appHarness({ loggedIn: null });
  for (const [url, page] of protectedRoutes) {
    app.setLoggedIn(null); const loading = app.render(url);
    assert.match(loading, /로딩 중…/); assert.doesNotMatch(loading, /data-page=/);
    app.setLoggedIn(false); assert.match(app.render(url), /data-page="NotFoundPage"/);
    app.setLoggedIn(true); assert.match(app.render(url), new RegExp(`data-page="${page}"`));
    app.setLoggedIn(false); assert.match(app.render(url), /data-page="NotFoundPage"/);
  }
});

test('unknown URLs render the existing 404 inside the same layout for logged-in and logged-out users', () => {
  for (const loggedIn of [null, false, true]) {
    const app = appHarness({ loggedIn });
    for (const url of ['/missing/path', '/theme', '/mypage/missing']) {
      const html = app.render(url); assert.match(html, /data-page="NotFoundPage"/);
      assert.match(html, /data-ui="Header"/); assert.match(html, /data-ui="Footer"/);
    }
  }
});

test('desktop/mobile layout keeps the existing auth, terms, landing and ordinary-page Header/Footer conditions', () => {
  const cases = [
    { urls: ['/login', '/signup', '/survey'], desktop: [false, true], mobile: [true, false] },
    { urls: ['/terms', '/privacy'], desktop: [false, false], mobile: [false, false] },
    { urls: ['/'], desktop: [true, false], mobile: [true, false] },
    { urls: ['/home', '/genre', '/theme/7', '/mypage', '/missing'], desktop: [true, true], mobile: [true, false] },
  ];
  for (const isMobile of [false, true]) {
    const app = appHarness({ isMobile, loggedIn: true });
    for (const { urls, desktop, mobile } of cases) for (const url of urls) {
      const html = app.render(url), [header, footer] = isMobile ? mobile : desktop;
      assert.equal(html.includes('data-ui="Header"'), header, `${url} mobile=${isMobile}: Header`);
      assert.equal(html.includes('data-ui="Footer"'), footer, `${url} mobile=${isMobile}: Footer`);
      assert.equal((html.match(/data-ui="DatePickerGlobalStyle"/g) || []).length, 1);
    }
  }
});

test('map load success/failure preserves the shared boolean atom updates and key; routing stays under LoadScript', () => {
  const app = appHarness(), tree = app.tree(); assert.equal(app.atoms.get('mapsLoadedState'), false);
  assert.equal(tree.props.googleMapsApiKey, 'map-key-for-test');
  assert.equal(tree.props.children[0].type, router.Routes);
  tree.props.onLoad(); tree.props.onError(Error('mock script failure')); tree.props.onLoad();
  assert.deepEqual(plain(app.writes), [
    { key: 'mapsLoadedState', value: true }, { key: 'mapsLoadedState', value: false }, { key: 'mapsLoadedState', value: true },
  ]);
});

test('actual router navigation/back/forward preserves path, query, hash, state and detail ID strings', async () => {
  const app = appHarness({ loggedIn: true });
  const memory = createRouter({ history: createMemoryHistory({ initialEntries: ['/home'] }), routes: app.routes() }).initialize();
  try {
    await memory.navigate('/genre', { state: { from: 'home' } });
    await memory.navigate('/theme/001?source=genre#reviews', { state: { selected: '001' } });
    assert.equal(memory.state.matches.at(-1).route.element.type.name, 'ThemeDetailPage');
    assert.equal(memory.state.matches.at(-1).params.themeId, '001');
    assert.equal(memory.state.location.search, '?source=genre'); assert.equal(memory.state.location.hash, '#reviews');
    assert.deepEqual(memory.state.location.state, { selected: '001' });
    await memory.navigate(-1); assert.equal(memory.state.location.pathname, '/genre'); assert.deepEqual(memory.state.location.state, { from: 'home' });
    await memory.navigate(-1); assert.equal(memory.state.location.pathname, '/home');
    await memory.navigate(1); assert.equal(memory.state.location.pathname, '/genre');
    await memory.navigate('/does-not-exist'); assert.equal(memory.state.matches.at(-1).route.element.type.name, 'NotFoundPage');
  } finally { memory.dispose(); }
});

function runEntry(container) {
  const calls = [], rendered = [], imports = [];
  const StrictMode = React.StrictMode, BrowserRouter = () => null, RecoilRoot = () => null;
  const tokens = { StrictMode, BrowserRouter, RecoilRoot, SeoHead: () => null, ScrollToTop: () => null, App: () => null };
  const filename = sourcePath('src/app/main.tsx');
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { fileName: filename, compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const run = () => vm.runInNewContext(code, {
    exports: {}, document: { getElementById: id => { calls.push(['getElementById', id]); return container; } },
    require: id => {
      imports.push(id);
      if (id === 'react') return { StrictMode };
      if (id === 'react/jsx-runtime') return require(id);
      if (id === 'react-dom/client') return { createRoot: element => {
        // Use React's original missing-root failure for the JSX baseline too.
        if (element === null) return require('react-dom/client').createRoot(element);
        calls.push(['createRoot', element]); return { render: tree => rendered.push(tree) };
      } };
      if (id === 'react-router-dom') return { BrowserRouter };
      if (id === 'recoil') return { RecoilRoot };
      if (id.endsWith('.css')) return {};
      if (id.endsWith('/utils/scrollToTopFunc')) return { __esModule: true, default: tokens.ScrollToTop };
      const name = id.split('/').at(-1).replace(/\.jsx$/, '');
      return { __esModule: true, default: tokens[name] };
    },
  }, { filename });
  return { run, calls, rendered, imports, tokens };
}

test('entry renders once into #root with the same StrictMode/BrowserRouter/RecoilRoot provider and child ordering', () => {
  const container = {}, entry = runEntry(container); entry.run();
  assert.deepEqual(entry.calls, [['getElementById', 'root'], ['createRoot', container]]); assert.equal(entry.rendered.length, 1);
  const strict = entry.rendered[0], browser = strict.props.children, recoil = browser.props.children;
  assert.equal(strict.type, entry.tokens.StrictMode); assert.equal(browser.type, entry.tokens.BrowserRouter); assert.equal(recoil.type, entry.tokens.RecoilRoot);
  assert.deepEqual(Array.from(recoil.props.children, node => node.type), [entry.tokens.SeoHead, entry.tokens.ScrollToTop, entry.tokens.App]);
  assert.ok(entry.imports.includes('./index.css'));
});

test('entry still fails explicitly without #root and does not silently skip startup', () => {
  const entry = runEntry(null);
  assert.throws(entry.run, error => error.name === 'Error' && error.message === 'createRoot(...): Target container is not a DOM element.');
  assert.equal(entry.rendered.length, 0);
});

test('HTML module entry resolves to the actual source file and keeps #root before the module script', () => {
  const html = fs.readFileSync(sourcePath('index.html'), 'utf8');
  const entry = html.match(/<script type="module" src="(\/src\/app\/main\.(?:tsx|jsx))"><\/script>/);
  assert.ok(entry); assert.ok(fs.existsSync(sourcePath(entry[1].slice(1))));
  assert.ok(html.indexOf('<div id="root"></div>') < entry.index);
});
