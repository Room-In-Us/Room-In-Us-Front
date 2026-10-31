const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const flush = () => new Promise(resolve => setImmediate(resolve));
const plain = value => JSON.parse(JSON.stringify(value));
const detail = (storeId, label = `매장 ${storeId}`) => ({
  storeId, storeName: label, storeAddress: `${label} 주소`,
  storeWebsiteUrl: `https://example.com/${storeId}`, storeContact: '02-1234-5678',
});
const theme = themeId => ({
  themeId, themeName: `테마 ${themeId}`, storeName: '테스트 매장', locationName: '강남',
  awardsYear: null, img: '', satisfactionLevel: null, level: 2, playTime: 60,
  isLiked: false, genreList: null, price: null, maxHeadcount: null,
});
const zone = (zoneId, zoneName) => ({ zoneId, zoneName, storeCount: 3, themeCount: 5 });

// Real API functions run against a deferred in-memory transport. No HTTP is sent.
function mount(kind, { storeId = 1, mobile = false, routeState = null, loggedIn = false, copyFails = false, props = {} } = {}) {
  const files = {
    store: 'src/features/location/ui/StoreCard.tsx', page: 'src/pages/LocationPage.tsx',
    card: 'src/features/location/ui/LocationContentCard.tsx',
    map: 'src/features/location/ui/GoogleMapComponent.tsx',
  };
  const atoms = {
    locationStoreId: storeId, locationRegionId: 1, stationCardVisible: false, storeCardVisible: false,
    selectedLocationRegionId: null, zoneId: null, zoneName: null, storeCount: null, themeCount: null,
    storePageNumber: 1, storeInfoList: [], centerLatAndLng: { lat: 37, lng: 127 }, zoomLevel: 12,
  };
  const slots = [], setters = new Map(), requests = [], writes = [], copied = [], timers = [], navigation = [], mutations = [];
  let cursor = 0, pending = [], changed = false, tree;
  const setAtom = (key, value) => {
    const next = typeof value === 'function' ? value(atoms[key]) : value;
    if (!Object.is(next, atoms[key])) changed = true;
    atoms[key] = next; writes.push({ atom: key, value: next });
  };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(next, slots[i])) changed = true;
        slots[i] = next; writes.push({ state: i, value: next });
      }];
    },
    useRef(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!slots[i]?.deps || deps.some((value, index) => !Object.is(value, slots[i].deps[index]))) {
        const previous = slots[i]; slots[i] = { deps };
        pending.push(() => { previous?.cleanup?.(); slots[i].cleanup = effect(); });
      }
    },
    memo: component => component,
  };
  const api = {
    get(url, options = {}) {
      let resolve, reject;
      const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
      requests.push({ url, params: options.params, resolve: data => resolve({ data }), reject });
      return promise;
    },
  };
  const jsx = (type, props, key) => ({ type, props: props || {}, key });
  const styled = new Proxy(target => () => `styled(${target})`, { get: (_, key) => () => `styled.${String(key)}` });
  const Sheet = Object.assign(() => null, { Container: 'Container', Header: 'Header', Content: 'Content', Backdrop: 'Backdrop' });
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const requireModule = id => {
      if (id === 'react') return react;
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === 'recoil') return {
        useRecoilState(key) {
          if (!setters.has(key)) setters.set(key, value => setAtom(key, value));
          return [atoms[key], setters.get(key)];
        },
        useRecoilValue: key => atoms[key],
      };
      if (id === 'react-router-dom') return {
        useLocation: () => ({ state: routeState }), useNavigate: () => (...args) => navigation.push(args),
      };
      if (id === 'react-modal-sheet') return { Sheet };
      if (id === '@react-google-maps/api') return { GoogleMap: 'GoogleMap', MarkerF: 'Marker', OverlayView: Object.assign(() => null, { OVERLAY_MOUSE_TARGET: 'mouse' }) };
      if (id === 'prop-types') return require('prop-types');
      if (id.includes('locationAtom')) return new Proxy({}, { get: (_, key) => key });
      if (id.includes('app/API')) return { api };
      if (id.includes('useDevice')) return { __esModule: true, default: () => ({ isMobile: mobile }) };
      if (id.includes('useAuthSession')) return { __esModule: true, default: () => loggedIn };
      if (id.includes('themeLikeAPI')) return {
        postThemeLikeAPI: id => mutations.push(['post', id]), deleteThemeLikeAPI: id => mutations.push(['delete', id]),
      };
      if (id.endsWith('locationAPI') || id.endsWith('locationThemeAPI') || id.endsWith('OptionList') || id.includes('/utils/')) {
        return load(path.resolve(path.dirname(filename), id + '.ts'));
      }
      if (id.includes('googleMapStyles')) return { googleMapStyles: [] };
      return { __esModule: true, default: id };
    };
    const override = process.env.LOCATION_DETAIL_BASELINE && ['store', 'page'].includes(kind) && filename === path.join(root, files[kind]);
    const sourceFile = override ? path.join(process.env.LOCATION_DETAIL_BASELINE, kind === 'store' ? 'StoreCard.jsx' : 'LocationPage.jsx') : filename;
    const code = ts.transpileModule(fs.readFileSync(sourceFile, 'utf8'), {
      fileName: sourceFile,
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: requireModule,
      navigator: { clipboard: { writeText: async value => { if (copyFails) throw Error('clipboard denied'); copied.push(value); } } },
      setTimeout: (fn, ms) => { timers.push({ fn, ms }); }, console: { log() {}, error() {} },
      window: { google: { maps: { Size: function(width, height) { this.width = width; this.height = height; } } } },
    }, { filename: sourceFile });
    cache.set(filename, module.exports); return module.exports;
  }
  const component = load(path.join(root, files[kind])).default;
  const render = () => {
    cursor = 0; pending = []; changed = false; tree = component(props);
    pending.forEach(effect => effect()); return tree;
  };
  const find = predicate => {
    const result = [];
    const visit = node => {
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (!node || typeof node !== 'object') return;
      if (predicate(node)) result.push(node);
      visit(node.props?.children);
    };
    visit(tree); return result;
  };
  const text = node => {
    if (Array.isArray(node)) return node.map(text).join('');
    if (node == null || typeof node === 'boolean') return '';
    return typeof node === 'object' ? text(node.props?.children) : String(node);
  };
  return {
    atoms, requests, writes, copied, timers, navigation, mutations, render, find, Sheet,
    text: () => text(tree),
    info: () => requests.filter(r => r.url.startsWith('stores/')),
    themes: () => requests.filter(r => r.url === 'themes/location'),
    cards: () => find(n => String(n.type).endsWith('/LocationContentCard')),
    copyButtons: () => find(n => Object.hasOwn(n.props, 'aria-disabled')),
    filter: () => find(n => String(n.type).endsWith('/BottomSheet'))[0],
    updateAtoms(values) { Object.entries(values).forEach(([key, value]) => setAtom(key, value)); render(); },
    clickText(value) {
      const nodes = find(n => typeof n.props.onClick === 'function' && text(n) === value);
      assert.equal(nodes.length, 1, `Expected one clickable ${value}`); nodes[0].props.onClick(); render();
    },
    async settle() {
      for (let i = 0; i < 15; i++) { await flush(); if (!changed) return; render(); }
      throw Error('Component did not settle');
    },
    unmount() { slots.forEach(slot => slot?.cleanup?.()); },
  };
}

