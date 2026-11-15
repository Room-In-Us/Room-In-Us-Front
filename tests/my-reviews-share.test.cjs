const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));

// Actual UI, atom defaults, converters and API functions run with a deferred,
// local HTTP transport. Child UI and library widgets are inspected via props.
function mount(relative, { props = {}, values = {}, isMobile = false, sharedAtoms, params = {}, routeState = null, loggedIn = false, copyFails = false, deferLikes = false, dev = true, hasResizeObserver = true, nativeShare = false, canShare = true, shareError, images = [], deferNativeShare = false, fontsReady = Promise.resolve() } = {}) {
  const atoms = sharedAtoms || { ...values }, slots = [], effects = [], layoutEffects = [], writes = [], stateWrites = [], requests = [], navigation = [], alerts = [], errors = [];
  if (sharedAtoms) for (const [key, value] of Object.entries(values)) if (!Object.hasOwn(atoms, key)) atoms[key] = value;
  const cache = new Map(), defaults = new Map(), setters = new Map();
  const listeners = new Map(), copied = [], timers = [], mutations = [];
  const imageExports = [], objectUrls = [], revokedUrls = [], downloads = [], shares = [], observers = [], frames = [], nativeShareRequests = [];
  const preview = { width: isMobile ? 343 : 600, getBoundingClientRect() { return { width: this.width }; }, querySelectorAll() { return images; } };
  const browserEvents = {
    addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); },
    removeEventListener(name, fn) { listeners.get(name)?.delete(fn); },
  };
  class BrowserURL extends URL {
    static createObjectURL(blob) { const url = `blob:mock-${objectUrls.length + 1}`; objectUrls.push({ url, blob }); return url; }
    static revokeObjectURL(url) { revokedUrls.push(url); }
  }
  class PreviewObserver {
    constructor(callback) { this.callback = callback; this.targets = []; this.disconnected = false; observers.push(this); }
    observe(target) { this.targets.push(target); }
    disconnect() { this.disconnected = true; }
    trigger() { this.callback(); }
  }
  let currentLoggedIn = loggedIn;
  let cursor = 0, changed = false, tree, unmounted = false;
  const setAtom = (key, value) => { atoms[key] = typeof value === 'function' ? value(atoms[key]) : value; writes.push({ key, value: atoms[key] }); changed = true; };
  const setter = key => { if (!setters.has(key)) setters.set(key, value => setAtom(key, value)); return setters.get(key); };
  const effectHook = queue => (effect, deps) => {
    const i = cursor++;
    if (!slots[i] || deps.some((value, j) => !Object.is(value, slots[i].deps[j]))) {
      const previous = slots[i]; slots[i] = { deps };
      queue.push(() => { previous?.cleanup?.(); slots[i].cleanup = effect(); });
    }
  };
  const react = {
    useState(initial) {
      const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => { const next = typeof value === 'function' ? value(slots[i]) : value; stateWrites.push({ next, unmounted }); changed ||= !Object.is(next, slots[i]); slots[i] = next; }];
    },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
    useCallback(callback, deps) { const i = cursor++; if (!slots[i] || deps.some((value, j) => !Object.is(value, slots[i].deps[j]))) slots[i] = { callback, deps }; return slots[i].callback; },
    useMemo(factory, deps) { const i = cursor++; if (!slots[i] || deps.some((value, j) => !Object.is(value, slots[i].deps[j]))) slots[i] = { value: factory(), deps }; return slots[i].value; },
    useEffect: effectHook(effects),
    useLayoutEffect: effectHook(layoutEffects),
  };
  const styled = new Proxy(target => () => `styled(${String(target)})`, { get: (_, name) => () => `styled.${String(name)}` });
  const css = () => '';
  const jsx = (type, props, key) => {
    if (relative.endsWith('/ReviewSharePage.tsx') && props?.ref) props.ref.current = preview;
    return { type, props: props || {}, key: key === undefined ? null : String(key) };
  };
  const transport = (method, url, body, config) => new Promise((resolve, reject) => requests.push({ method, url, body, config, resolve: value => resolve({ data: value }), reject }));
  const api = {
    get: (url, config) => transport('GET', url, undefined, config),
    post: (url, body) => transport('POST', url, body),
    patch: (url, body) => transport('PATCH', url, body),
    delete: (url, config) => transport('DELETE', url, undefined, config),
  };
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const requireModule = id => {
      if (id === 'html-to-image') return { toBlob: (node, options) => new Promise((resolve, reject) => imageExports.push({ node, options, resolve, reject })) };
      if (id === 'react') return { ...react, __esModule: true, default: react };
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled, css };
      if (id === 'dayjs' || id === 'date-fns' || id === 'prop-types' || id === 'axios') return require(id);
      if (id === 'react-router-dom') return { useNavigate: () => (...args) => navigation.push(args), useParams: () => params, useLocation: () => ({ state: routeState }) };
      if (id === 'recoil') return {
        atom(config) { defaults.set(config.key, config.default); if (!Object.hasOwn(atoms, config.key)) atoms[config.key] = structuredClone(config.default); return config.key; },
        atomFamily(config) { return parameter => { const key = `${config.key}:${typeof parameter}:${JSON.stringify(parameter)}`; if (!Object.hasOwn(atoms, key)) atoms[key] = structuredClone(config.default); return key; }; },
        useRecoilValue: key => atoms[key], useSetRecoilState: setter, useRecoilState: key => [atoms[key], setter(key)],
      };
      if (id.endsWith('/hooks/useAuthSession')) return { __esModule: true, default: () => currentLoggedIn };
      if (id.endsWith('/api/themeLikeAPI') && !deferLikes) return { postThemeLikeAPI: id => { mutations.push(['post', id]); return Promise.resolve(); }, deleteThemeLikeAPI: id => { mutations.push(['delete', id]); return Promise.resolve(); } };
      if (id.endsWith('/hooks/useDevice')) return { __esModule: true, default: () => ({ isMobile }) };
      if (id.includes('app/API')) return { api };
      if (id.includes('/model/') || id.endsWith('/modal/scheduleAtom') || id.includes('/api/') || id.includes('/utils/')) {
        let target = path.resolve(path.dirname(filename), id);
        if (!path.extname(target)) target += '.ts';
        return load(target);
      }
      if (id === '@mui/material') return { Popover: 'Popover' };
      if (id.startsWith('@mui/')) { const name = id.split('/').at(-1); return { [name]: name }; }
      return { __esModule: true, default: id.replace(/\.(jsx|tsx)$/, '') };
    };
    const baselineRoot = process.env.MY_REVIEWS_SHARE_BASELINE;
    const baseline = baselineRoot && [path.join(baselineRoot, path.relative(root, filename)), path.join(baselineRoot, path.relative(root, filename).replace(/\.tsx$/, '.jsx'))].find(candidate => fs.existsSync(candidate));
    const source = baseline && fs.existsSync(baseline) ? baseline : filename;
    const code = ts.transpileModule(fs.readFileSync(source, 'utf8').replaceAll('import.meta.env.DEV', String(dev)), { fileName: source, compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: requireModule, Date,
      window: { ...browserEvents, innerWidth: isMobile ? 375 : 1280, location: { href: 'https://localhost:5173/review/share', origin: 'https://localhost:5173' }, open: (...args) => navigation.push(args),
        setTimeout(fn, ms) { timers.push({ fn, ms }); return timers.length; }, clearTimeout(id) { if (timers[id - 1]) timers[id - 1].cleared = true; } },
      URL: BrowserURL, Blob, File: require('node:buffer').File,
      ResizeObserver: hasResizeObserver ? PreviewObserver : undefined,
      requestAnimationFrame(fn) { frames.push(fn); queueMicrotask(() => fn(16)); return frames.length; },
      navigator: { ...(nativeShare ? { canShare: () => canShare, share: async value => { shares.push(value); if (deferNativeShare) return new Promise((resolve, reject) => nativeShareRequests.push({ resolve, reject })); if (shareError) throw shareError; } } : {}), clipboard: { writeText: async value => { if (copyFails) throw Error('clipboard denied'); copied.push(value); } } },
      setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
      document: { ...browserEvents, fonts: { ready: fontsReady },
        createElement() { return { click() { downloads.push({ href: this.href, download: this.download }); } }; },
        body: { appendChild() {}, removeChild() {} },
      },
      alert: message => alerts.push(message), console: { log() {}, error: (...args) => errors.push(args) },
    }, { filename: source });
    cache.set(filename, module.exports); return module.exports;
  }
  const component = load(path.join(root, relative)).default;
  const render = () => { cursor = 0; effects.length = 0; layoutEffects.length = 0; changed = false; tree = component(props); layoutEffects.splice(0).forEach(effect => effect()); effects.splice(0).forEach(effect => effect()); return tree; };
  const nodes = predicate => {
    const found = [];
    const visit = node => { if (Array.isArray(node)) return node.forEach(visit); if (!node || typeof node !== 'object') return; if (predicate(node)) found.push(node); visit(node.props?.children); };
    visit(tree); return found;
  };
  const text = node => Array.isArray(node) ? node.map(text).join('') : node == null || typeof node === 'boolean' ? '' : typeof node === 'object' ? text(node.props?.children) : String(node);
  return {
    atoms, writes, stateWrites, requests, navigation, alerts, errors, listeners, copied, timers, mutations, preview, observers, frames, imageExports, objectUrls, revokedUrls, downloads, shares, nativeShareRequests, render, nodes, text: () => text(tree), textOf: text,
    children: name => nodes(node => String(node.type).endsWith('/' + name) || node.type === name),
    update(next) { Object.assign(props, next); return render(); },
    setRouteState(next) { routeState = next; return render(); },
    setParams(next) { for (const key of Object.keys(params)) delete params[key]; Object.assign(params, next); return render(); },
    setLoggedIn(next) { currentLoggedIn = next; return render(); },
    setAtom(key, value) { setAtom(key, value); return render(); },
    click(textValue, event = {}) { const result = nodes(node => typeof node.props.onClick === 'function' && text(node) === textValue)[0].props.onClick(event); render(); return result; },
    dispatch(name, event) { listeners.get(name)?.forEach(fn => fn(event)); return render(); },
    async settle() { for (let i = 0; i < 20; i++) { await flush(); if (unmounted || !changed) return; render(); } throw Error('UI did not settle'); },
    unmount() { unmounted = true; slots.forEach(slot => slot?.cleanup?.()); },
  };
}


