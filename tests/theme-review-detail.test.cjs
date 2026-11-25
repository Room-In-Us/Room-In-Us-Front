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
function mount(relative, { props = {}, values = {}, isMobile = false, sharedAtoms, params = {}, routeState = null, loggedIn = false, copyFails = false, deferLikes = false } = {}) {
  const atoms = sharedAtoms || { ...values }, slots = [], effects = [], layoutEffects = [], writes = [], stateWrites = [], requests = [], navigation = [], alerts = [], errors = [];
  if (sharedAtoms) for (const [key, value] of Object.entries(values)) if (!Object.hasOwn(atoms, key)) atoms[key] = value;
  const cache = new Map(), defaults = new Map(), setters = new Map();
  const listeners = new Map(), copied = [], timers = [], mutations = [];
  const dataLayer = [];
  let currentLoggedIn = loggedIn;
  let cursor = 0, changed = false, tree, unmounted = false;
  const setAtom = (key, value) => { atoms[key] = typeof value === 'function' ? value(atoms[key]) : value; writes.push({ key, value: atoms[key] }); changed = true; };
  const setter = key => { if (!setters.has(key)) setters.set(key, value => setAtom(key, value)); return setters.get(key); };
  const effectHook = queue => (effect, deps) => {
    const i = cursor++;
    if (!slots[i] || deps.some((value, j) => !Object.is(value, slots[i].deps[j]))) {
      const previous = slots[i]; slots[i] = { deps, effect, isLayout: queue === layoutEffects };
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
    useEffect: effectHook(effects),
    useLayoutEffect: effectHook(layoutEffects),
  };
  const styled = new Proxy(target => () => `styled(${String(target)})`, { get: (_, name) => () => `styled.${String(name)}` });
  const css = () => '';
  const jsx = (type, props, key) => ({ type, props: props || {}, key: key === undefined ? null : String(key) });
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
      if (id === 'react') return { ...react, __esModule: true, default: react };
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled, css };
      if (id === 'dayjs' || id === 'date-fns' || id === 'prop-types' || id === 'axios') return require(id);
      if (id === 'react-router-dom') return { useNavigate: () => (...args) => navigation.push(args), useParams: () => params, useLocation: () => ({ state: routeState }), useNavigationType: () => 'POP' };
      if (id === 'recoil') return {
        atom(config) { defaults.set(config.key, config.default); if (!Object.hasOwn(atoms, config.key)) atoms[config.key] = structuredClone(config.default); return config.key; },
        atomFamily(config) { return parameter => `${config.key}:${String(parameter)}`; },
        useRecoilValue: key => atoms[key], useSetRecoilState: setter, useRecoilState: key => [atoms[key], setter(key)],
      };
      if (id.endsWith('/hooks/useAuthSession')) return { __esModule: true, default: () => currentLoggedIn };
      if (id.endsWith('/api/themeLikeAPI') && !deferLikes) return { postThemeLikeAPI: id => { mutations.push(['post', id]); return Promise.resolve(); }, deleteThemeLikeAPI: id => { mutations.push(['delete', id]); return Promise.resolve(); } };
      if (id.endsWith('/hooks/useDevice')) return { __esModule: true, default: () => ({ isMobile }) };
      if (id.includes('app/API')) return { api };
      if (id.includes('/model/') || id.endsWith('/modal/scheduleAtom') || id.endsWith('/filter/OptionList') || id.includes('/api/') || id.includes('/utils/')) {
        let target = path.resolve(path.dirname(filename), id);
        if (!path.extname(target)) target += '.ts';
        return load(target);
      }
      if (id === '@mui/material') return { Popover: 'Popover' };
      if (id.startsWith('@mui/')) { const name = id.split('/').at(-1); return { [name]: name }; }
      return { __esModule: true, default: id.replace(/\.(jsx|tsx)$/, '') };
    };
    const baselineRoot = process.env.DETAIL_UI_BASELINE;
    const baseline = baselineRoot && [path.join(baselineRoot, path.relative(root, filename)), path.join(baselineRoot, path.relative(root, filename).replace(/\.tsx$/, '.jsx'))].find(candidate => fs.existsSync(candidate));
    const source = baseline && fs.existsSync(baseline) ? baseline : filename;
    const code = ts.transpileModule(fs.readFileSync(source, 'utf8'), { fileName: source, compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: requireModule, Date,
      window: { dataLayer, innerWidth: isMobile ? 375 : 1280, location: { href: 'https://localhost:5173/theme/7', pathname: '/theme/7' }, open: (...args) => navigation.push(args) },
      navigator: { clipboard: { writeText: async value => { if (copyFails) throw Error('clipboard denied'); copied.push(value); } } },
      setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; },
      document: { addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); }, removeEventListener(name, fn) { listeners.get(name)?.delete(fn); } },
      alert: message => alerts.push(message), console: { log() {}, error: (...args) => errors.push(args) },
    }, { filename: source });
    cache.set(filename, module.exports); return module.exports;
  }
  const component = load(path.join(root, relative)).default;
  const render = ({ deferPassive = false } = {}) => { cursor = 0; effects.length = 0; layoutEffects.length = 0; changed = false; tree = component(props); layoutEffects.splice(0).forEach(effect => effect()); if (!deferPassive) effects.splice(0).forEach(effect => effect()); return tree; };
  const nodes = predicate => {
    const found = [];
    const visit = node => { if (Array.isArray(node)) return node.forEach(visit); if (!node || typeof node !== 'object') return; if (predicate(node)) found.push(node); visit(node.props?.children); };
    visit(tree); return found;
  };
  const text = node => Array.isArray(node) ? node.map(text).join('') : node == null || typeof node === 'boolean' ? '' : typeof node === 'object' ? text(node.props?.children) : String(node);
  return {
    atoms, writes, stateWrites, requests, navigation, alerts, errors, listeners, copied, timers, mutations, dataLayer, render, nodes, text: () => text(tree), textOf: text,
    children: name => nodes(node => String(node.type).endsWith('/' + name) || node.type === name),
    update(next) { Object.assign(props, next); return render(); },
    setParams(next) { for (const key of Object.keys(params)) delete params[key]; Object.assign(params, next); return render(); },
    setLoggedIn(next) { currentLoggedIn = next; return render(); },
    setAtom(key, value, options) { setAtom(key, value); return render(options); },
    flushEffects() { effects.splice(0).forEach(effect => effect()); },
    click(textValue, event = {}) { const result = nodes(node => typeof node.props.onClick === 'function' && text(node) === textValue)[0].props.onClick(event); render(); return result; },
    dispatch(name, event) { listeners.get(name)?.forEach(fn => fn(event)); return render(); },
    async settle() { for (let i = 0; i < 20; i++) { await flush(); if (unmounted || !changed) return; render(); } throw Error('UI did not settle'); },
    unmount() { unmounted = true; slots.forEach(slot => slot?.cleanup?.()); },
    remount() { slots.length = 0; unmounted = false; return render(); },
    strictReplay() { slots.forEach(slot => slot?.cleanup?.()); for (const layout of [true, false]) for (const slot of slots) if (typeof slot?.effect === 'function' && slot.isLayout === layout) slot.cleanup = slot.effect(); },
  };
}

const themeUI = name => `src/features/themeDetail/ui/${name}.tsx`;
const reviewUI = name => `src/features/reviewDetail/ui/${name}.tsx`;
const review = (id = 21) => ({ reviewId: id, memberId: 8, memberNickname: '작성자', memberProficiency: 'MASTER', memberHorrorPos: 'FEARLESS', satisfactionLevel: 4.5, reviewEnum: 'FLOWER', headcount: 2, isEscaped: true, usedHint: 0, remainingTime: '00:10:30', reviewComment: `후기${id}`, playedAt: '2026-11-01', createdAt: '2026-11-02' });
const list = (id = 21, count = 7) => ({ satisfactionAvg: 4.5, reviewCnt: count, reviewList: [review(id)] });
const resultIds = m => m.children('ThemeReview').map(node => node.props.data.reviewId);
const themeDetail = (id = 7) => ({ themeId: id, themeName: `테마${id}`, img: `theme${id}.png`, playTime: 60, minRecommendedHeadcount: null, maxRecommendedHeadcount: null, genreList: null, level: 3, horrorLevel: 2, synopsis: '', storeInfo: { storeId: id + 100, storeName: `매장${id}`, locationName: '홍대', storeWebsiteUrl: 'https://example.com/store', storeReservationUrl: 'https://example.com/book', storeAddress: '주소', storeContact: '02-1234' }, isLiked: false });
const reviewDetail = (id = 21) => ({ reviewId: id, memberId: 8, themeId: 7, satisfactionLevel: 4.5, review: 'FLOWER', reviewComment: `상세후기${id}`, playedAt: null, participantList: [{ proficiency: 'MASTER', remark: '' }, { proficiency: null, remark: null }], isEscaped: null, remainingTime: '00:10:30', failReason: null, hasViewedEnding: null, usedHint: 0, minRecommendedHeadcount: null, maxRecommendedHeadcount: null, reviewTagList: null, lockRatio: null, level: 2.5, levelComment: '', horrorLevel: 0, horrorComment: '', activityLevel: 3, activityComment: '', recommendedCloth: null, storyLevel: 4, storyComment: '', interiorLevel: 5, interiorComment: '', createdAt: '2026-11-02' });

const ratioText = m => {
  const title = m.nodes(node => Array.isArray(node.props.children) && m.textOf(node.props.children[0]) === '장치/자물쇠 비율')[0];
  return m.textOf(title.props.children[1]);
};

test('4-25 price rows preserve arithmetic, formatting, order, zero and empty arrays', () => {
  const m = mount(themeUI('PriceTable'), { props: { themePrice: [{ headcount: 2, price: 15000 }, { headcount: 3, price: 0 }] } }); m.render();
  assert.match(m.text(), /2인30,00015,0003인00/);
  assert.deepEqual(m.nodes(node => typeof node.props.$isLast === 'boolean').map(node => node.props.$isLast), [false, false, true, true]);
  m.update({ themePrice: [] }); assert.equal(m.nodes(node => node.type === 'tr').length, 1);
});

test('4-25 summary preserves icon and string values including empty strings', () => {
  const icon = { type: 'test-icon', props: {} };
  const m = mount(themeUI('SummaryInfoCard'), { props: { icon, type: '추천 인원', value: '-' } }); m.render();
  assert.equal(m.nodes(node => node.type === 'test-icon')[0], icon); assert.equal(m.text(), '추천 인원-');
  m.update({ value: '' }); assert.equal(m.text(), '추천 인원');
});