test('normal store requests, filter arguments, reset, empty results and back navigation stay unchanged', async () => {
  for (const mobile of [false, true]) {
    const m = mount('store', { mobile }); m.render();
    assert.equal(m.info()[0].url, 'stores/1/store-info');
    assert.deepEqual(plain(m.themes()[0].params), { storeId: 1, headcount: 2, page: 1, size: 10000, sortOption: 'HIGH_SATISFACTION_LEVEL' });
    m.info()[0].resolve(detail(1)); m.themes()[0].resolve({ contents: [theme(93)] }); await m.settle();
    assert.equal(m.text().includes('매장 1'), true);
    assert.deepEqual(plain(m.cards()[0].props), { data: theme(93), headCount: 2, type: 'location' });
    if (mobile) {
      m.filter().props.onApply({ people: 4, sort: 'LOW_PRICE', region: '지역 전체', zones: [] }); m.render();
    } else {
      m.find(n => String(n.type).endsWith('/LocationPeopleFilter'))[0].props.onSelect(4); m.render();
      m.find(n => String(n.type).endsWith('/LocationSortFilter'))[0].props.onSelect('LOW_PRICE'); m.render();
    }
    assert.deepEqual(plain(m.themes().at(-1).params), { storeId: 1, headcount: 4, page: 1, size: 10000, sortOption: 'LOW_PRICE' });
    m.themes().at(-1).resolve({ contents: [] }); await m.settle(); assert.equal(m.cards().length, 0);
    if (mobile) {
      m.filter().props.onReset({ people: 2, sort: 'HIGH_SATISFACTION_LEVEL', region: '지역 전체', zones: [] }); m.render();
      assert.equal(m.themes().at(-1).params.headcount, 2);
    }
    m.clickText('매장 선택으로 돌아가기');
    assert.equal(m.atoms.stationCardVisible, true); assert.equal(m.atoms.storeCardVisible, false); m.unmount();
  }
});