const reviewsUI = name => `src/features/mypage/ui/reviews/${name}.tsx`;
const ownReview = (id = 21) => ({ reviewId: id, themeId: 7, storeName: '매장', themeName: '테마', satisfactionLevel: 0, review: 'FLOWER', participantCnt: 0, isEscaped: null, usedHint: 0, remainingTime: '00:10:30', reviewComment: '', playedAt: null, createdAt: '2026-11-02' });

test('4-28 sort dropdown retains options, Recoil values, outside clicks and cleanup', () => {
  const m = mount(reviewsUI('ReviewDropDown')); m.render();
  assert.equal(m.text(), '최근 방문 순'); m.click('최근 방문 순');
  assert.match(m.text(), /최신 작성 순/); m.click('최신 작성 순');
  assert.equal(m.atoms.reviewSortAtom, 'CREATED_AT_DESC'); assert.equal(m.text(), '최신 작성 순');
  m.click('최신 작성 순'); const inside = {};
  m.nodes(node => node.props.ref)[0].props.ref.current = { contains: target => target === inside };
  m.dispatch('mousedown', { target: inside }); assert.match(m.text(), /최근 방문 순/);
  m.dispatch('mousedown', { target: null }); assert.equal(m.text(), '최신 작성 순');
  m.unmount(); assert.equal(m.listeners.get('mousedown').size, 0);
});

test('4-28 action dropdown preserves closed state, anchor exclusion, callbacks and cleanup', async () => {
  const calls = [], inside = {}, anchor = {}, anchorRef = { current: { contains: target => target === anchor } };
  const m = mount(reviewsUI('ReviewActionDropDown'), { props: { isOpen: false, anchorRef, onClose: () => calls.push('close'), onShare: async () => calls.push('share'), onEdit: async () => calls.push('edit'), onDelete: () => calls.push('delete') } }); m.render(); assert.equal(m.text(), '');
  m.update({ isOpen: true }); m.nodes(node => node.props.ref)[0].props.ref.current = { contains: target => target === inside };
  m.dispatch('mousedown', { target: inside }); m.dispatch('mousedown', { target: anchor }); assert.deepEqual(calls, []);
  await m.click('후기 공유'); await m.click('후기 수정'); m.click('후기 삭제'); m.dispatch('mousedown', { target: null });
  assert.deepEqual(calls, ['share', 'edit', 'delete', 'close']);
  m.unmount(); assert.equal(m.listeners.get('mousedown').size, 0);
});