test('4-25 review card preserves labels, zero hints, escape state, member modal and detail navigation', () => {
  const data = review(), m = mount(themeUI('ThemeReview'), { props: { data }, params: { themeId: '7' } }); m.render();
  assert.match(m.text(), /탈출 성공/); assert.match(m.text(), /0개 사용/); assert.match(m.text(), /10분 남김/);
  m.click('작성자'); assert.equal(m.atoms.userInfoIdState, 8); assert.equal(m.atoms.userInfoNameState, '작성자'); assert.equal(m.atoms.userInfoModalState, true);
  assert.deepEqual(m.writes.map(write => write.key), ['userInfoIdState', 'userInfoNameState', 'userInfoModalState']);
  m.click('후기 상세보기'); assert.deepEqual(m.navigation, [['/theme/7/review/21']]);
  for (const isEscaped of [null, undefined, false]) {
    m.update({ data: { ...data, isEscaped, usedHint: null } }); assert.doesNotMatch(m.text(), /분 남김/); assert.doesNotMatch(m.text(), /개 사용/);
  }
});

test('4-25 missing member/review/route IDs block only dependent actions; missing and empty nicknames remain distinct', () => {
  for (const memberId of [undefined, null]) {
    const m = mount(themeUI('ThemeReview'), { props: { data: { ...review(), memberId } }, params: { themeId: '7' } }); m.render();
    m.click('작성자'); assert.equal(m.writes.length, 0); m.click('후기 상세보기'); assert.equal(m.navigation.length, 1); assert.match(m.text(), /후기21/);
  }
  for (const memberNickname of [undefined, '', '정상']) {
    const m = mount(themeUI('ThemeReview'), { props: { data: { ...review(), memberNickname } } }); m.render();
    m.nodes(node => node.props.onClick && String(node.type) === 'styled.div' && m.textOf(node) === (memberNickname || ''))[0].props.onClick();
    assert.equal(m.atoms.userInfoNameState, memberNickname === undefined ? null : memberNickname);
    m.click('후기 상세보기'); assert.equal(m.navigation.length, 0);
  }
  const m = mount(themeUI('ThemeReview'), { props: { data: { ...review(), reviewId: undefined } }, params: { themeId: '7' } }); m.render();
  m.click('작성자'); assert.equal(m.atoms.userInfoModalState, true); m.click('후기 상세보기'); assert.equal(m.navigation.length, 0);
});

test('4-25 review list keeps auth gating, page params, average/count, pagination and refetch counter', async () => {
  const m = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7, reviewRefetchKey: 0 } }); m.render(); await m.settle();
  assert.equal(m.requests[0].url, 'themes/7/reviews'); assert.deepEqual(plain(m.requests[0].config.params), { page: 1, size: 3 });
  m.click('후기 작성하기'); assert.equal(m.children('PopUpModal')[0].props.isOpen, true); assert.notEqual(m.atoms.reviewModalState, true);
  m.setLoggedIn(true); m.click('후기 작성하기'); assert.equal(m.atoms.reviewModalState, true);
  m.requests[0].resolve(list()); await m.settle(); assert.match(m.text(), /4.5\/5/); assert.match(m.text(), /7명/); assert.deepEqual(resultIds(m), [21]);
  m.click('2'); assert.equal(m.requests[1].config.params.page, 2);
  m.requests[1].resolve(list(22)); await m.settle(); assert.deepEqual(resultIds(m), [22]);
  m.update({ reviewRefetchKey: 1 }); assert.equal(m.requests[2].config.params.page, 2);
  m.requests[2].resolve({ satisfactionAvg: 0, reviewCnt: 0, reviewList: [] }); await m.settle(); assert.match(m.text(), /작성된 후기가 없습니다/);
});

test('4-25 review list A → B → A suppresses stale results/errors, clears old display and skips missing theme IDs', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7 } }); m.render();
    m.requests[0].resolve(list(21)); await m.settle(); assert.deepEqual(resultIds(m), [21]);
    m.update({ themeId: 8 }); assert.deepEqual(resultIds(m), []);
    m.update({ themeId: 7 }); assert.deepEqual(resultIds(m), []);
    m.requests[2].resolve(list(23)); await m.settle();
    const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[1].resolve(list(22)); else m.requests[1].reject(Error('old B'));
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.deepEqual(resultIds(m), [23]);
    m.update({ themeId: undefined }); await m.settle(); assert.deepEqual(resultIds(m), []); assert.equal(m.requests.length, 3);
    assert.equal(m.errors.some(args => args[0] === '테마 후기 목록 조회 중 오류 발생:'), false);
  }
});

test('4-25 review list page/refetch races, current failure and unmount never apply obsolete state writes', async () => {
  const m = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7, reviewRefetchKey: 0 } }); m.render();
  m.requests[0].resolve(list()); await m.settle(); m.click('2'); m.update({ reviewRefetchKey: 1 });
  m.requests[2].resolve(list(23)); await m.settle(); m.requests[1].resolve(list(22)); await m.settle(); assert.deepEqual(resultIds(m), [23]);
  m.update({ themeId: 8 }); m.requests[3].reject(Error('current')); await m.settle(); assert.deepEqual(resultIds(m), []); assert.match(m.text(), /작성된 후기가 없습니다/);
  for (const finish of ['resolve', 'reject']) {
    const gone = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7 } }); gone.render(); gone.unmount(); const count = gone.stateWrites.length;
    if (finish === 'resolve') gone.requests[0].resolve(list()); else gone.requests[0].reject(Error('unmounted'));
    await gone.settle(); assert.equal(gone.stateWrites.length, count);
  }
});

test('4-26 overview preserves responsive labels, fallback images, reservation/schedule links and shared-auth likes', async () => {
  for (const isMobile of [false, true]) {
    const data = themeDetail(), m = mount(themeUI('ThemeOverviewCard'), { props: { themeData: data }, isMobile, loggedIn: true }); m.render(); await m.settle();
    assert.match(m.text(), /매장7/); assert.match(m.text(), /테마7/); m.click('예약하러 가기'); assert.equal(m.navigation[0][0], data.storeInfo.storeReservationUrl);
    m.click('일정에 추가하기'); assert.equal(m.atoms.scheduleModalState.isOpen, true); assert.equal(m.children('ScheduleModal').length, 0);
    const heart = () => m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('/heart/'))[0];
    let stopped = 0; heart().props.onClick({ stopPropagation() { stopped++; } }); m.render(); await m.settle();
    heart().props.onClick({ stopPropagation() { stopped++; } }); m.render(); assert.deepEqual(m.mutations, [['post', 7], ['delete', 7]]); assert.equal(stopped, 2);
    m.setLoggedIn(false); await m.settle(); heart().props.onClick({ stopPropagation() { throw Error('should not stop'); } }); m.render(); assert.equal(m.children('PopUpModal')[0].props.isOpen, true); assert.equal(m.mutations.length, 2);
    m.update({ themeData: { ...data, img: '' } }); await m.settle(); assert.match(m.nodes(node => node.type === 'img')[0].props.src, /thumbnailImg.png$/);
    m.nodes(node => node.type === 'img')[0].props.onError(); await m.settle(); assert.match(m.nodes(node => node.type === 'img')[0].props.src, /thumbnailImg.png$/);
  }
});

test('4-26 overview empty display skips only ID-dependent likes and retains clipboard tooltip timing', async () => {
  const m = mount(themeUI('ThemeOverviewCard'), { props: { themeData: {} }, loggedIn: true }); m.render(); await m.settle();
  const heart = m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('/heart/'))[0];
  heart.props.onClick({ stopPropagation() {} }); assert.deepEqual(m.mutations, []);
  const share = m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('shareIcon.svg'))[0];
  share.props.onClick(); await m.settle(); assert.deepEqual(m.copied, ['https://localhost:5173/theme/7']); assert.match(m.text(), /주소 복사 완료/);
  assert.equal(m.timers[0].ms, 1500); m.timers[0].fn(); await m.settle(); assert.doesNotMatch(m.text(), /주소 복사 완료/);
});

test('4-26 overview target changes reset previous local image/like state, even when img/isLiked values repeat', async () => {
  const data = themeDetail(), m = mount(themeUI('ThemeOverviewCard'), { props: { themeData: data }, loggedIn: true }); m.render(); await m.settle();
  m.nodes(node => node.type === 'img')[0].props.onError(); await m.settle(); assert.match(m.nodes(node => node.type === 'img')[0].props.src, /thumbnailImg.png$/);
  m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('/heart/'))[0].props.onClick({ stopPropagation() {} }); m.render();
  m.update({ themeData: { ...data, themeId: 8 } }); await m.settle();
  assert.equal(m.nodes(node => node.type === 'img')[0].props.src, data.img);
  assert.equal(m.nodes(node => String(node.type).includes('heart_active.svg')).length, 0);
  m.update({ themeData: {} }); await m.settle(); assert.match(m.nodes(node => node.type === 'img')[0].props.src, /thumbnailImg.png$/);
});

test('4-26 info keeps empty and optional display policies, price branch, clipboard payloads and refetch prop', async () => {
  const m = mount(themeUI('ThemeInfoSection'), { props: { themeData: {}, themePrice: [], reviewRefetchKey: 2 } }); m.render();
  assert.deepEqual(m.children('SummaryInfoCard').map(node => node.props.value), ['-', '-', '-', '-', '-']);
  assert.match(m.text(), /작성된 스토리가 없습니다/); assert.match(m.text(), /제공되는 가격 정보가 없습니다/);
  const data = { ...themeDetail(), playTime: 0, level: 0, horrorLevel: 0, genreList: ['DRAMA'], storeInfo: { ...themeDetail().storeInfo, storeAddress: '' } };
  const prices = [{ headcount: 2, price: 15000 }]; m.update({ themeData: data, themePrice: prices });
  assert.deepEqual(m.children('SummaryInfoCard').map(node => node.props.value), ['0분', '-', '드라마', '⭐ 0', '👻 0']);
  assert.equal(m.children('PriceTable')[0].props.themePrice, prices); assert.equal(m.children('ThemeReviewSection')[0].props.reviewRefetchKey, 2);
  assert.doesNotMatch(m.text(), /작성된 스토리가 없습니다/); // Empty string remains a normal stored string.
  const copyButtons = m.nodes(node => node.props.onClick && String(node.type).includes('copyIcon.svg'));
  for (const button of copyButtons) button.props.onClick(); await m.settle();
  assert.deepEqual(m.copied, ['', 'https://example.com/store', '02-1234']); assert.equal(m.timers.length, 3);
});