test('normal loaded clipboard values and tooltip timing stay unchanged', async () => {
  const m = mount('store'); m.render(); m.info()[0].resolve(detail(1)); await m.settle();
  const copies = m.find(n => String(n.type).includes('/copyIcon.svg'));
  assert.equal(copies.length, 3);
  copies.forEach(n => n.props.onClick()); await m.settle();
  assert.deepEqual(m.copied, [detail(1).storeAddress, detail(1).storeWebsiteUrl, detail(1).storeContact]);
  assert.deepEqual(m.timers.map(t => t.ms), [1500, 1500, 1500]);
  assert.equal(m.text().includes('주소 복사 완료!'), true);
  m.timers.forEach(t => t.fn()); await m.settle(); assert.equal(m.text().includes('주소 복사 완료!'), false);
});

test('normal clipboard rejection keeps tooltips closed', async () => {
  const m = mount('store', { copyFails: true }); m.render(); m.info()[0].resolve(detail(1)); await m.settle();
  m.find(n => String(n.type).includes('/copyIcon.svg')).forEach(n => n.props.onClick()); await m.settle();
  assert.equal(m.copied.length, 0); assert.equal(m.timers.length, 0); assert.equal(m.text().includes('복사 완료!'), false);
});

test('theme cards use actual themeId keys without changing card data', async () => {
  const m = mount('store'); m.render(); m.themes()[0].resolve({ contents: [theme(93), theme(94)] }); await m.settle();
  assert.deepEqual(m.cards().map(n => n.key), [93, 94]);
});

test('null store ID sends no request and immediately hides old details, themes and copy actions', async () => {
  for (const mobile of [false, true]) {
    const empty = mount('store', { storeId: null, mobile }); empty.render(); await empty.settle();
    assert.equal(empty.requests.length, 0); assert.equal(empty.cards().length, 0);
    assert.equal(empty.copyButtons().every(n => n.props['aria-disabled'] && n.props.onClick === undefined), true);
    const m = mount('store', { mobile }); m.render();
    m.info()[0].resolve(detail(1)); m.themes()[0].resolve({ contents: [theme(93)] }); await m.settle();
    m.updateAtoms({ locationStoreId: null });
    assert.equal(m.text().includes('매장 1'), false); assert.equal(m.cards().length, 0);
    assert.equal(m.copyButtons().every(n => n.props['aria-disabled'] && !n.props.onClick), true);
    await m.settle(); assert.equal(m.requests.length, 2); assert.equal(m.cards().length, 0);
  }
});

test('copy stays disabled during initial loading, store changes and failed detail requests', async () => {
  const m = mount('store'); m.render();
  const disabled = () => assert.equal(m.copyButtons().every(n => n.props['aria-disabled'] && !n.props.onClick), true);
  disabled(); m.info()[0].resolve(detail(1)); await m.settle();
  assert.equal(m.copyButtons().every(n => n.props['aria-disabled'] === false), true);
  m.updateAtoms({ locationStoreId: 2 }); disabled(); await m.settle();
  m.info()[1].reject(Error('detail failure')); await m.settle(); disabled();
  assert.equal(m.text().includes('매장 1'), false); assert.equal(m.copied.length, 0);
});

test('A → B → A ignores obsolete detail and theme responses even for the same store ID', async () => {
  const m = mount('store'); m.render();
  m.updateAtoms({ locationStoreId: 2 }); m.updateAtoms({ locationStoreId: 1 }); await m.settle();
  assert.equal(m.copyButtons().every(n => !n.props.onClick), true);
  m.info()[2].resolve(detail(1, '최신 A')); m.themes()[2].resolve({ contents: [theme(95)] }); await m.settle();
  m.info()[1].resolve(detail(2, '이전 B')); m.info()[0].resolve(detail(1, '이전 A'));
  m.themes()[1].resolve({ contents: [theme(94)] }); m.themes()[0].resolve({ contents: [theme(93)] }); await m.settle();
  assert.equal(m.text().includes('최신 A'), true); assert.equal(m.text().includes('이전'), false);
  assert.deepEqual(m.cards().map(n => n.key), [95]); m.copyButtons()[0].props.onClick(); await m.settle();
  assert.deepEqual(m.copied, ['최신 A 주소']);
});

test('late responses after null selection or unmount cannot restore details or themes', async () => {
  for (const mode of ['null', 'unmount']) {
    const m = mount('store'); m.render();
    if (mode === 'null') { m.updateAtoms({ locationStoreId: null }); await m.settle(); } else m.unmount();
    const count = m.writes.length;
    m.info()[0].resolve(detail(1)); m.themes()[0].resolve({ contents: [theme(93)] }); await m.settle();
    assert.equal(m.writes.length, count); assert.equal(m.cards().length, 0);
  }
});