test('4-28 own reviews keeps empty UI, sorting query, delete callback, edit theme metadata and refresh callback', async () => {
  const m = mount(reviewsUI('ReviewCardSection')); m.render(); assert.match(m.text(), /아직 작성한 후기가 없습니다/);
  assert.equal(m.requests[0].url, 'members/reviews'); assert.deepEqual(plain(m.requests[0].config.params), { page: 1, size: 1000, sortOption: 'PLAYED_AT_DESC' });
  m.requests[0].resolve({ contents: [ownReview(21), ownReview(22)] }); await m.settle();
  const cards = m.children('ReviewCard'); assert.deepEqual(cards.map(node => node.key), ['21', '22']);
  cards[0].props.onDeleted(21); m.render(); assert.equal(m.children('ReviewCard')[0].props.data.reviewId, 22);
  const edited = { ...ownReview(22), img: 'theme.png', uiState: { checkedDate: true, checkedHint: false, checkedPeople: true } };
  m.children('ReviewCard')[0].props.onEditStart(7, 22);
  m.children('ReviewCard')[0].props.onEdit(edited); m.render();
  assert.equal(m.atoms.reviewModalState, true);
  assert.deepEqual(plain(m.children('ReviewWriteModal')[0].props.themeData), { themeId: 7, themeName: '테마', storeName: '매장', img: 'theme.png' });
  assert.equal(m.children('ReviewWriteModal')[0].props.reviewId, 22); assert.equal(m.children('ReviewWriteModal')[0].props.isEditMode, true);
  const refreshed = m.children('ReviewWriteModal')[0].props.onUpdated(); assert.equal(m.requests.length, 2);
  m.requests[1].resolve({ contents: [] }); await refreshed; await m.settle(); assert.match(m.text(), /아직 작성한 후기가 없습니다/);
  m.setAtom('reviewSortAtom', 'CREATED_AT_DESC'); assert.equal(m.requests[2].config.params.sortOption, 'CREATED_AT_DESC');
  m.requests[2].resolve({ contents: [ownReview()] }); await m.settle();
});

test('4-28 reviews page keeps desktop back navigation and mobile layout branch', () => {
  for (const isMobile of [false, true]) {
    const m = mount('src/pages/myPage/ReviewsPage.tsx', { isMobile }); m.render();
    assert.match(m.text(), /내가 작성한 후기/); assert.equal(m.children('ReviewDropDown').length, 1); assert.equal(m.children('ReviewCardSection').length, 1);
    if (isMobile) assert.doesNotMatch(m.text(), /마이페이지로 돌아가기/);
    else { m.click('마이페이지로 돌아가기'); assert.deepEqual(m.navigation, [['/mypage']]); }
  }
});

const themeDetail = () => ({ themeId: 7, themeName: '테마', img: 'theme.png', storeInfo: { storeName: '매장' } });
const reviewDetail = () => ({ reviewId: 21, themeId: 7, memberId: 8, satisfactionLevel: 4.5, review: 'FLOWER', reviewComment: '', playedAt: null, participantList: [{ proficiency: 'MASTER', remark: '' }, { proficiency: null, remark: null }], isEscaped: null, remainingTime: null, failReason: null, hasViewedEnding: null, usedHint: null, minRecommendedHeadcount: null, maxRecommendedHeadcount: null, reviewTagList: null, lockRatio: null, level: 3, levelComment: '', horrorLevel: 0, horrorComment: '', activityLevel: 0, activityComment: '', recommendedCloth: null, storyLevel: 0, storyComment: '', interiorLevel: 0, interiorComment: '', createdAt: '2026-11-02' });

test('4-28 review card preserves desktop/mobile nullable/zero labels, detail route and contract-backed image fallback', async () => {
  for (const isMobile of [false, true]) {
    for (const image of ['theme.png', '', null, undefined, 'failure']) {
      const m = mount(reviewsUI('ReviewCard'), { isMobile, props: { data: ownReview(), onDeleted() {}, onEdit() {} } }); m.render();
      assert.match(m.nodes(node => node.type === 'styled.img')[0].props.src, /thumbnailImg.png$/);
      assert.equal(m.requests[0].url, 'themes/7');
      if (image === 'failure') m.requests[0].reject(Error('image GET failed'));
      else m.requests[0].resolve({ ...themeDetail(), img: image });
      await m.settle();
      const src = m.nodes(node => node.type === 'styled.img')[0].props.src;
      if (image === 'theme.png') assert.equal(src, image); else assert.match(src, /thumbnailImg.png$/);
      assert.match(m.text(), /0.0/); assert.match(m.text(), /0개 사용/); assert.doesNotMatch(m.text(), /분 남김/);
      if (!isMobile) { m.click('후기 상세보기'); assert.deepEqual(plain(m.navigation[0]), ['/theme/7/review/21', { state: { backButtonText: '내 후기 목록으로 돌아가기' } }]); }
      else assert.equal(m.children('ReviewActionDropDown')[0].props.anchorRef.current, null);
    }
  }
});

test('4-28 review card share keeps the list DTO plus actual detail thumbnail in navigation state', async () => {
  for (const isMobile of [false, true]) {
    const data = ownReview(), m = mount(reviewsUI('ReviewCard'), { isMobile, props: { data, onDeleted() {}, onEdit() {} } }); m.render();
    m.requests[0].resolve(themeDetail()); await m.settle();
    if (isMobile) await m.children('ReviewActionDropDown')[0].props.onShare(); else await m.click('후기 공유하기');
    assert.equal(m.navigation[0][0], '/review/share');
    assert.deepEqual(plain(m.navigation[0][1].state.reviewData), { ...data, thumbnailUrl: 'theme.png', img: 'theme.png' });
    assert.equal(m.requests.length, 1);
  }
});

test('4-28 edit restores detail DTO, nullable participants and all three UI toggles without normalizing the draft', async () => {
  const edits = [], m = mount(reviewsUI('ReviewCard'), { isMobile: true, props: { data: ownReview(), onDeleted() {}, onEdit: value => edits.push(value) } }); m.render();
  m.requests[0].resolve(themeDetail()); await m.settle();
  const pending = m.children('ReviewActionDropDown')[0].props.onEdit(); assert.equal(m.requests[1].url, 'themes/7');
  m.requests[1].resolve(themeDetail()); await m.settle(); assert.equal(m.requests[2].url, 'themes/7/reviews/21');
  const detail = reviewDetail(); m.requests[2].resolve(detail); await pending; await m.settle();
  const expected = { ...detail, img: 'theme.png', uiState: { checkedDate: true, checkedHint: true, checkedPeople: true } };
  assert.deepEqual(plain(m.atoms['reviewStateFamily:number:7']), expected);
  assert.deepEqual(plain(edits), [{ ...expected, themeName: '테마', storeName: '매장' }]);
});