test('4-26 theme page preserves parallel detail/price mapping, initial objects, navigation, review refetch and responsive actions', async () => {
  for (const isMobile of [false, true]) {
    const m = mount('src/pages/ThemeDetailPage.tsx', { params: { themeId: '7' }, routeState: { backButtonText: '목록으로' }, isMobile, loggedIn: true }); m.render();
    assert.deepEqual(plain(m.children('ThemeOverviewCard')[0].props.themeData), {}); assert.deepEqual(m.requests.map(request => request.url), ['themes/7', 'themes/7/price']);
    const data = themeDetail(), prices = [{ headcount: 2, price: 15000 }]; m.requests[0].resolve(data); m.requests[1].resolve(prices); await m.settle();
    assert.equal(m.children('ThemeOverviewCard')[0].props.themeData, data); assert.equal(m.children('ThemeInfoSection')[0].props.themePrice, prices);
    m.setAtom('reviewModalState', true); m.children('ReviewWriteModal')[0].props.onUpdated(); m.render(); assert.equal(m.children('ThemeInfoSection')[0].props.reviewRefetchKey, 1);
    if (!isMobile) { m.click('목록으로'); assert.deepEqual(m.navigation, [[-1]]); }
    else {
      m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('more.svg'))[0].props.onClick(); m.render();
      m.click('일정 추가하기'); assert.equal(m.atoms.scheduleModalState.isOpen, true); assert.equal(m.children('ScheduleModal')[0].props.themeId, '7');
    }
  }
});

test('4-26 theme page hides previous detail/price immediately and protects A → B → A including stale errors', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount('src/pages/ThemeDetailPage.tsx', { params: { themeId: '7' } }); m.render();
    m.requests[0].resolve(themeDetail(7)); m.requests[1].resolve([{ headcount: 2, price: 7 }]); await m.settle();
    m.setParams({ themeId: '8' }); assert.deepEqual(plain(m.children('ThemeOverviewCard')[0].props.themeData), {}); assert.deepEqual(plain(m.children('ThemeInfoSection')[0].props.themePrice), []);
    m.setParams({ themeId: '7' });
    m.requests[4].resolve(themeDetail(70)); m.requests[5].resolve([{ headcount: 2, price: 70 }]); await m.settle();
    const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[2].resolve(themeDetail(8)); else m.requests[2].reject(Error('old B'));
    m.requests[3].resolve([]); await m.settle(); assert.equal(m.stateWrites.length, writes);
    assert.equal(m.children('ThemeOverviewCard')[0].props.themeData.themeId, 70); assert.equal(m.children('ThemeInfoSection')[0].props.themePrice[0].price, 70);
    m.setParams({}); await m.settle(); assert.equal(m.requests.length, 6); assert.deepEqual(plain(m.children('ThemeOverviewCard')[0].props.themeData), {});
  }
});

test('4-26 current detail/price failure keeps initial UI and unmount discards both Promise.all outcomes', async () => {
  for (const failIndex of [0, 1]) {
    const m = mount('src/pages/ThemeDetailPage.tsx', { params: { themeId: '7' } }); m.render();
    m.requests[failIndex].reject(Error('current')); m.requests[1 - failIndex].resolve(failIndex === 0 ? [] : themeDetail()); await m.settle();
    assert.deepEqual(plain(m.children('ThemeOverviewCard')[0].props.themeData), {}); assert.deepEqual(plain(m.children('ThemeInfoSection')[0].props.themePrice), []);
  }
  for (const finish of ['resolve', 'reject']) {
    const m = mount('src/pages/ThemeDetailPage.tsx', { params: { themeId: '7' } }); m.render(); m.unmount(); const count = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve(themeDetail()); else m.requests[0].reject(Error('unmounted'));
    m.requests[1].resolve([]); await m.settle(); assert.equal(m.stateWrites.length, count);
  }
});

test('4-27 participants keep nullable fields, writer order, desktop/mobile info interactions and event cleanup', async () => {
  for (const isMobile of [false, true]) {
    const m = mount(reviewUI('PlayMemberSection'), { isMobile, props: { participantList: reviewDetail().participantList } }); m.render();
    assert.match(m.text(), /P1방고수글쓴이P2-/); assert.doesNotMatch(m.text(), /・/);
    if (isMobile) m.nodes(node => node.props.onClick && String(node.type).includes('infoIcon.svg'))[0].props.onClick();
    else m.nodes(node => node.props.onMouseEnter)[0].props.onMouseEnter();
    m.render(); assert.equal(m.children('InfoBox').length, 1); assert.equal(m.listeners.get('mousedown').size, 1); assert.equal(m.listeners.get('touchstart').size, 1);
    const inside = {}; m.nodes(node => node.props.ref)[0].props.ref.current = { contains: value => value === inside };
    m.dispatch('mousedown', { target: inside }); assert.equal(m.nodes(node => node.props.$isInfoOpen === true).length, 1);
    m.dispatch('touchstart', { target: null }); assert.equal(m.nodes(node => node.props.$isInfoOpen === true).length, 0);
    m.update({ participantList: [] }); await m.settle(); assert.doesNotMatch(m.text(), /글쓴이/);
    m.unmount(); assert.equal(m.listeners.get('mousedown').size, 0); assert.equal(m.listeners.get('touchstart').size, 0);
  }
});

test('4-27 significant tags preserve five enum labels, icon order and empty list behavior', () => {
  const tags = ['AGING', 'DEVICE_ERROR', 'ENTRY_DELAY', 'SAME_DAY_BOOKING', 'EARLY_EXIT'];
  const m = mount(reviewUI('SignificantSection'), { props: { tagList: tags } }); m.render();
  assert.equal(m.nodes(node => String(node.type).includes('tagIcon')).length, 5);
  assert.match(m.text(), /노후화.*장치 오류.*입장 지연.*당일 예약.*중도 포기/);
  m.update({ tagList: [] }); assert.equal(m.text(), '특이사항');
});

test('4-27 stars retain half/full/empty ratings, empty versus undefined comments and nullable clothing choices', () => {
  for (const rating of [undefined, 0, NaN, 2.5, 5]) {
    const m = mount(reviewUI('StarRatingSection'), { props: { type: '활동성', rating, comment: '', recommendedCloth: null } }); m.render();
    const icons = m.nodes(node => String(node.type).includes('/reviewWrite/star'));
    assert.equal(icons.length, 5); assert.equal(icons.filter(node => String(node.type).includes('/star.svg')).length, rating === 2.5 ? 2 : rating === 5 ? 5 : 0);
    assert.equal(icons.filter(node => String(node.type).includes('starhalf')).length, rating === 2.5 ? 1 : 0);
    assert.match(m.text(), /작성된 내용이 없습니다/); assert.equal(m.nodes(node => node.props.selected === true).length, 0);
    m.update({ recommendedCloth: 'PANTS', comment: undefined }); assert.equal(m.nodes(node => node.props.selected === true).length, 2); assert.doesNotMatch(m.text(), /작성된 내용이 없습니다/);
  }
});

test('4-27 review detail preserves DTO mapping, null escape/time, zero hints and valid numeric ratios', async () => {
  const m = mount(reviewUI('ReviewInfoSection'), { props: { themeId: '7', reviewId: 21 } }); m.render();
  assert.equal(m.requests[0].url, 'themes/7/reviews/21'); assert.equal(m.children('RangeItem').length, 0);
  const data = reviewDetail(); m.requests[0].resolve(data); await m.settle();
  assert.match(m.text(), /4.5\/5/); assert.match(m.text(), /0개 사용/); assert.match(m.text(), /상세후기21/); assert.doesNotMatch(m.text(), /분 남김/);
  assert.equal(m.children('PlayMemberSection')[0].props.participantList, data.participantList); assert.equal(m.children('SignificantSection').length, 0);
  assert.equal(m.children('RangeItem').length, 0);
  assert.deepEqual(m.children('StarRatingSection').map(node => node.props.rating), [2.5, 0, 3, 4, 5]);
  m.update({ reviewId: '22' }); const success = { ...data, reviewId: 22, isEscaped: true, reviewTagList: [], lockRatio: 6 };
  m.requests[1].resolve(success); await m.settle(); assert.match(m.text(), /탈출 성공/); assert.match(m.text(), /10분 남김/);
  assert.equal(m.children('SignificantSection').length, 1); assert.equal(m.children('RangeItem')[0].props.value, 60); assert.equal(m.children('RangeItem')[0].props.disabled, false);
});

test('4-27 review detail checks theme AND review IDs plus generations across A → B → A and current/stale errors', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(reviewUI('ReviewInfoSection'), { props: { themeId: 7, reviewId: 21 } }); m.render();
    m.requests[0].resolve(reviewDetail(21)); await m.settle();
    m.update({ themeId: 8, reviewId: 22 }); assert.doesNotMatch(m.text(), /상세후기21/);
    m.update({ themeId: 7, reviewId: 21 }); assert.doesNotMatch(m.text(), /상세후기21/);
    m.requests[2].resolve(reviewDetail(23)); await m.settle(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[1].resolve(reviewDetail(22)); else m.requests[1].reject(Error('old B'));
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.match(m.text(), /상세후기23/);
    m.update({ reviewId: 24 }); m.requests[3].reject(Error('current')); await m.settle(); assert.doesNotMatch(m.text(), /상세후기/);
    m.update({ reviewId: undefined }); m.update({ themeId: undefined, reviewId: 21 }); await m.settle(); assert.equal(m.requests.length, 4);
  }
});

test('4-27 review detail unmount prevents late success/error state writes', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(reviewUI('ReviewInfoSection'), { props: { themeId: '7', reviewId: '21' } }); m.render(); m.unmount(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve(reviewDetail()); else m.requests[0].reject(Error('unmounted'));
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.errors.some(args => args[0] === '테마 상세 api 호출 중 오류 발생: '), false);
  }
});

test('4-27 review page keeps independent theme fetch, modal props, backdrop without stray prop and responsive navigation', async () => {
  for (const isMobile of [false, true]) {
    const m = mount('src/pages/ReviewDetailPage.tsx', { isMobile, loggedIn: true, params: { themeId: '7', reviewId: '21' } }); m.render();
    assert.deepEqual(m.requests.map(request => request.url), ['themes/7']); assert.equal(m.children('ReviewInfoSection')[0].props.reviewId, '21');
    m.requests[0].resolve(themeDetail()); await m.settle(); assert.equal(m.children('ThemeOverviewCard')[0].props.themeData.themeId, 7);
    m.setAtom('reviewModalState', true); assert.equal(m.children('ReviewWriteModal')[0].props.themeData.themeId, 7);
    m.setAtom('scheduleModalState', { isOpen: true, mode: 'add', reservation: null }); assert.equal(m.children('ScheduleModal')[0].props.themeId, '7');
    assert.equal(m.nodes(node => Object.hasOwn(node.props, 'ModalBackdrop')).length, 0);
    m.setParams({ themeId: '7' }); await m.settle(); assert.equal(m.requests.length, 1); assert.equal(m.children('ThemeOverviewCard')[0].props.themeData.themeId, 7); assert.equal(m.children('ReviewInfoSection')[0].props.reviewId, undefined);
    if (!isMobile) { m.click('테마 상세로 돌아가기'); assert.deepEqual(m.navigation, [[-1]]); }
    else {
      m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('more.svg'))[0].props.onClick(); m.render();
      m.click('후기 작성하기'); assert.equal(m.atoms.reviewModalState, true);
    }
  }
});