test('outdated sort/headcount responses cannot replace current results', async () => {
  const m = mount('store', { mobile: true }); m.render();
  m.filter().props.onApply({ people: 4, sort: 'LOW_PRICE', region: '', zones: [] }); m.render();
  m.themes()[1].resolve({ contents: [theme(95)] }); await m.settle();
  m.themes()[0].resolve({ contents: [theme(93)] }); await m.settle();
  assert.deepEqual(m.cards().map(n => n.key), [95]); assert.equal(m.cards()[0].props.headCount, 4);
});

test('normal route entry, zone selection and Recoil ID meanings stay unchanged', async () => {
  for (const mobile of [false, true]) {
    const m = mount('page', { mobile, routeState: { regionId: 2, zoneName: '수원' } }); m.render();
    assert.equal(m.requests[0].url, 'location/regions/2/zones');
    m.requests[0].resolve([zone(17, '수원'), zone(18, '인천')]); await m.settle();
    assert.equal(m.atoms.locationRegionId, 2); assert.equal(m.atoms.selectedLocationRegionId, 2);
    assert.equal(m.atoms.zoneId, 17); assert.equal(m.atoms.zoneName, '수원');
    assert.equal(m.atoms.storePageNumber, 1); assert.equal(m.atoms.stationCardVisible, true);
    assert.equal(m.atoms.storeCount, 3); assert.equal(m.atoms.themeCount, 5);
  }
});

test('region changes clear obsolete zone buttons, ignore late responses and preserve selected detail IDs', async () => {
  const m = mount('page'); m.render(); m.requests[0].resolve([zone(1, '강남')]); await m.settle();
  m.clickText('강남3'); m.clickText('경기/인천'); await m.settle();
  assert.equal(m.text().includes('강남'), false);
  assert.equal(m.atoms.locationRegionId, 2); assert.equal(m.atoms.selectedLocationRegionId, 1); assert.equal(m.atoms.zoneId, 1);
  m.clickText('서울'); m.requests[2].resolve([zone(2, '홍대')]); await m.settle();
  m.requests[1].resolve([zone(17, '수원')]); await m.settle();
  assert.equal(m.text().includes('홍대'), true); assert.equal(m.text().includes('수원'), false);
});

test('unmounted LocationPage ignores its pending zone response', async () => {
  const m = mount('page'); m.render(); m.unmount(); const count = m.writes.length;
  m.requests[0].resolve([zone(1, '강남')]); await m.settle(); assert.equal(m.writes.length, count);
});

test('mobile Sheet keeps snap points, close/backdrop peak and snap-zero behavior', () => {
  const m = mount('page', { mobile: true }); m.render();
  let sheet = m.find(n => n.type === m.Sheet)[0]; const snaps = [];
  assert.deepEqual(plain(sheet.props.snapPoints), [0, 26, 0.5, 1]); assert.equal(sheet.props.initialSnap, 3);
  sheet.props.ref.current = { snapTo: index => snaps.push(index) };
  sheet.props.onClose(); m.find(n => n.type === 'Backdrop')[0].props.onTap(); sheet.props.onSnap(0); m.render();
  assert.deepEqual(snaps, [1, 1, 1]); assert.equal(m.find(n => n.type === 'Backdrop').length, 0);
});

test('map marker selection keeps numeric store ID, coordinates and zoom 18', () => {
  const m = mount('map'); m.atoms.storeInfoList = [{ storeId: 7, storeName: '지도 매장', latitude: 37.5, longitude: 127.1, isAwarded: false }];
  m.render(); m.find(n => n.type === 'Marker')[0].props.onClick();
  assert.equal(m.atoms.locationStoreId, 7); assert.equal(m.atoms.storeCardVisible, true); assert.equal(m.atoms.stationCardVisible, false);
  assert.deepEqual(plain(m.atoms.centerLatAndLng), { lat: 37.5, lng: 127.1 }); assert.equal(m.atoms.zoomLevel, 18);
});

test('location theme card keeps detail navigation, mock likes and logged-out login prompt', () => {
  for (const loggedIn of [false, true]) {
    const m = mount('card', { loggedIn, props: { data: theme(93), headCount: 2, type: 'location' } }); m.render();
    const clicks = () => m.find(n => typeof n.props.onClick === 'function');
    clicks()[0].props.onClick(); assert.deepEqual(m.navigation, [['/theme/93']]);
    let stopped = false; clicks()[1].props.onClick({ stopPropagation() { stopped = true; } }); m.render(); assert.equal(stopped, true);
    if (loggedIn) {
      assert.deepEqual(m.mutations, [['post', 93]]); clicks()[1].props.onClick({ stopPropagation() {} });
      assert.deepEqual(m.mutations, [['post', 93], ['delete', 93]]);
    } else {
      assert.equal(m.mutations.length, 0); assert.equal(m.find(n => n.props.message?.includes('로그인 후'))[0].props.isOpen, true);
    }
  }
});