test('4-28 deletion retains confirmation sequence, original URL and error guidance without a real mutation', async () => {
  for (const failed of [false, true]) {
    const deleted = [], m = mount(reviewsUI('ReviewCard'), { isMobile: true, props: { data: ownReview(), onDeleted: id => deleted.push(id), onEdit() {} } }); m.render();
    m.requests[0].resolve(themeDetail()); await m.settle(); m.children('ReviewActionDropDown')[0].props.onDelete(); m.render();
    m.children('PopUpModal')[0].props.onConfirm(); assert.equal(m.requests[1].method, 'DELETE'); assert.equal(m.requests[1].url, 'themes/7/reviews/21');
    if (failed) m.requests[1].reject(Error('failed')); else m.requests[1].resolve('deleted'); await m.settle();
    if (failed) { assert.deepEqual(m.alerts, ['삭제 중 오류가 발생했습니다.']); assert.deepEqual(deleted, []); assert.equal(m.children('PopUpModal')[0].props.title, '후기 삭제'); }
    else { assert.equal(m.children('PopUpModal')[0].props.title, '삭제 완료'); assert.deepEqual(deleted, []); m.children('PopUpModal')[0].props.onConfirm(); assert.deepEqual(deleted, [21]); }
  }
});

const sharePage = 'src/pages/ReviewSharePage.tsx';
const templateIds = ['center-badge', 'bottom-record', 'poster', 'corner-stamp', 'date-card', 'minimal', 'score-grid', 'film'];
const templateNames = ['센터 배지', '하단 기록', '포스터', '코너 스탬프', '날짜 카드', '미니멀', '스코어 그리드', '필름 로그'];
const templateNodes = m => m.nodes(node => typeof node.type === 'function' && node.type.name === 'TemplateContent');
const previewImage = m => m.nodes(node => typeof node.props.onError === 'function' && node.props.src)[0];
const shareData = () => ({ ...ownReview(), thumbnailUrl: '/theme.png', participantList: [{ proficiency: null, remark: null }], minRecommendedHeadcount: null, maxRecommendedHeadcount: null });

for (const isMobile of [false, true]) {
  test(`4-29 ${isMobile ? 'mobile' : 'desktop'} retains fallback review and all eight templates without component extraction`, async () => {
    const m = mount(sharePage, { isMobile }); m.render(); await m.settle();
    assert.match(m.text(), /후기 정보가 없어 예시 템플릿/); assert.deepEqual(templateNodes(m).slice(1).map(node => node.props.templateId), templateIds);
    assert.equal(templateNodes(m)[0].props.data.themeName, '비밀의 화원');
    for (let i = 0; i < templateIds.length; i++) {
      const button = m.nodes(node => node.props.onClick && node.props.$active !== undefined && m.textOf(node).startsWith(templateNames[i]))[0];
      button.props.onClick(); m.render();
      const node = templateNodes(m)[0]; assert.equal(node.props.templateId, templateIds[i]); assert.match(m.textOf(node.type(node.props)), /비밀의 화원/);
    }
    assert.equal(m.observers.length, 1); assert.equal(m.observers[0].targets[0], m.preview);
    const scene = () => m.nodes(node => node.props.$sceneSize !== undefined)[0].props.$sceneSize;
    assert.equal(scene(), m.preview.width); m.preview.width += 20; m.observers[0].trigger(); await m.settle(); assert.equal(scene(), m.preview.width);
    m.unmount(); assert.equal(m.observers[0].disconnected, true);
    assert.equal(m.requests.length, 0);
  });
}

test('4-29 list/completed navigation data preserve zero, null, empty values, participant order and template display mapping', async () => {
  const cases = [
    { ...ownReview(), themeName: '', storeName: '', remainingTime: null, thumbnailUrl: '/list.png' },
    { ...reviewDetail(), participantList: [{ proficiency: null, remark: null }, {}], themeName: '완료 후기', storeName: '매장', thumbnailUrl: '/saved.png', participantCnt: 9, satisfactionLevel: 0, usedHint: 0 },
    { ...shareData(), participantList: [], participantCnt: 9, review: null, satisfactionLevel: null },
  ];
  for (const data of cases) {
    const before = structuredClone(data), m = mount(sharePage, { routeState: { reviewData: data } }); m.render(); await m.settle();
    const display = templateNodes(m)[0].props.data;
    assert.equal(display.themeName, data.themeName); assert.equal(display.storeName, data.storeName);
    assert.equal(display.satisfaction, data.satisfactionLevel == null ? '-' : '0.0'); assert.equal(display.usedHint, '0 hint');
    assert.equal(display.participantCount, Array.isArray(data.participantList) ? data.participantList.length ? `${data.participantList.length}인` : '-' : '-');
    assert.equal(display.result, '-'); assert.equal(display.remainingTime, data.remainingTime ? `10'30"` : '-');
    assert.deepEqual(data, before); assert.doesNotMatch(m.text(), /예시 템플릿/);
  }
});

test('4-29 image priority, supported development proxies and production proxy URLs remain unchanged', async () => {
  const url = 'https://firebasestorage.googleapis.com/v0/b/theme.png?alt=media&token=x';
  for (const [data, dev, expected] of [
    [{ ...shareData(), thumbnailUrl: url }, true, '/storage-proxy/v0/b/theme.png?alt=media&token=x'],
    [{ ...shareData(), thumbnailUrl: url }, false, `/api/image-proxy?url=${encodeURIComponent(url)}`],
    [{ ...shareData(), thumbnailUrl: 'blob:photo' }, true, 'blob:photo'],
    [{ ...shareData(), thumbnailUrl: 'data:image/png;base64,x' }, true, 'data:image/png;base64,x'],
    [{ ...ownReview(), img: '/image.png', themeImg: '/legacy.png' }, true, '/image.png'],
    [{ ...ownReview(), themeImg: '/legacy.png' }, true, '/legacy.png'],
    [{ ...shareData(), thumbnailUrl: 'https://localhost:5173/image.png' }, true, 'https://localhost:5173/image.png'],
    [{ ...shareData(), thumbnailUrl: 'not a url' }, true, 'not a url'],
  ]) {
    const m = mount(sharePage, { routeState: { reviewData: data }, dev }); m.render(); await m.settle(); assert.equal(previewImage(m).props.src, expected);
  }
});

test('4-29 proxy failure retains direct-image preview, export restriction, upload alternative and final fallback', async () => {
  const url = 'https://storage.googleapis.com/theme.png';
  const m = mount(sharePage, { routeState: { reviewData: { ...shareData(), thumbnailUrl: url } } }); m.render(); await m.settle();
  previewImage(m).props.onError(); await m.settle(); assert.equal(previewImage(m).props.src, url);
  m.click('공유하기'); assert.match(m.text(), /다운로드\/공유에는 사진 업로드/);
  await m.click('이미지 다운로드현재 템플릿을 PNG 이미지로 저장해요.'); await m.settle();
  assert.equal(m.imageExports.length, 0); assert.match(m.text(), /사진 업로드 이미지를 사용/);
  previewImage(m).props.onError(); await m.settle(); assert.match(previewImage(m).props.src, /thumbnailImg.png$/);
  m.setRouteState({ reviewData: { ...shareData(), thumbnailUrl: '/other.png' } }); await m.settle(); assert.equal(previewImage(m).props.src, '/other.png');
});