test('4-27 review page theme A → B → A hides old data, ignores stale outcomes and preserves missing-ID/failure UI', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount('src/pages/ReviewDetailPage.tsx', { params: { themeId: '7', reviewId: '21' } }); m.render();
    m.requests[0].resolve(themeDetail()); await m.settle(); m.setParams({ themeId: '8', reviewId: '22' });
    assert.deepEqual(plain(m.children('ThemeOverviewCard')[0].props.themeData), {});
    m.setParams({ themeId: '7', reviewId: '21' }); m.requests[2].resolve(themeDetail(70)); await m.settle(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[1].resolve(themeDetail(8)); else m.requests[1].reject(Error('old B'));
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.children('ThemeOverviewCard')[0].props.themeData.themeId, 70);
    m.setParams({ themeId: '9', reviewId: '21' }); m.requests[3].reject(Error('current')); await m.settle(); assert.deepEqual(plain(m.children('ThemeOverviewCard')[0].props.themeData), {});
    m.setParams({ reviewId: '21' }); await m.settle(); assert.equal(m.requests.length, 4);
  }
});

test('4-27 unmounted review page cannot apply old theme success/error or finally effects', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount('src/pages/ReviewDetailPage.tsx', { params: { themeId: '7', reviewId: '21' } }); m.render(); m.unmount(); const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve(themeDetail()); else m.requests[0].reject(Error('unmounted'));
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.errors.some(args => args[0] === '테마 상세 api 호출 중 오류 발생: '), false);
  }
});

const heartButton = m => m.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('/heart/'))[0];
const heartActive = m => m.nodes(node => String(node.type).includes('heart_active.svg')).length === 1;
const toggleHeart = m => { heartButton(m).props.onClick({ stopPropagation() {} }); m.render(); };
const axiosFailure = status => Object.assign(Error(`HTTP ${status}`), { isAxiosError: true, response: { status } });
const likeCard = (isLiked = false, isMobile = false) => {
  const m = mount(themeUI('ThemeOverviewCard'), { props: { themeData: { ...themeDetail(), isLiked } }, loggedIn: true, isMobile, deferLikes: true });
  m.render(); return m;
};

test('review page reset: A page 3 → B page 1 makes no intermediate B page 3 request and preserves same-theme paging/refetch', async () => {
  const m = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7, reviewRefetchKey: 0 } }); m.render();
  m.requests[0].resolve(list(21, 9)); await m.settle(); m.click('3');
  assert.equal(m.requests[1].config.params.page, 3); m.requests[1].resolve(list(23, 9)); await m.settle();
  m.update({ themeId: 8 }); await m.settle();
  assert.deepEqual(m.requests.map(request => [request.url, request.config.params.page, request.config.params.size]), [
    ['themes/7/reviews', 1, 3], ['themes/7/reviews', 3, 3], ['themes/8/reviews', 1, 3],
  ]);
  m.requests[2].resolve(list(81, 9)); await m.settle(); assert.deepEqual(m.nodes(node => node.props.pageState === true).map(m.textOf), ['1']);
  m.click('2'); m.requests[3].resolve(list(82, 9)); await m.settle();
  m.update({ themeId: 8 }); await m.settle(); assert.equal(m.requests.length, 4);
  m.update({ reviewRefetchKey: 1 }); assert.equal(m.requests[4].config.params.page, 2);
  m.requests[4].resolve(list(83, 9)); await m.settle(); assert.deepEqual(m.nodes(node => node.props.pageState === true).map(m.textOf), ['2']);
});

test('review page reset: A page 3 → B → A stays on latest A page 1 despite old A/B successes or failures', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7 } }); m.render();
    m.requests[0].resolve(list(21, 9)); await m.settle(); m.click('3');
    m.update({ themeId: 8 }); m.update({ themeId: 7 }); await m.settle();
    assert.deepEqual(m.requests.map(request => request.config.params.page), [1, 3, 1, 1]);
    m.requests[3].resolve(list(31, 9)); await m.settle(); const writes = m.stateWrites.length;
    if (finish === 'resolve') { m.requests[1].resolve(list(23, 9)); m.requests[2].resolve(list(81, 9)); }
    else { m.requests[1].reject(Error('old A3')); m.requests[2].reject(Error('old B1')); }
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.deepEqual(resultIds(m), [31]);
    assert.deepEqual(m.nodes(node => node.props.pageState === true).map(m.textOf), ['1']); assert.equal(m.requests.length, 4);
  }
});

test('review page reset: missing theme IDs skip requests and returning to the same prior ID starts page 1', async () => {
  const m = mount(themeUI('ThemeReviewSection'), { props: { themeId: 7 } }); m.render();
  m.requests[0].resolve(list(21, 9)); await m.settle(); m.click('3');
  m.update({ themeId: undefined }); await m.settle(); assert.equal(m.requests.length, 2);
  m.update({ themeId: 7 }); assert.equal(m.requests[2].config.params.page, 1);
  m.requests[2].resolve(list(31, 9)); await m.settle(); m.requests[1].resolve(list(23, 9)); await m.settle(); assert.deepEqual(resultIds(m), [31]);
});

test('optimistic likes: add/remove success retains immediate UI and original POST/DELETE URL and payload', async () => {
  for (const isLiked of [false, true]) for (const isMobile of [false, true]) {
    const m = likeCard(isLiked, isMobile); toggleHeart(m);
    assert.equal(heartActive(m), !isLiked); assert.equal(m.requests.length, 1);
    assert.equal(m.requests[0].method, isLiked ? 'DELETE' : 'POST'); assert.equal(m.requests[0].url, 'themes/7/like');
    assert.equal(m.requests[0].body, undefined); assert.equal(m.requests[0].config, undefined);
    m.requests[0].resolve('success'); await m.settle(); assert.equal(heartActive(m), !isLiked); assert.equal(m.requests.length, 1);
    assert.equal(m.children('PopUpModal')[0].props.isOpen, false);
  }
});

test('optimistic likes: add/remove network failures restore confirmed UI and allow unchanged retries', async () => {
  for (const isLiked of [false, true]) for (const isMobile of [false, true]) {
    const m = likeCard(isLiked, isMobile); toggleHeart(m); m.requests[0].reject(Error('network offline')); await m.settle();
    assert.equal(heartActive(m), isLiked); assert.equal(m.requests.length, 1); assert.equal(m.children('PopUpModal')[0].props.isOpen, false);
    assert.equal(m.errors.some(args => args[0] === '찜 상태 변경 실패:'), true);
    toggleHeart(m); assert.equal(m.requests[1].method, m.requests[0].method); assert.equal(m.requests[1].url, m.requests[0].url);
    m.requests[1].resolve('retried'); await m.settle(); assert.equal(heartActive(m), !isLiked);
  }
});

test('optimistic likes: rapid clicks before render keep the last intent and serialize POST then DELETE', async () => {
  const m = likeCard(), click = heartButton(m).props.onClick;
  click({ stopPropagation() {} }); click({ stopPropagation() {} }); m.render();
  assert.equal(heartActive(m), false); assert.equal(m.requests.length, 1); assert.equal(m.requests[0].method, 'POST');
  m.requests[0].resolve('added'); await m.settle(); assert.equal(m.requests.length, 2); assert.equal(m.requests[1].method, 'DELETE');
  m.requests[1].resolve('removed'); await m.settle(); assert.equal(heartActive(m), false); assert.equal(m.requests.length, 2);
});

test('optimistic likes: queued removal failure restores the successful addition, not the initial false state', async () => {
  const m = likeCard(); toggleHeart(m); toggleHeart(m);
  m.requests[0].resolve('added'); await m.settle(); assert.equal(m.requests[1].method, 'DELETE');
  m.requests[1].reject(Error('remove failed')); await m.settle(); assert.equal(heartActive(m), true);
  toggleHeart(m); assert.equal(m.requests[2].method, 'DELETE'); m.requests[2].resolve('removed'); await m.settle(); assert.equal(heartActive(m), false);
});

test('optimistic likes: obsolete failures never roll back newer rapid-click intent or show stale auth prompts', async () => {
  for (const isLiked of [false, true]) for (const finish of ['resolve', 'reject']) {
    const m = likeCard(isLiked), click = heartButton(m).props.onClick;
    click({ stopPropagation() {} }); click({ stopPropagation() {} }); click({ stopPropagation() {} }); m.render();
    assert.equal(heartActive(m), !isLiked); assert.equal(m.requests.length, 1);
    if (finish === 'resolve') m.requests[0].resolve('saved'); else m.requests[0].reject(axiosFailure(401));
    await m.settle(); assert.equal(heartActive(m), !isLiked); assert.equal(m.children('PopUpModal')[0].props.isOpen, false);
    if (finish === 'reject') {
      assert.equal(m.requests.length, 2); assert.equal(m.requests[1].method, m.requests[0].method);
      m.requests[1].resolve('latest saved'); await m.settle();
    } else assert.equal(m.requests.length, 1); // Transient middle choices need no extra mutation.
    assert.equal(heartActive(m), !isLiked);
  }
});

test('optimistic likes: an old queued failure cannot replace the confirmed/latest selection', async () => {
  const m = likeCard(); toggleHeart(m); toggleHeart(m);
  m.requests[0].resolve('added'); await m.settle(); assert.equal(m.requests[1].method, 'DELETE');
  toggleHeart(m); assert.equal(heartActive(m), true);
  m.requests[1].reject(Error('old removal failed')); await m.settle();
  assert.equal(heartActive(m), true); assert.equal(m.requests.length, 2); // Server already confirmed true.
});