test('4-29 upload keeps object URL replacement/cleanup and resize-listener fallback', async () => {
  const m = mount(sharePage, { hasResizeObserver: false }); m.render(); await m.settle(); assert.equal(m.listeners.get('resize').size, 1);
  const upload = file => { m.nodes(node => node.props.type === 'file')[0].props.onChange({ target: { files: file ? [file] : [] } }); m.render(); };
  upload(null); assert.equal(m.objectUrls.length, 0);
  const first = new Blob(['first']), second = new Blob(['second']); upload(first); await m.settle();
  assert.equal(templateNodes(m)[0].props.backgroundImage, 'blob:mock-1'); upload(second); await m.settle();
  assert.equal(templateNodes(m)[0].props.backgroundImage, 'blob:mock-2'); assert.ok(m.revokedUrls.includes('blob:mock-1'));
  m.preview.width = 450; m.dispatch('resize', {}); await m.settle(); assert.equal(m.nodes(node => node.props.$sceneSize !== undefined)[0].props.$sceneSize, 450);
  m.unmount(); assert.ok(m.revokedUrls.includes('blob:mock-2')); assert.equal(m.listeners.get('resize').size, 0);
});

const downloadButton = '이미지 다운로드현재 템플릿을 PNG 이미지로 저장해요.';
const nativeShareButton = '다른 앱으로 공유현재 템플릿을 원하는 앱으로 바로 공유할 수 있어요.';

test('4-29 PNG download preserves 1080px export options, filename, pending/close behavior and blob cleanup', async () => {
  const m = mount(sharePage, { routeState: { reviewData: { ...shareData(), themeName: '테마 ! 이름' } } }); m.render(); await m.settle();
  m.click('공유하기');
  const backdrop = () => m.nodes(node => node.props.onClick && node.props.children?.props?.onClick)[0];
  let stopped = false; backdrop().props.children.props.onClick({ stopPropagation() { stopped = true; } }); assert.equal(stopped, true);
  const pending = m.click(downloadButton); await m.settle();
  assert.equal(m.imageExports[0].node, m.preview); assert.deepEqual(plain(m.imageExports[0].options), { cacheBust: true, includeQueryParams: true, canvasWidth: 1080, canvasHeight: 1080, pixelRatio: 1 });
  assert.equal(m.nodes(node => node.props.onClick && m.textOf(node) === downloadButton)[0].props.disabled, true);
  backdrop().props.onClick(); m.render(); assert.equal(m.nodes(node => node.props.$tone !== undefined).length, 1);
  m.imageExports[0].resolve(new Blob(['png'], { type: 'image/png' })); await pending; await m.settle();
  assert.equal(m.downloads[0].download, '테마-이름-center-badge.png'); assert.ok(m.revokedUrls.includes(m.downloads[0].href)); assert.match(m.text(), /이미지를 다운로드했어요/);
  assert.equal(m.frames.length, 4); backdrop().props.onClick(); m.render(); assert.equal(m.nodes(node => node.props.$tone !== undefined).length, 0);
});

test('4-29 native share, unsupported device download and AbortError retain existing guidance', async () => {
  for (const kind of ['native', 'unsupported', 'cannot-share', 'cancel']) {
    const m = mount(sharePage, { isMobile: kind === 'native' || kind === 'cancel', routeState: { reviewData: shareData() }, nativeShare: kind !== 'unsupported', canShare: kind !== 'cannot-share', shareError: kind === 'cancel' ? { name: 'AbortError' } : undefined }); m.render(); await m.settle(); m.click('공유하기');
    const pending = m.click(nativeShareButton); await m.settle(); m.imageExports[0].resolve(new Blob(['png'], { type: 'image/png' })); await pending; await m.settle();
    if (kind === 'native') { assert.equal(m.shares.length, 1); assert.equal(m.shares[0].files[0].name, '테마-center-badge.png'); assert.match(m.text(), /공유 메뉴가 열렸어요/); }
    else if (kind === 'cancel') { assert.match(m.text(), /공유가 취소되었어요/); assert.equal(m.downloads.length, 0); }
    else { assert.equal(m.downloads.length, 1); assert.match(m.text(), /먼저 이미지를 저장/); }
    assert.equal(m.nodes(node => node.props.onClick && m.textOf(node) === nativeShareButton)[0].props.disabled, false);
  }
});

test('4-29 export failures keep error status and allow retry without changing source review data', async () => {
  for (const result of ['null-blob', 'error', 'plain-error', 'primitive-error', 'native-error']) {
    const data = shareData(), m = mount(sharePage, { routeState: { reviewData: data }, nativeShare: result === 'native-error', shareError: result === 'native-error' ? Error('share failed') : undefined }); m.render(); await m.settle(); m.click('공유하기');
    const pending = m.click(result === 'native-error' ? nativeShareButton : downloadButton); await m.settle();
    if (result === 'error') m.imageExports[0].reject(Error('render failed'));
    else if (result === 'plain-error') m.imageExports[0].reject({ message: 'THEME_IMAGE_PROXY_REQUIRED' });
    else if (result === 'primitive-error') m.imageExports[0].reject('render failed');
    else m.imageExports[0].resolve(result === 'null-blob' ? null : new Blob(['png']));
    await pending; await m.settle(); assert.equal(m.nodes(node => node.props.$tone !== undefined)[0].props.$tone, 'error');
    assert.equal(m.downloads.length, 0); assert.equal(m.nodes(node => node.props.onClick && m.textOf(node) === downloadButton)[0].props.disabled, false);
    const retry = m.click(downloadButton); await m.settle(); assert.equal(m.imageExports.length, 2); m.imageExports[1].resolve(new Blob(['png'])); await retry; await m.settle(); assert.equal(m.downloads.length, 1);
  }
});

test('4-29 export waits for image load/decode and disables cache busting for object URLs', async () => {
  const handlers = new Map(); let decoded = 0;
  const image = { currentSrc: 'blob:uploaded', complete: false, decode: async () => { decoded++; }, addEventListener(name, fn) { handlers.set(name, fn); }, removeEventListener(name) { handlers.delete(name); } };
  const m = mount(sharePage, { images: [image] }); m.render(); await m.settle(); m.click('공유하기');
  const pending = m.click(downloadButton); await m.settle(); assert.equal(m.imageExports.length, 0); assert.equal(m.timers[0].ms, 3000);
  image.complete = true; handlers.get('load')(); await m.settle(); assert.equal(handlers.size, 0); assert.equal(m.imageExports[0].options.cacheBust, false); assert.equal(decoded, 2);
  m.imageExports[0].resolve(new Blob(['png'])); await pending; assert.equal(m.timers[0].cleared, true);
});

const listedIds = m => m.children('ReviewCard').map(node => node.props.data.reviewId);
const editableReview = (id = 21) => ({ ...reviewDetail(), reviewId: id, img: 'theme.png', themeName: '테마', storeName: '매장', uiState: { checkedDate: true, checkedHint: true, checkedPeople: true } });
const openEditForm = (m, id = 21) => {
  const card = m.children('ReviewCard').find(node => node.props.data.reviewId === id);
  card.props.onEditStart(7, id); card.props.onEdit(editableReview(id)); m.render();
};

async function editCards() {
  const sharedAtoms = {};
  const parent = mount(reviewsUI('ReviewCardSection'), { sharedAtoms }); parent.render();
  parent.requests[0].resolve({ contents: [ownReview(21), ownReview(22)] }); await parent.settle();
  const cards = parent.children('ReviewCard').map(node => mount(reviewsUI('ReviewCard'), { props: node.props, sharedAtoms, isMobile: true }));
  for (const card of cards) { card.render(); card.requests[0].resolve(themeDetail()); await card.settle(); }
  return { parent, a: cards[0], b: cards[1] };
}

async function editToDetail(card) {
  const pending = card.children('ReviewActionDropDown')[0].props.onEdit();
  const theme = card.requests.at(-1); assert.equal(theme.url, 'themes/7'); theme.resolve(themeDetail()); await card.settle();
  return { pending, detail: card.requests.at(-1) };
}

test('own review races: sort A → B → A and overlapping refreshes accept only latest results and preserve the fixed query', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(reviewsUI('ReviewCardSection')); m.render();
    m.setAtom('reviewSortAtom', 'CREATED_AT_DESC'); m.setAtom('reviewSortAtom', 'PLAYED_AT_DESC');
    assert.deepEqual(m.requests.map(request => plain(request.config.params)), [
      { page: 1, size: 1000, sortOption: 'PLAYED_AT_DESC' }, { page: 1, size: 1000, sortOption: 'CREATED_AT_DESC' }, { page: 1, size: 1000, sortOption: 'PLAYED_AT_DESC' },
    ]);
    m.requests[2].resolve({ contents: [ownReview(23)] }); await m.settle(); const count = m.stateWrites.length;
    m.requests[0].resolve({ contents: [ownReview(21)] });
    if (finish === 'resolve') m.requests[1].resolve({ contents: [ownReview(22)] }); else m.requests[1].reject(Error('old B'));
    await m.settle(); assert.deepEqual(listedIds(m), [23]); assert.equal(m.stateWrites.length, count);
    assert.equal(m.errors.filter(args => args[0] === '내 후기 목록 조회 실패:').length, 0);
    openEditForm(m, 23); const refresh = m.children('ReviewWriteModal')[0].props.onUpdated;
    const first = refresh(), second = refresh();
    m.requests[4].resolve({ contents: [ownReview(25)] }); await second; await m.settle();
    m.requests[3].resolve({ contents: [ownReview(24)] }); await first; await m.settle(); assert.deepEqual(listedIds(m), [25]);
  }
});

test('own review races: current query/refresh failures remain retryable and obsolete responses cannot restore deleted reviews', async () => {
  const m = mount(reviewsUI('ReviewCardSection')); m.render(); m.requests[0].reject(Error('initial failure')); await m.settle(); assert.match(m.text(), /아직 작성한 후기가 없습니다/);
  m.setAtom('reviewSortAtom', 'CREATED_AT_DESC'); m.requests[1].resolve({ contents: [ownReview()] }); await m.settle(); openEditForm(m);
  const refresh = m.children('ReviewWriteModal')[0].props.onUpdated;
  const failed = refresh(), rejected = assert.rejects(failed, /refresh failure/); m.requests[2].reject(Error('refresh failure')); await rejected;
  const retry = refresh(); m.requests[3].resolve({ contents: [ownReview(21), ownReview(22)] }); await retry; await m.settle();
  const oldList = refresh(); m.children('ReviewCard')[0].props.onDeleted(21); m.render();
  m.requests[4].resolve({ contents: [ownReview(21), ownReview(22)] }); await oldList; await m.settle(); assert.deepEqual(listedIds(m), [22]);
});

test('own review races: unmount discards late list success/error and retained callbacks cannot start a new query', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(reviewsUI('ReviewCardSection')); m.render(); m.unmount(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve({ contents: [ownReview()] }); else m.requests[0].reject(Error('unmounted'));
    await m.settle(); assert.equal(m.stateWrites.length, writes);
    assert.equal(m.errors.filter(args => args[0] === '내 후기 목록 조회 실패:').length, 0);
  }
  const m = mount(reviewsUI('ReviewCardSection')); m.render(); m.requests[0].resolve({ contents: [ownReview()] }); await m.settle(); openEditForm(m);
  const refresh = m.children('ReviewWriteModal')[0].props.onUpdated; m.unmount(); await refresh(); assert.equal(m.requests.length, 1);
});

test('edit entry races: cross-card A → B → A cannot overwrite the newest shared draft or selected form', async () => {
  for (const finish of ['resolve', 'reject']) {
    const { parent, a, b } = await editCards();
    const firstA = await editToDetail(a), oldB = await editToDetail(b), latestA = await editToDetail(a);
    latestA.detail.resolve({ ...reviewDetail(), reviewComment: 'latest A' }); await latestA.pending; await parent.settle();
    assert.equal(parent.children('ReviewWriteModal')[0].props.reviewId, 21); assert.equal(parent.atoms['reviewStateFamily:number:7'].reviewComment, 'latest A');
    const writes = a.writes.length + b.writes.length, parentWrites = parent.stateWrites.length;
    if (finish === 'resolve') { firstA.detail.resolve({ ...reviewDetail(), reviewComment: 'old A' }); oldB.detail.resolve({ ...reviewDetail(), reviewId: 22, reviewComment: 'old B' }); }
    else { firstA.detail.reject(Error('old A')); oldB.detail.reject(Error('old B')); }
    await firstA.pending; await oldB.pending; await parent.settle();
    assert.equal(a.writes.length + b.writes.length, writes); assert.equal(parent.stateWrites.length, parentWrites);
    assert.equal(parent.atoms['reviewStateFamily:number:7'].reviewComment, 'latest A'); assert.deepEqual(a.alerts.concat(b.alerts), []);
  }
});