test('optimistic likes: A → B → A reverse responses and old finally cannot change the new session or unlock it', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = likeCard(); toggleHeart(m);
    m.update({ themeData: themeDetail(8) }); toggleHeart(m);
    m.update({ themeData: themeDetail(7) }); toggleHeart(m);
    assert.equal(m.requests.length, 3); m.requests[2].resolve('current A added'); await m.settle(); assert.equal(heartActive(m), true);
    toggleHeart(m); assert.equal(m.requests[3].method, 'DELETE');
    if (finish === 'resolve') { m.requests[0].resolve('old A added'); m.requests[1].resolve('old B added'); }
    else { m.requests[0].reject(axiosFailure(401)); m.requests[1].reject(axiosFailure(403)); }
    const writes = m.stateWrites.length; await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(heartActive(m), false);
    toggleHeart(m); assert.equal(m.requests.length, 4); // New removal still owns its synchronous lock.
    m.requests[3].resolve('current A removed'); await m.settle(); assert.equal(m.requests[4].method, 'POST');
    m.requests[4].resolve('latest A added'); await m.settle(); assert.equal(heartActive(m), true); assert.equal(m.children('PopUpModal')[0].props.isOpen, false);
  }
});

test('optimistic likes: auth failures roll back and reuse the existing login prompt/navigation', async () => {
  for (const status of [401, 403]) for (const isLiked of [false, true]) {
    const m = likeCard(isLiked); toggleHeart(m); m.requests[0].reject(axiosFailure(status)); await m.settle();
    assert.equal(heartActive(m), isLiked); const popup = m.children('PopUpModal')[0].props;
    assert.equal(popup.isOpen, true); assert.equal(popup.message, '로그인 후 사용할 수 있는 기능입니다.');
    popup.onConfirm(); assert.deepEqual(m.navigation, [['/login']]);
    popup.onCancel(); m.render(); assert.equal(m.children('PopUpModal')[0].props.isOpen, false);
    toggleHeart(m); assert.equal(m.requests.length, 2); m.requests[1].resolve('retry saved'); await m.settle(); assert.equal(heartActive(m), !isLiked);
  }
});

test('optimistic likes: logout and unmount discard pending success/failure without stale UI writes or queued requests', async () => {
  for (const change of ['logout', 'unmount']) for (const finish of ['resolve', 'reject']) {
    const m = likeCard(); toggleHeart(m); toggleHeart(m);
    if (change === 'logout') { m.setLoggedIn(false); await m.settle(); assert.equal(heartActive(m), false); }
    else m.unmount();
    const writes = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve('old saved'); else m.requests[0].reject(axiosFailure(401));
    await m.settle(); assert.equal(m.stateWrites.length, writes); assert.equal(m.requests.length, 1);
    if (change === 'logout') { toggleHeart(m); assert.equal(m.children('PopUpModal')[0].props.isOpen, true); assert.equal(m.requests.length, 1); }
  }
});


test('review tags: ENTRY_DELAY matches the editing option; other labels, order, icons and unknown fallback stay unchanged', () => {
  const tags = ['AGING', 'DEVICE_ERROR', 'ENTRY_DELAY', 'SAME_DAY_BOOKING', 'EARLY_EXIT', 'UNREGISTERED'];
  const m = mount(reviewUI('SignificantSection'), { props: { tagList: tags } }); m.render();
  assert.equal(m.text(), '특이사항노후화장치 오류입장 지연당일 예약중도 포기알 수 없음');
  assert.deepEqual(m.nodes(node => String(node.type).includes('tagIcon')).map(node => String(node.type).match(/tagIcon(\d)/)[1]), ['1', '2', '3', '4', '5', '5']);
});

for (const pageName of ['ThemeDetailPage', 'ReviewDetailPage']) {
  for (const isMobile of [false, true]) {
    test(`single schedule modal: ${pageName} ${isMobile ? 'mobile' : 'desktop'} retains card/page entry, add/edit payloads and close/reopen`, async () => {
      const sharedAtoms = { scheduleModalState: { isOpen: false, mode: 'add', reservation: null }, calendarMonthState: new Date(2026, 10, 1) };
      const parent = mount(`src/pages/${pageName}.tsx`, { sharedAtoms, params: { themeId: '007', reviewId: '21' }, isMobile, loggedIn: true }); parent.render();
      for (const request of parent.requests) request.resolve(request.url.endsWith('/price') ? [] : themeDetail());
      await parent.settle();
      const card = mount(themeUI('ThemeOverviewCard'), { props: parent.children('ThemeOverviewCard')[0].props, sharedAtoms, isMobile, loggedIn: true }); card.render(); await card.settle();
      const assertModalCount = expected => {
        parent.render(); card.render();
        assert.equal(parent.children('ScheduleModal').length + card.children('ScheduleModal').length, expected);
        // Preserve the existing backdrop in both page layouts.
        assert.equal(parent.nodes(node => String(node.props.children?.type).endsWith('/ScheduleModal')).length, expected);
      };
      assertModalCount(0);
      card.click('일정에 추가하기'); assertModalCount(1);
      assert.deepEqual(plain(sharedAtoms.scheduleModalState), { isOpen: true, mode: 'add', reservation: null });
      let modal = mount('src/features/schedule/ui/ScheduleModal.tsx', { props: parent.children('ScheduleModal')[0].props, sharedAtoms, isMobile }); modal.render();
      assert.equal(modal.children('ScheduleItemSection')[0].props.themeId, '007');
      const close = () => {
        modal.nodes(node => node.props.onClick && String(node.type).includes('/closeicon.svg'))[0].props.onClick();
        modal.unmount(); assertModalCount(0);
      };
      close();
      if (isMobile) {
        parent.nodes(node => node.props.onClick && JSON.stringify(node.props.children).includes('more.svg'))[0].props.onClick(); parent.render();
        parent.click('일정 추가하기');
      } else card.click('일정에 추가하기');
      assertModalCount(1);
      for (const mode of ['add', 'edit']) {
        const reservation = { themeReservationId: 81, themeId: 9, reservedAt: '2026.11.01 14:30', themeName: '기존 예약' };
        if (mode === 'edit') parent.setAtom('scheduleModalState', { isOpen: true, mode, reservation });
        assertModalCount(1);
        modal = mount('src/features/schedule/ui/ScheduleModal.tsx', { props: parent.children('ScheduleModal')[0].props, sharedAtoms, isMobile }); modal.render();
        assert.equal(modal.children('ScheduleItemSection')[0].props.themeId, '007');
        if (mode === 'edit') assert.equal(modal.atoms.scheduleModalState.reservation, reservation);
        const reservedAt = '2026-11-02T14:35:00';
        modal.children('ScheduleItemSection')[0].props.onStateChange({ selectedThemeId: 7, visitDate: new Date(2026, 10, 2), selectedTime: null, reservedAt, isSubmitEnabled: true }); modal.render();
        const pending = modal.click(mode === 'edit' ? '수정 완료하기' : '방탈출 예약 일정 추가하기');
        assert.equal(modal.requests.length, 1);
        assert.equal(modal.requests[0].method, mode === 'edit' ? 'PATCH' : 'POST');
        assert.equal(modal.requests[0].url, mode === 'edit' ? 'themes/9/reservations/81' : 'themes/7/reservations');
        assert.deepEqual(plain(modal.requests[0].body), mode === 'edit' ? { themeId: 7, reservedAt } : { reservedAt });
        modal.requests[0].resolve('saved'); await modal.settle();
        assert.equal(modal.requests[1].url, 'members/reservations'); modal.requests[1].resolve({ themeReservationList: {} }); await pending; await modal.settle();
        assert.deepEqual(modal.alerts, [mode === 'edit' ? '예약이 수정되었습니다.' : '예약이 추가되었습니다.']);
        assert.equal(sharedAtoms.scheduleModalState.isOpen, false); assertModalCount(0); modal.unmount();
      }
    });
  }
}

test('review ratio: valid zero, endpoints and intermediate numbers retain text and slider calculation on desktop/mobile', async () => {
  for (const isMobile of [false, true]) {
    for (const value of [0, 1, 6, 6.5, 10]) {
      const m = mount(reviewUI('ReviewInfoSection'), { props: { themeId: 7, reviewId: 21 }, isMobile }); m.render();
      m.requests[0].resolve({ ...reviewDetail(), lockRatio: value }); await m.settle();
      assert.equal(ratioText(m), `${value}:${10 - value}`);
      assert.equal(m.children('RangeItem')[0].props.value, value * 10);
      assert.equal(m.children('RangeItem')[0].props.disabled, false);
    }
  }
});

test('review ratio: missing/null/non-finite/out-of-range/malformed data display unknown without a zero or NaN slider', async () => {
  for (const isMobile of [false, true]) {
    for (const value of [null, undefined, NaN, Infinity, -Infinity, -1, 11, '', '6', 'invalid']) {
      const m = mount(reviewUI('ReviewInfoSection'), { props: { themeId: 7, reviewId: 21 }, isMobile }); m.render();
      assert.equal(ratioText(m), '-'); assert.equal(m.children('RangeItem').length, 0);
      const data = { ...reviewDetail(), lockRatio: value };
      if (value === undefined) delete data.lockRatio;
      m.requests[0].resolve(data); await m.settle();
      assert.equal(ratioText(m), '-'); assert.equal(m.children('RangeItem').length, 0);
      assert.doesNotMatch(m.text(), /NaN|Infinity/);
      assert.match(m.text(), /상세후기21/); // Other valid response data still renders.
      assert.equal(data.lockRatio, value); // Display validation does not normalize the DTO.
    }
  }
});

test('review ratio: target reset/failure shows unknown and A → B → A/unmount cannot restore an obsolete ratio', async () => {
  for (const isMobile of [false, true]) {
    const m = mount(reviewUI('ReviewInfoSection'), { props: { themeId: 7, reviewId: 21 }, isMobile }); m.render();
    m.requests[0].resolve({ ...reviewDetail(), lockRatio: 6 }); await m.settle(); assert.equal(ratioText(m), '6:4');
    m.update({ themeId: 8, reviewId: 22 }); assert.equal(ratioText(m), '-'); assert.equal(m.children('RangeItem').length, 0);
    m.update({ themeId: 7, reviewId: 21 }); assert.equal(ratioText(m), '-');
    m.requests[2].resolve({ ...reviewDetail(), lockRatio: 0 }); await m.settle(); assert.equal(ratioText(m), '0:10');
    m.requests[1].resolve({ ...reviewDetail(22), lockRatio: 10 }); await m.settle(); assert.equal(ratioText(m), '0:10');
    m.update({ reviewId: 23 }); m.requests[3].reject(Error('current')); await m.settle();
    assert.equal(ratioText(m), '-'); assert.equal(m.children('RangeItem').length, 0);
    m.update({ reviewId: 24 }); m.unmount(); const writes = m.stateWrites.length;
    m.requests[4].resolve({ ...reviewDetail(24), lockRatio: 6 }); await m.settle(); assert.equal(m.stateWrites.length, writes);
  }
});


const exploreTheme = themeId => ({ themeId, themeName: `테마${themeId}`, locationName: '서울', storeName: '매장', img: '', awardsYear: null, satisfactionLevel: null, level: 2, playTime: 60, isLiked: true, genreList: [], price: 10000, maxHeadcount: 6 });
const exploreCards = m => m.children('ContentCard');
const exploreIds = m => exploreCards(m).map(node => node.props.data.themeId);
const exploreCases = [
  { name: 'search', file: 'src/features/search/ui/SearchSection.tsx', url: 'themes', change: (m, value) => { m.children('SearchInput')[0].props.setKeyword(value ? 'query-b' : 'query-a'); m.render(); } },
  { name: 'genre', file: 'src/features/genre/ui/GenreContentSection.tsx', url: 'themes/genre', change: (m, value) => { m.children('SortFilter')[0].props.onSelect(value ? 'LOW_PRICE' : 'HIGH_SATISFACTION_LEVEL'); m.render(); } },
  { name: 'level', file: 'src/features/level/ui/LevelContentSection.tsx', url: 'themes/proficiency', change: (m, value) => { m.children('SortFilter')[0].props.onSelect(value ? 'LOW_PRICE' : 'HIGH_SATISFACTION_LEVEL'); m.render(); } },
  { name: 'favorites', file: 'src/features/mypage/ui/favorites/ContentCardSection.tsx', url: 'members/liked-themes', change: (m, value) => m.setAtom('headCountState', value ? 3 : 2) },
];
const exploreRequests = (m, item) => m.requests.filter(request => request.url === item.url);

for (const item of exploreCases) test(`async lists: ${item.name} A-B-A keeps the newest response`, async () => {
  const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render();
  item.change(m, true); item.change(m, false); const requests = exploreRequests(m, item); assert.equal(requests.length, 3);
  requests[2].resolve({ contents: [exploreTheme(3)] }); await m.settle();
  requests[1].resolve({ contents: [exploreTheme(2)] }); requests[0].resolve({ contents: [exploreTheme(1)] }); await m.settle();
  assert.deepEqual(exploreIds(m), [3]);
});

const listErrors = m => m.errors.filter(([message]) => [
  '검색 실패:', '장르 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:',
  '숙련도 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', '좋아요한 방탈출 목록 데이터를 불러오는 중 오류 발생:',
].includes(message));

for (const item of exploreCases) {
  test(`async lists: ${item.name} ignores stale success/error while the newest request is still pending`, async () => {
    for (const finish of ['resolve', 'reject']) {
      const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render();
      item.change(m, true); await m.settle(); const requests = exploreRequests(m, item), states = m.stateWrites.length;
      if (finish === 'resolve') requests[0].resolve({ contents: [exploreTheme(1)] }); else requests[0].reject(Error('old failure'));
      await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(listErrors(m).length, 0);
      requests[1].resolve({ contents: [exploreTheme(2)] }); await m.settle(); assert.deepEqual(exploreIds(m), [2]);
    }
  });

  test(`async lists: ${item.name} preserves current failure handling and can retry without polling`, async () => {
    const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render();
    exploreRequests(m, item)[0].resolve({ contents: [exploreTheme(1)] }); await m.settle();
    item.change(m, true); exploreRequests(m, item)[1].reject(Error('current failure')); await m.settle();
    assert.deepEqual(exploreIds(m), item.name === 'search' ? [] : [1]); assert.equal(listErrors(m).length, 1);
    item.change(m, false); exploreRequests(m, item)[2].resolve({ contents: [exploreTheme(3)] }); await m.settle(); assert.deepEqual(exploreIds(m), [3]);
    item.change(m, true); exploreRequests(m, item)[3].resolve({ contents: [] }); await m.settle(); assert.deepEqual(exploreIds(m), []);
    m.render(); m.render(); assert.equal(exploreRequests(m, item).length, 4); assert.equal(m.requests.every(request => request.method === 'GET'), true);
  });

  test(`async lists: ${item.name} unmount/reentry and StrictMode discard old outcomes without changing newer state`, async () => {
    for (const lifecycle of ['remount', 'strictReplay']) for (const finish of ['resolve', 'reject']) {
      const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render();
      if (lifecycle === 'remount') { m.unmount(); m.remount(); } else m.strictReplay();
      await m.settle(); const requests = exploreRequests(m, item); assert.equal(requests.length, 2);
      requests[1].resolve({ contents: [exploreTheme(2)] }); await m.settle(); const states = m.stateWrites.length;
      if (finish === 'resolve') requests[0].resolve({ contents: [exploreTheme(1)] }); else requests[0].reject(Error('old failure'));
      await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(listErrors(m).length, 0); assert.deepEqual(exploreIds(m), [2]);
      m.unmount(); assert.equal(m.writes.length, 0);
    }
  });

  test(`async lists: ${item.name} unmount suppresses every late list success/error`, async () => {
    for (const finish of ['resolve', 'reject']) {
      const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render(); m.unmount(); const states = m.stateWrites.length;
      if (finish === 'resolve') exploreRequests(m, item)[0].resolve({ contents: [exploreTheme(1)] }); else exploreRequests(m, item)[0].reject(Error('old failure'));
      await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(listErrors(m).length, 0);
    }
  });
}

for (const item of exploreCases.filter(item => item.name !== 'favorites')) test(`async lists: ${item.name} client pagination adds no request and obsolete results cannot reset the page`, async () => {
  const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render();
  exploreRequests(m, item)[0].resolve({ contents: Array.from({ length: 35 }, (_, i) => exploreTheme(i + 1)) }); await m.settle();
  m.children('CustomPagination')[0].props.onPageChange(2); m.render(); await m.settle(); assert.equal(exploreRequests(m, item).length, 1); assert.equal(exploreIds(m)[0], 17);
  item.change(m, true); item.change(m, false); const requests = exploreRequests(m, item);
  requests[2].resolve({ contents: Array.from({ length: 35 }, (_, i) => exploreTheme(i + 101)) }); await m.settle();
  assert.equal(m.children('CustomPagination')[0].props.currentPage, 1);
  m.children('CustomPagination')[0].props.onPageChange(2); m.render(); await m.settle();
  requests[1].resolve({ contents: [exploreTheme(2)] }); await m.settle();
  assert.equal(m.children('CustomPagination')[0].props.currentPage, 2); assert.equal(exploreIds(m)[0], 117); assert.equal(requests.length, 3);
});

test('async lists: search explicit retries with the same keyword have independent generations and preserve raw query arguments', async () => {
  const item = exploreCases[0], m = mount(item.file, { routeState: { keyword: ' raw query ' } }); m.render();
  const oldSearch = m.children('SearchInput')[0].props.onSearch;
  const second = oldSearch(); assert.equal(m.requests.length, 2);
  m.requests[1].resolve({ contents: [exploreTheme(2)] }); await second; await m.settle();
  m.requests[0].reject(Error('old failure')); await m.settle(); assert.deepEqual(exploreIds(m), [2]); assert.equal(listErrors(m).length, 0);
  assert.deepEqual(plain(m.requests[1].config.params), { keyword: ' raw query ', page: 1, size: 10000 });
  const failed = oldSearch(); m.requests[2].reject(Error('current failure')); await failed; await m.settle(); assert.deepEqual(exploreIds(m), []);
  const retry = oldSearch(); m.requests[3].resolve({ contents: [exploreTheme(4)] }); await retry; await m.settle(); assert.deepEqual(exploreIds(m), [4]);
  item.change(m, true); await oldSearch(); assert.equal(m.requests.length, 5); // A retained handler cannot query an obsolete keyword.
  m.unmount(); const afterUnmount = m.requests.length; await m.children('SearchInput')[0].props.onSearch(); assert.equal(m.requests.length, afterUnmount);
});

test('search analytics counts one explicit submission and ignores typing requests or stale responses', async () => {
  const m = mount(exploreCases[0].file);
  m.render();
  m.children('SearchInput')[0].props.setKeyword('mystery');
  m.render();
  const submitted = m.children('SearchInput')[0].props.onSearch('mystery');
  m.requests[2].resolve({ contents: [] });
  await submitted;
  m.requests[1].resolve({ contents: [exploreTheme(2)] });
  m.requests[0].resolve({ contents: [] });
  await m.settle();
  assert.deepEqual(m.dataLayer.map(({ event, search_term }) => [event, search_term]), [
    ['search_submit', 'mystery'], ['search_no_result', 'mystery'],
  ]);
});

for (const item of exploreCases.filter(item => ['genre', 'level'].includes(item.name))) {
  for (const dimension of ['selection', 'people']) test(`async lists: ${item.name} ${dimension} A-B-A uses unchanged API parameters`, async () => {
    const m = mount(item.file); m.render();
    const change = value => {
      if (dimension === 'people') { m.children('PeopleFilter')[0].props.onSelect(value ? 4 : 2); m.render(); }
      else m.setAtom(item.name === 'genre' ? 'activeGenreState' : 'activeLevelState', item.name === 'genre' ? (value ? 'DRAMA' : 'SENTIMENTAL') : (value ? 'MASTER' : 'BEGINNER'));
    };
    change(true); change(false); const requests = exploreRequests(m, item); assert.equal(requests.length, 3);
    requests[2].resolve({ contents: [exploreTheme(3)] }); await m.settle(); requests[0].resolve({ contents: [exploreTheme(1)] }); requests[1].resolve({ contents: [exploreTheme(2)] }); await m.settle();
    assert.deepEqual(exploreIds(m), [3]); assert.deepEqual(plain(requests[2].config.params), { [item.name === 'genre' ? 'genre' : 'proficiency']: item.name === 'genre' ? 'SENTIMENTAL' : 'BEGINNER', headcount: 2, page: 1, size: 1000, sortOption: 'HIGH_SATISFACTION_LEVEL' });
  });

  test(`async lists: ${item.name} region/zone filters and reset use the newest applied IDs`, async () => {
    const m = mount(item.file); m.render();
    m.requests.find(request => request.url === 'location/regions').resolve([{ regionId: 1, regionName: '서울' }]); await m.settle();
    m.requests.find(request => request.url === 'location/regions/1/zones').resolve([{ zoneId: 11, zoneName: '강남' }, { zoneId: 12, zoneName: '홍대' }]); await m.settle();
    const region = () => m.children('RegionFilter')[0].props;
    await region().onZoneSelect('강남'); m.render(); await m.settle();
    await region().onZoneSelect('홍대'); m.render(); await m.settle();
    await region().onZoneSelect('강남'); m.render(); await m.settle();
    const requests = exploreRequests(m, item); assert.equal(requests.length, 4); assert.equal(requests[3].config.params.regionId, 1); assert.equal(requests[3].config.params.zoneIdList, '12');
    requests[3].resolve({ contents: [exploreTheme(4)] }); await m.settle(); requests[2].resolve({ contents: [exploreTheme(3)] }); requests[1].reject(Error('old failure')); await m.settle(); assert.deepEqual(exploreIds(m), [4]);
    region().onRegionAllClick(); m.render(); await m.settle(); const reset = exploreRequests(m, item)[4];
    assert.equal(Object.hasOwn(reset.config.params, 'regionId'), false); assert.equal(Object.hasOwn(reset.config.params, 'zoneIdList'), false);
    reset.resolve({ contents: [exploreTheme(5)] }); await m.settle(); requests[0].resolve({ contents: [exploreTheme(1)] }); await m.settle(); assert.deepEqual(exploreIds(m), [5]); assert.equal(listErrors(m).length, 0);
  });

  test(`async lists: ${item.name} mobile applied filters keep their request shape and stale results cannot undo an apply`, async () => {
    const m = mount(item.file, { isMobile: true }); m.render(); assert.equal(exploreRequests(m, item).length, 1);
    const apply = () => m.children('BottomSheet')[0].props.onApply;
    const selection = { activeRegionId: 2, zones: [{ zoneId: 21, zoneName: '수원', regionId: 2 }], selectedRegion: '수원', selectedZones: ['수원'], isAllZoneSelected: false };
    apply()({ people: 4, sort: 'LOW_PRICE', region: '수원', regionSelection: selection }); m.render(); await m.settle();
    const latest = exploreRequests(m, item)[1]; assert.equal(latest.config.params.headcount, 4); assert.equal(latest.config.params.sortOption, 'LOW_PRICE'); assert.equal(latest.config.params.regionId, 2); assert.equal(latest.config.params.zoneIdList, '21');
    latest.resolve({ contents: Array.from({ length: 6 }, (_, i) => exploreTheme(i + 11)) }); await m.settle(); assert.equal(exploreCards(m).length, 4);
    exploreRequests(m, item)[0].resolve({ contents: [exploreTheme(1)] }); await m.settle(); assert.equal(exploreIds(m)[0], 11); assert.equal(m.children('BottomSheet')[0].props.selectedPeople, 4);
    m.children('CustomPagination')[0].props.onPageChange(2); m.render(); await m.settle(); assert.deepEqual(exploreIds(m), [15, 16]); assert.equal(exploreRequests(m, item).length, 2);
  });
}