test('edit entry races: previous form is hidden while loading another review; failure keeps it hidden and retry restores null fields', async () => {
  const { parent, a, b } = await editCards();
  const initial = await editToDetail(a); initial.detail.resolve(reviewDetail()); await initial.pending; await parent.settle(); assert.equal(parent.children('ReviewWriteModal').length, 1);
  const initialKey = parent.children('ReviewWriteModal')[0].key;
  const failed = await editToDetail(b); parent.render(); assert.equal(parent.children('ReviewWriteModal').length, 0);
  assert.equal(parent.atoms.reviewModalState, false);
  failed.detail.reject(Error('current B failure')); await failed.pending; await parent.settle(); assert.equal(parent.children('ReviewWriteModal').length, 0);
  assert.equal(parent.atoms.reviewModalState, false);
  assert.deepEqual(b.alerts, ['후기 정보를 불러오는 중 오류가 발생했습니다.']);
  const retry = await editToDetail(b); retry.detail.resolve({ ...reviewDetail(), reviewId: 22, reviewComment: 'B' }); await retry.pending; await parent.settle();
  assert.equal(parent.children('ReviewWriteModal')[0].props.reviewId, 22); assert.equal(parent.atoms['reviewStateFamily:number:7'].participantList[1].remark, null);
  const bKey = parent.children('ReviewWriteModal')[0].key; assert.notEqual(bKey, initialKey);
  assert.equal(parent.atoms['reviewStateFamily:number:7'].reviewComment, 'B');
  const again = await editToDetail(a); again.detail.resolve(reviewDetail()); await again.pending; await parent.settle();
  assert.equal(parent.children('ReviewWriteModal')[0].props.reviewId, 21); assert.notEqual(parent.children('ReviewWriteModal')[0].key, initialKey); assert.notEqual(parent.children('ReviewWriteModal')[0].key, bKey);
});

test('edit entry races: sort changes and parent/card unmount suppress old success/error before a shared draft write', async () => {
  for (const invalidate of ['sort', 'parent-unmount', 'card-unmount']) {
    for (const finish of ['resolve', 'reject']) {
      const { parent, a } = await editCards(), old = await editToDetail(a);
      if (invalidate === 'sort') parent.setAtom('reviewSortAtom', 'CREATED_AT_DESC');
      else if (invalidate === 'parent-unmount') parent.unmount(); else a.unmount();
      const writes = a.writes.length, states = a.stateWrites.length, parentStates = parent.stateWrites.length;
      if (finish === 'resolve') old.detail.resolve(reviewDetail()); else old.detail.reject(Error('obsolete edit'));
      await old.pending; await a.settle(); await parent.settle();
      assert.equal(a.writes.length, writes); assert.equal(a.stateWrites.length, states); assert.equal(parent.stateWrites.length, parentStates); assert.deepEqual(a.alerts, []);
    }
  }
});

test('card target races: thumbnails A → B → A clear immediately; late edit, share and image responses cannot leak across targets', async () => {
  const edits = [], m = mount(reviewsUI('ReviewCard'), { isMobile: true, props: { data: ownReview(), onDeleted() {}, onEdit: data => edits.push(data) } }); m.render();
  m.requests[0].resolve({ ...themeDetail(), img: 'A.png' }); await m.settle();
  const old = await editToDetail(m); m.update({ data: { ...ownReview(22), themeId: 8 } });
  assert.match(m.nodes(node => node.type === 'styled.img')[0].props.src, /thumbnailImg.png$/);
  m.update({ data: ownReview() }); m.requests.at(-1).resolve({ ...themeDetail(), img: 'latest-A.png' }); await m.settle();
  old.detail.resolve(reviewDetail()); await old.pending; m.requests.at(-2).resolve({ ...themeDetail(), img: 'old-B.png' }); await m.settle();
  assert.equal(m.nodes(node => node.type === 'styled.img')[0].props.src, 'latest-A.png'); assert.deepEqual(edits, []);
  const share = mount(reviewsUI('ReviewCard'), { isMobile: true, props: { data: ownReview(), onDeleted() {}, onEdit() {} } }); share.render();
  const pending = share.children('ReviewActionDropDown')[0].props.onShare(); share.unmount(); const count = share.stateWrites.length;
  share.requests[0].resolve(themeDetail()); share.requests[1].resolve(themeDetail()); await pending; await share.settle(); assert.equal(share.stateWrites.length, count); assert.deepEqual(share.navigation, []);
});

const exportHandler = (m, kind = 'download') => m.nodes(node => node.props.onClick && m.textOf(node) === (kind === 'share' ? nativeShareButton : downloadButton))[0].props.onClick;
const exportDisabled = m => m.nodes(node => node.props.onClick && m.textOf(node) === downloadButton)[0].props.disabled;
const chooseTemplate = (m, index) => { m.nodes(node => node.props.onClick && node.props.$active !== undefined && m.textOf(node).startsWith(templateNames[index]))[0].props.onClick(); m.render(); };
const uploadPhoto = m => { m.nodes(node => node.props.type === 'file')[0].props.onChange({ target: { files: [new Blob(['photo'])] } }); m.render(); };
async function openShare(options = {}) { const m = mount(sharePage, { routeState: { reviewData: shareData() }, ...options }); m.render(); await m.settle(); m.click('공유하기'); return m; }

test('share races: synchronous double clicks and cross-action clicks share one lock, then allow a subsequent operation', async () => {
  for (const kind of ['download', 'share']) {
    const m = await openShare({ nativeShare: true });
    const submit = exportHandler(m, kind), other = exportHandler(m, kind === 'download' ? 'share' : 'download');
    const first = submit(), duplicate = submit(), competing = other(); m.render(); await m.settle();
    assert.equal(m.imageExports.length, 1); assert.equal(exportDisabled(m), true);
    m.imageExports[0].resolve(new Blob(['first'])); await Promise.all([first, duplicate, competing]); await m.settle();
    assert.equal(m.downloads.length + m.shares.length, 1); assert.equal(exportDisabled(m), false);
    const next = exportHandler(m, kind)(); m.render(); await m.settle(); assert.equal(m.imageExports.length, 2);
    m.imageExports[1].resolve(new Blob(['second'])); await next; await m.settle(); assert.equal(m.downloads.length + m.shares.length, 2);
  }
});

test('share races: template A → B → A rejects stale success/error and stale finally never unlocks the latest export', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = await openShare();
    const firstA = exportHandler(m)(); m.render(); await m.settle(); chooseTemplate(m, 2); await m.settle();
    const oldB = exportHandler(m)(); m.render(); await m.settle(); chooseTemplate(m, 0); await m.settle();
    const latest = exportHandler(m)(); m.render(); await m.settle(); assert.equal(m.imageExports.length, 3);
    const writes = m.stateWrites.length;
    if (finish === 'resolve') { m.imageExports[0].resolve(new Blob(['old A'])); m.imageExports[1].resolve(new Blob(['old B'])); }
    else { m.imageExports[0].reject(Error('old A')); m.imageExports[1].reject(Error('old B')); }
    await firstA; await oldB; await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.errors.length, 0);
    assert.equal(m.downloads.length, 0); assert.equal(exportDisabled(m), true);
    await exportHandler(m)(); await m.settle(); assert.equal(m.imageExports.length, 3);
    const blob = new Blob(['latest A']); m.imageExports[2].resolve(blob); await latest; await m.settle();
    assert.equal(m.downloads.length, 1); assert.equal(m.objectUrls[0].blob, blob); assert.equal(m.downloads[0].download, '테마-center-badge.png'); assert.equal(exportDisabled(m), false);
  }
});

test('share races: upload, background switch and theme-image fallback invalidate old exports without changing retry filenames', async () => {
  for (const change of ['upload', 'background', 'image-fallback']) {
    const m = await openShare({ routeState: { reviewData: { ...shareData(), thumbnailUrl: change === 'image-fallback' ? 'https://storage.googleapis.com/theme.png' : '/theme.png' } } });
    if (change === 'background') { uploadPhoto(m); await m.settle(); }
    const old = exportHandler(m)(); m.render(); await m.settle();
    if (change === 'upload') uploadPhoto(m);
    else if (change === 'background') m.click('테마 사진');
    else previewImage(m).props.onError();
    await m.settle(); assert.equal(exportDisabled(m), false);
    m.imageExports[0].resolve(new Blob(['old photo'])); await old; await m.settle(); assert.equal(m.downloads.length, 0);
    if (change === 'image-fallback') { previewImage(m).props.onError(); await m.settle(); }
    const retry = exportHandler(m)(); m.render(); await m.settle(); assert.equal(m.imageExports.length, 2);
    m.imageExports[1].resolve(new Blob(['current photo'])); await retry; await m.settle(); assert.equal(m.downloads.length, 1); assert.equal(m.downloads[0].download, '테마-center-badge.png');
  }
});

test('share races: review A → B → A uses new generations even when returning to the exact same navigation object', async () => {
  const a = shareData(), b = { ...shareData(), reviewId: 22, themeName: 'B' }, m = await openShare({ routeState: { reviewData: a } });
  const oldA = exportHandler(m)(); m.render(); await m.settle(); m.setRouteState({ reviewData: b }); await m.settle();
  const oldB = exportHandler(m)(); m.render(); await m.settle(); m.setRouteState({ reviewData: a }); await m.settle();
  const latest = exportHandler(m)(); m.render(); await m.settle();
  m.imageExports[1].resolve(new Blob(['B'])); m.imageExports[0].resolve(new Blob(['old A'])); await oldA; await oldB; await m.settle(); assert.equal(m.downloads.length, 0); assert.equal(exportDisabled(m), true);
  m.imageExports[2].resolve(new Blob(['latest A'])); await latest; await m.settle(); assert.equal(m.downloads.length, 1); assert.equal(m.downloads[0].download, '테마-center-badge.png');
});

test('share races: context changes while waiting for fonts prevent obsolete html-to-image work from starting', async () => {
  let releaseFonts; const fontsReady = new Promise(resolve => { releaseFonts = resolve; });
  const m = await openShare({ fontsReady }); const old = exportHandler(m)(); m.render(); await m.settle(); assert.equal(m.imageExports.length, 0);
  chooseTemplate(m, 7); await m.settle(); const latest = exportHandler(m)(); m.render(); await m.settle();
  releaseFonts(); await old; await m.settle(); assert.equal(m.imageExports.length, 1); assert.equal(m.downloads.length, 0);
  m.imageExports[0].resolve(new Blob(['film'])); await latest; await m.settle(); assert.equal(m.downloads[0].download, '테마-film.png');
});

test('share races: unmount during rasterization or font waiting blocks late state writes and external output', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = await openShare(), pending = exportHandler(m)(); m.render(); await m.settle(); m.unmount(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.imageExports[0].resolve(new Blob(['obsolete'])); else m.imageExports[0].reject(Error('obsolete'));
    await pending; await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.downloads.length + m.shares.length, 0); assert.equal(m.errors.length, 0);
  }
  let releaseFonts; const fontsReady = new Promise(resolve => { releaseFonts = resolve; });
  const m = await openShare({ fontsReady }), pending = exportHandler(m)(); m.render(); await m.settle(); m.unmount(); const writes = m.stateWrites.length;
  releaseFonts(); await pending; await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.imageExports.length, 0);
});

test('share races: an already opened system share is not cancelled, but its late result/finally cannot affect a new export', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = await openShare({ nativeShare: true, deferNativeShare: true });
    const old = exportHandler(m, 'share')(); m.render(); await m.settle(); m.imageExports[0].resolve(new Blob(['old system share'])); await m.settle(); assert.equal(m.shares.length, 1);
    chooseTemplate(m, 2); await m.settle(); const latest = exportHandler(m, 'share')(); m.render(); await m.settle(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.nativeShareRequests[0].resolve(); else m.nativeShareRequests[0].reject({ name: 'AbortError' });
    await old; await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(exportDisabled(m), true); assert.equal(m.shares.length, 1);
    await exportHandler(m)(); await m.settle(); assert.equal(m.imageExports.length, 2);
    m.imageExports[1].resolve(new Blob(['latest system share'])); await m.settle(); assert.equal(m.shares.length, 2); assert.equal(m.shares[1].files[0].name, '테마-poster.png');
    m.nativeShareRequests[1].resolve(); await latest; await m.settle(); assert.match(m.text(), /공유 메뉴가 열렸어요/); assert.equal(exportDisabled(m), false);
  }
});

test('share races: native-share failure permits retry and unmount does not claim to cancel an already invoked share', async () => {
  const m = await openShare({ nativeShare: true, deferNativeShare: true });
  const failed = exportHandler(m, 'share')(); m.render(); await m.settle(); m.imageExports[0].resolve(new Blob(['failed'])); await m.settle(); m.nativeShareRequests[0].reject(Error('share failed')); await failed; await m.settle();
  assert.match(m.text(), /공유를 준비하지 못했어요/); assert.equal(exportDisabled(m), false);
  const retry = exportHandler(m, 'share')(); m.render(); await m.settle(); m.imageExports[1].resolve(new Blob(['retry'])); await m.settle(); assert.equal(m.shares.length, 2);
  m.unmount(); const writes = m.stateWrites.length; m.nativeShareRequests[1].resolve(); await retry; await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.shares.length, 2); assert.equal(m.downloads.length, 0);
});