for (const item of exploreCases) test(`async lists: ${item.name} invalidates an old response at commit before passive cleanup runs`, async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(item.file, { routeState: { keyword: 'query-a' } }); m.render(); const old = exploreRequests(m, item)[0];
    if (item.name === 'search') { m.children('SearchInput')[0].props.setKeyword('query-b'); m.render({ deferPassive: true }); }
    else if (item.name === 'favorites') m.setAtom('headCountState', 3, { deferPassive: true });
    else { m.children('SortFilter')[0].props.onSelect('LOW_PRICE'); m.render({ deferPassive: true }); }
    const states = m.stateWrites.length;
    if (finish === 'resolve') old.resolve({ contents: [exploreTheme(1)] }); else old.reject(Error('old failure'));
    await flush(); await flush(); assert.equal(m.stateWrites.length, states); assert.equal(listErrors(m).length, 0);
    assert.equal(exploreRequests(m, item).length, 1); m.flushEffects();
    exploreRequests(m, item)[1].resolve({ contents: [exploreTheme(2)] }); await m.settle(); assert.deepEqual(exploreIds(m), [2]);
  }
});

const auxiliaryCases = exploreCases.filter(item => ['genre', 'level'].includes(item.name));
const auxiliaryRegions = [{ regionId: 1, regionName: '서울' }, { regionId: 2, regionName: '경기/인천' }];
const auxiliaryZones = { 1: [{ zoneId: 11, zoneName: '강남' }, { zoneId: 12, zoneName: '홍대' }], 2: [{ zoneId: 21, zoneName: '수원' }] };
const auxiliaryRegion = m => m.children('RegionFilter')[0].props;
const auxiliaryQueries = (m, id) => m.requests.filter(request => request.url === `location/regions/${id}/zones`);
async function auxiliaryMount(item, options) {
  const m = mount(item.file, options); m.render();
  m.requests.find(request => request.url === 'location/regions').resolve(auxiliaryRegions); await m.settle();
  auxiliaryQueries(m, 1)[0].resolve(auxiliaryZones[1]); await m.settle(); return m;
}

for (const item of auxiliaryCases) {
  test(`async regions: ${item.name} A-B-A zone responses cannot overwrite the current tab`, async () => {
    const m = await auxiliaryMount(item);
    auxiliaryRegion(m).onTabClick(2); m.render(); auxiliaryRegion(m).onTabClick(1); m.render();
    auxiliaryQueries(m, 1)[1].resolve([{ zoneId: 13, zoneName: '최신 서울' }]); await m.settle();
    auxiliaryQueries(m, 2)[0].resolve(auxiliaryZones[2]); await m.settle();
    assert.equal(auxiliaryRegion(m).activeRegionId, 1); assert.deepEqual(auxiliaryRegion(m).zones.map(zone => zone.zoneId), [13]);
  });

  test(`async regions: ${item.name} all-regions reset wins over a pending regional-all selection`, async () => {
    const m = await auxiliaryMount(item);
    auxiliaryRegion(m).onTabClick(2); m.render();
    const pending = auxiliaryRegion(m).onTabAllClick(2, '경기/인천 전체'); m.render();
    const old = auxiliaryQueries(m, 2).at(-1);
    auxiliaryRegion(m).onRegionAllClick(); m.render(); await m.settle();
    old.resolve(auxiliaryZones[2]); await pending; await m.settle();
    const region = auxiliaryRegion(m);
    assert.equal(region.selectedRegion, '지역 전체'); assert.equal(region.regionId, null); assert.equal(region.zoneIdList, null);
    const params = exploreRequests(m, item).at(-1).config.params; assert.equal(Object.hasOwn(params, 'regionId'), false); assert.equal(Object.hasOwn(params, 'zoneIdList'), false);
  });
}

const auxiliaryErrors = m => m.errors.filter(([message]) => ['지역 목록 불러오기 실패:', '구역 목록 불러오기 실패:'].includes(message));
const auxiliarySnapshot = m => {
  const { activeRegionId, selectedRegion, selectedZones, isAllZoneSelected, regionId, zoneIdList, zones } = auxiliaryRegion(m);
  return { activeRegionId, selectedRegion, selectedZones: plain(selectedZones), isAllZoneSelected, regionId, zoneIdList: zoneIdList == null ? zoneIdList : plain(zoneIdList), zoneIds: plain(zones.map(zone => zone.zoneId)) };
};

for (const item of auxiliaryCases) {
  test(`async regions: ${item.name} repeated A generations reject both the old A and B outcomes`, async () => {
    for (const finish of ['resolve', 'reject']) {
      const m = await auxiliaryMount(item);
      auxiliaryRegion(m).onTabClick(1); m.render(); const oldA = auxiliaryQueries(m, 1).at(-1);
      auxiliaryRegion(m).onTabClick(2); m.render(); const oldB = auxiliaryQueries(m, 2).at(-1);
      auxiliaryRegion(m).onTabClick(1); m.render(); const current = auxiliaryQueries(m, 1).at(-1);
      current.resolve([{ zoneId: 13, zoneName: '최신 서울' }]); await m.settle(); const states = m.stateWrites.length;
      if (finish === 'resolve') oldA.resolve(auxiliaryZones[1]); else oldA.reject(Error('old A failure'));
      oldB.resolve(auxiliaryZones[2]); await m.settle();
      assert.equal(m.stateWrites.length, states); assert.equal(auxiliaryErrors(m).length, 0); assert.deepEqual(auxiliarySnapshot(m).zoneIds, [13]);
      assert.equal(m.requests.every(request => request.method === 'GET'), true);
    }
  });

  test(`async regions: ${item.name} a late initial region catalog cannot reset a newer tab or selection`, async () => {
    const m = mount(item.file); m.render(); const catalog = m.requests.find(request => request.url === 'location/regions');
    auxiliaryRegion(m).onTabClick(2); m.render(); auxiliaryQueries(m, 2)[0].resolve(auxiliaryZones[2]); await m.settle();
    await auxiliaryRegion(m).onZoneSelect('수원'); m.render(); await m.settle();
    catalog.resolve(auxiliaryRegions); await m.settle();
    assert.equal(auxiliaryRegion(m).regions.length, 2); assert.equal(auxiliaryQueries(m, 1).length, 0);
    assert.equal(auxiliaryRegion(m).activeRegionId, 2); assert.equal(auxiliaryRegion(m).regionId, 2); assert.deepEqual(plain(auxiliaryRegion(m).zoneIdList), [21]);
    assert.deepEqual(plain(exploreRequests(m, item).at(-1).config.params).zoneIdList, '21');
  });

  test(`async regions: ${item.name} catalog unmount/reentry and StrictMode discard old outcomes and do not spawn old zone lookups`, async () => {
    for (const lifecycle of ['remount', 'strictReplay']) for (const finish of ['resolve', 'reject']) {
      const m = mount(item.file); m.render(); const old = m.requests.find(request => request.url === 'location/regions');
      if (lifecycle === 'remount') { m.unmount(); m.remount(); } else m.strictReplay();
      const catalog = m.requests.filter(request => request.url === 'location/regions'); assert.equal(catalog.length, 2);
      const states = m.stateWrites.length;
      if (finish === 'resolve') old.resolve(auxiliaryRegions); else old.reject(Error('old catalog failure'));
      await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(auxiliaryQueries(m, 1).length, 0); assert.equal(auxiliaryErrors(m).length, 0);
      catalog[1].resolve(auxiliaryRegions); await m.settle(); assert.equal(auxiliaryQueries(m, 1).length, 1);
      auxiliaryQueries(m, 1)[0].resolve(auxiliaryZones[1]); await m.settle(); assert.deepEqual(auxiliarySnapshot(m).zoneIds, [11, 12]);
    }
  });

  test(`async regions: ${item.name} zone requests cannot affect a remounted or StrictMode-reentered view`, async () => {
    for (const lifecycle of ['remount', 'strictReplay']) for (const finish of ['resolve', 'reject']) {
      const m = await auxiliaryMount(item);
      const old = auxiliaryRegion(m).onTabAllClick(2, '경기/인천 전체'); m.render(); const oldRequest = auxiliaryQueries(m, 2).at(-1);
      if (lifecycle === 'remount') { m.unmount(); m.remount(); } else m.strictReplay();
      const states = m.stateWrites.length;
      if (finish === 'resolve') oldRequest.resolve(auxiliaryZones[2]); else oldRequest.reject(Error('old failure'));
      await old; await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(auxiliaryErrors(m).length, 0);
      const currentId = auxiliaryRegion(m).activeRegionId; auxiliaryRegion(m).onTabClick(currentId); m.render();
      auxiliaryQueries(m, currentId).at(-1).resolve(auxiliaryZones[currentId]); await m.settle(); assert.deepEqual(auxiliarySnapshot(m).zoneIds, currentId === 1 ? [11, 12] : [21]);
    }
  });

  test(`async regions: ${item.name} all-regions reset invalidates pending regional-all work even before the next render`, async () => {
    for (const finish of ['resolve', 'reject']) {
      const m = await auxiliaryMount(item);
      const pending = auxiliaryRegion(m).onTabAllClick(2, '경기/인천 전체'); m.render(); const old = auxiliaryQueries(m, 2).at(-1);
      auxiliaryRegion(m).onRegionAllClick(); const states = m.stateWrites.length;
      if (finish === 'resolve') old.resolve(auxiliaryZones[2]); else old.reject(Error('old failure'));
      await pending; await flush(); assert.equal(m.stateWrites.length, states); assert.equal(auxiliaryErrors(m).length, 0);
      m.render(); await m.settle();
      assert.equal(auxiliaryRegion(m).regionId, null); assert.equal(auxiliaryRegion(m).zoneIdList, null); assert.equal(auxiliaryRegion(m).selectedRegion, '지역 전체');
      assert.equal(auxiliaryRegion(m).isAllZoneSelected, false); assert.deepEqual(plain(auxiliaryRegion(m).selectedZones), []);
      assert.equal(m.children('PeopleFilter')[0].props.selected, 2); assert.equal(m.children('SortFilter')[0].props.selected, 'HIGH_SATISFACTION_LEVEL');
    }
  });

  test(`async regions: ${item.name} selecting a zone while regional-all is pending keeps the user's latest zone IDs`, async () => {
    const m = await auxiliaryMount(item);
    const pending = auxiliaryRegion(m).onTabAllClick(1, '서울 전체'); m.render(); const request = auxiliaryQueries(m, 1).at(-1);
    assert.equal(auxiliaryRegion(m).regionId, 1); assert.equal(auxiliaryRegion(m).zoneIdList, null);
    await auxiliaryRegion(m).onZoneSelect('홍대'); m.render(); await m.settle();
    const snapshot = auxiliarySnapshot(m); request.resolve(auxiliaryZones[1]); await pending; await m.settle();
    assert.deepEqual(auxiliarySnapshot(m), snapshot); assert.equal(snapshot.selectedRegion, '홍대'); assert.deepEqual(snapshot.zoneIdList, [12]); assert.equal(snapshot.isAllZoneSelected, false);
    assert.equal(exploreRequests(m, item).at(-1).config.params.zoneIdList, '12');
  });

  test(`async regions: ${item.name} switching regions cannot select old zones or combine IDs while loading`, async () => {
    const m = await auxiliaryMount(item), oldSelect = auxiliaryRegion(m).onZoneSelect;
    auxiliaryRegion(m).onTabClick(2); await oldSelect('강남'); m.render(); await m.settle();
    assert.deepEqual(auxiliarySnapshot(m).zoneIds, []); const queryCount = exploreRequests(m, item).length;
    await auxiliaryRegion(m).onZoneSelect('강남'); m.render(); await m.settle();
    assert.equal(exploreRequests(m, item).length, queryCount); assert.deepEqual(plain(auxiliaryRegion(m).selectedZones), []);
    auxiliaryQueries(m, 2)[0].resolve(auxiliaryZones[2]); await m.settle();
    await auxiliaryRegion(m).onZoneSelect('수원'); m.render(); await m.settle();
    assert.equal(auxiliaryRegion(m).regionId, 2); assert.deepEqual(plain(auxiliaryRegion(m).zoneIdList), [21]); assert.equal(exploreRequests(m, item).at(-1).config.params.zoneIdList, '21');
  });

  test(`async regions: ${item.name} lookup failures preserve selected IDs and allow tab/regional-all retry`, async () => {
    const m = await auxiliaryMount(item);
    auxiliaryRegion(m).onTabClick(2); m.render(); auxiliaryQueries(m, 2)[0].reject(Error('current failure')); await m.settle();
    assert.equal(auxiliaryErrors(m).length, 1); assert.deepEqual(auxiliarySnapshot(m).zoneIds, []);
    auxiliaryRegion(m).onTabClick(2); m.render(); auxiliaryQueries(m, 2)[1].resolve(auxiliaryZones[2]); await m.settle();
    assert.deepEqual(auxiliarySnapshot(m).zoneIds, [21]);
    const failed = auxiliaryRegion(m).onTabAllClick(2, '경기/인천 전체'); m.render();
    assert.equal(auxiliaryRegion(m).regionId, 2); auxiliaryQueries(m, 2)[2].reject(Error('regional-all lookup failure')); await failed; await m.settle();
    assert.equal(auxiliaryRegion(m).selectedRegion, '경기/인천 전체'); assert.equal(auxiliaryRegion(m).regionId, 2); assert.equal(auxiliaryRegion(m).zoneIdList, null);
    const retry = auxiliaryRegion(m).onTabAllClick(2, '경기/인천 전체'); m.render(); auxiliaryQueries(m, 2)[3].resolve(auxiliaryZones[2]); await retry; await m.settle();
    assert.equal(auxiliaryErrors(m).length, 2); assert.deepEqual(auxiliarySnapshot(m).zoneIds, [21]);
  });

  test(`async regions: ${item.name} consecutive zone clicks before render preserve order and final deselection resets API IDs`, async () => {
    const m = await auxiliaryMount(item), select = auxiliaryRegion(m).onZoneSelect;
    await select('강남'); await select('홍대'); m.render(); await m.settle();
    assert.deepEqual(plain(auxiliaryRegion(m).selectedZones), ['강남', '홍대']); assert.deepEqual(plain(auxiliaryRegion(m).zoneIdList), [11, 12]);
    assert.equal(auxiliaryRegion(m).selectedRegion, '강남 외 1개');
    await select('강남'); await select('홍대'); m.render(); await m.settle();
    assert.equal(auxiliaryRegion(m).selectedRegion, '지역 전체'); assert.equal(auxiliaryRegion(m).regionId, null); assert.equal(auxiliaryRegion(m).zoneIdList, null);
    assert.equal(Object.hasOwn(exploreRequests(m, item).at(-1).config.params, 'zoneIdList'), false);
  });

  test(`async regions: ${item.name} regional-all A-B-A protects filter IDs and the theme list from old successes/errors`, async () => {
    const m = await auxiliaryMount(item);
    const oldA = auxiliaryRegion(m).onTabAllClick(1, '서울 전체'); m.render(); const requestA = auxiliaryQueries(m, 1).at(-1);
    const oldB = auxiliaryRegion(m).onTabAllClick(2, '경기/인천 전체'); m.render(); const requestB = auxiliaryQueries(m, 2).at(-1);
    const current = auxiliaryRegion(m).onTabAllClick(1, '서울 전체'); m.render(); const latest = auxiliaryQueries(m, 1).at(-1); await m.settle();
    latest.resolve(auxiliaryZones[1]); await current; await m.settle(); const states = m.stateWrites.length;
    requestA.reject(Error('old failure')); requestB.resolve(auxiliaryZones[2]); await Promise.all([oldA, oldB]); await m.settle();
    assert.equal(m.stateWrites.length, states); assert.equal(auxiliaryErrors(m).length, 0); assert.equal(auxiliaryRegion(m).regionId, 1); assert.equal(auxiliaryRegion(m).selectedRegion, '서울 전체');
    const themes = exploreRequests(m, item), count = themes.length; assert.equal(themes.at(-1).config.params.regionId, 1);
    themes.at(-1).resolve({ contents: [exploreTheme(99)] }); await m.settle(); themes[0].resolve({ contents: [exploreTheme(1)] }); await m.settle();
    assert.deepEqual(exploreIds(m), [99]); assert.equal(exploreRequests(m, item).length, count);
  });

  test(`async regions: ${item.name} mobile apply supersedes pending bootstrap zones without losing its filter payload`, async () => {
    for (const finish of ['resolve', 'reject']) {
      const m = mount(item.file, { isMobile: true }); m.render();
      m.requests.find(request => request.url === 'location/regions').resolve(auxiliaryRegions); await m.settle(); const bootstrap = auxiliaryQueries(m, 1)[0];
      const selection = { activeRegionId: 2, zones: [{ zoneId: 21, zoneName: '수원', regionId: 2 }], selectedRegion: '수원', selectedZones: ['수원'], isAllZoneSelected: false };
      m.children('BottomSheet')[0].props.onApply({ people: 4, sort: 'LOW_PRICE', region: '지역 선택됨', regionSelection: selection }); m.render(); await m.settle(); const states = m.stateWrites.length;
      if (finish === 'resolve') bootstrap.resolve(auxiliaryZones[1]); else bootstrap.reject(Error('old failure'));
      await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(auxiliaryErrors(m).length, 0);
      const sheet = m.children('BottomSheet')[0].props; assert.equal(sheet.activeRegionId, 2); assert.deepEqual(sheet.zones.map(zone => zone.zoneId), [21]); assert.equal(sheet.selectedRegion, '수원');
      const params = exploreRequests(m, item).at(-1).config.params; assert.equal(params.headcount, 4); assert.equal(params.sortOption, 'LOW_PRICE'); assert.equal(params.regionId, 2); assert.equal(params.zoneIdList, '21');
    }
  });

  test(`async regions: ${item.name} retained callbacks and pending catalog/zone work cannot act after unmount`, async () => {
    for (const phase of ['catalog', 'zones']) for (const finish of ['resolve', 'reject']) {
      const m = phase === 'catalog' ? mount(item.file) : await auxiliaryMount(item); if (phase === 'catalog') m.render();
      const region = auxiliaryRegion(m);
      if (phase === 'zones') { region.onTabClick(2); m.render(); }
      const pending = phase === 'catalog' ? m.requests.find(request => request.url === 'location/regions') : auxiliaryQueries(m, 2)[0];
      m.unmount(); const states = m.stateWrites.length, requests = m.requests.length;
      region.onTabClick(1); region.onRegionAllClick(); region.onRegionSelect('서울 전체'); await region.onTabAllClick(1, '서울 전체'); await region.onZoneSelect('강남');
      if (finish === 'resolve') pending.resolve(phase === 'catalog' ? auxiliaryRegions : auxiliaryZones[2]); else pending.reject(Error('old failure'));
      await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(m.requests.length, requests); assert.equal(auxiliaryErrors(m).length, 0);
    }
  });
}
