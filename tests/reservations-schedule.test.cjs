const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const dayjs = require('dayjs');

const root = path.resolve(__dirname, '..');
const cards = name => `src/features/mypage/ui/reservations/${name}.tsx`;
const schedule = name => `src/features/schedule/ui/${name}.tsx`;
const plain = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));

// Actual UI, atom defaults, converters and API functions run with a deferred,
// local HTTP transport. Child UI and library widgets are inspected via props.
function mount(relative, { props = {}, values = {}, isMobile = false, sharedAtoms } = {}) {
  const atoms = sharedAtoms || { ...values }, slots = [], effects = [], layoutEffects = [], writes = [], stateWrites = [], requests = [], navigation = [], alerts = [], errors = [];
  if (sharedAtoms) for (const [key, value] of Object.entries(values)) if (!Object.hasOwn(atoms, key)) atoms[key] = value;
  const cache = new Map(), defaults = new Map(), setters = new Map();
  const listeners = new Map();
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
      if (id.endsWith('/utils/analytics')) return load(path.resolve(path.dirname(filename), id + '.ts'));
      if (id === 'react') return { ...react, __esModule: true, default: react };
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled, css };
      if (id === 'dayjs' || id === 'date-fns') return require(id);
      if (id === 'react-router-dom') return { useNavigate: () => (...args) => navigation.push(args) };
      if (id === 'recoil') return {
        atom(config) { defaults.set(config.key, config.default); if (!Object.hasOwn(atoms, config.key)) atoms[config.key] = structuredClone(config.default); return config.key; },
        atomFamily(config) { return parameter => `${config.key}:${String(parameter)}`; },
        useRecoilValue: key => atoms[key], useSetRecoilState: setter, useRecoilState: key => [atoms[key], setter(key)],
      };
      if (id.endsWith('/hooks/useDevice')) return { __esModule: true, default: () => ({ isMobile }) };
      if (id.includes('app/API')) return { api };
      if (id.includes('/model/') || id.endsWith('/modal/scheduleAtom') || id.includes('/api/') || id.endsWith('/utils/dataUtils')) {
        let target = path.resolve(path.dirname(filename), id);
        if (!path.extname(target)) target += '.ts';
        return load(target);
      }
      if (id === '@mui/material') return { Popover: 'Popover' };
      if (id.startsWith('@mui/')) { const name = id.split('/').at(-1); return { [name]: name }; }
      return { __esModule: true, default: id.replace(/\.(jsx|tsx)$/, '') };
    };
    const baselineRoot = process.env.RESERVATION_UI_BASELINE;
    const baseline = baselineRoot && [path.join(baselineRoot, path.relative(root, filename)), path.join(baselineRoot, path.relative(root, filename).replace(/\.tsx$/, '.jsx'))].find(candidate => fs.existsSync(candidate));
    const source = baseline && fs.existsSync(baseline) ? baseline : filename;
    const code = ts.transpileModule(fs.readFileSync(source, 'utf8'), { fileName: source, compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: requireModule, Date,
      window: { innerWidth: isMobile ? 375 : 1280 },
      document: { addEventListener(name, fn) { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(fn); }, removeEventListener(name, fn) { listeners.get(name)?.delete(fn); } },
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
    atoms, writes, stateWrites, requests, navigation, alerts, errors, listeners, render, nodes, text: () => text(tree), textOf: text,
    children: name => nodes(node => String(node.type).endsWith('/' + name) || node.type === name),
    update(next) { Object.assign(props, next); return render(); },
    setAtom(key, value) { setAtom(key, value); return render(); },
    click(textValue, event = {}) { const result = nodes(node => typeof node.props.onClick === 'function' && text(node) === textValue)[0].props.onClick(event); render(); return result; },
    dispatch(name, event) { listeners.get(name)?.forEach(fn => fn(event)); return render(); },
    async settle() { for (let i = 0; i < 20; i++) { await flush(); if (unmounted || !changed) return; render(); } throw Error('UI did not settle'); },
    unmount() { unmounted = true; slots.forEach(slot => slot?.cleanup?.()); },
  };
}

const reservation = () => ({
  themeReservationId: 81, themeId: 7, reservedAt: '2026.11.01 14:30', themeName: '테마', themeImg: 'theme.png',
  storeName: '매장', locationName: '홍대', awardsYear: 2025, satisfactionLevel: 4.5, level: 3, playTime: 60, genreList: ['DRAMA', 'HORROR'],
});

test('4-22 reservation card keeps desktop/mobile labels, nullable fields, image fallback and navigation', async () => {
  for (const isMobile of [false, true]) {
    const m = mount(cards('ReservedCard'), { isMobile, props: { data: reservation(), isMyPage: true } }); m.render(); await m.settle();
    assert.match(m.text(), /11월 01일 14:30/); assert.match(m.text(), /예약 완료/); assert.match(m.text(), /매장/); assert.match(m.text(), /드라마.*공포/);
    m.nodes(n => n.props.isMyPage === true && typeof n.props.onClick === 'function')[0].props.onClick(); assert.equal(m.navigation[0][0], '/theme/7');
    const data = { ...reservation(), themeImg: null, genreList: null, satisfactionLevel: null, level: null, awardsYear: null };
    m.update({ data }); await m.settle(); assert.match(m.nodes(n => n.type === 'img')[0].props.src, /thumbnailImg.png$/);
    assert.match(m.text(), /-/); assert.equal(m.children('ReservationDropDown')[0].props.reservation, data);
    m.nodes(n => n.type === 'img')[0].props.onError(); await m.settle(); assert.match(m.nodes(n => n.type === 'img')[0].props.src, /thumbnailImg.png$/);
  }
});

test('4-22 preview empty/data branches retain null date, hideTrash and clear callback order', async () => {
  for (const isMobile of [false, true]) {
    const calls = [];
    const m = mount(cards('ReservedCard'), { isMobile, props: { isModal: true, data: null, setSelectedTheme: value => calls.push(['theme', value]), setSelectedThemeId: value => calls.push(['id', value]) } }); m.render();
    assert.match(m.text(), /선택한 테마가/); assert.equal(m.children('ReservationDropDown').length, 0);
    m.update({ data: { ...reservation(), reservedAt: null } }); await m.settle(); assert.match(m.text(), /선택한 일정이 표시됩니다/);
    m.nodes(n => typeof n.props.onClick === 'function' && String(n.type).includes('trashicon.svg'))[0].props.onClick({ stopPropagation: () => calls.push(['stop']) });
    assert.deepEqual(calls, [['stop'], ['theme', null], ['id', null]]);
    m.update({ hideTrash: true }); assert.equal(m.nodes(n => typeof n.props.onClick === 'function' && String(n.type).includes('trashicon.svg')).length, 0);
  }
});

test('4-22 reservation review entry preserves raw DTO and image in existing Recoil atoms', () => {
  const data = reservation(); const m = mount(cards('ReservedCard'), { props: { data } }); m.render();
  m.children('ReservationDropDown')[0].props.onReviewClick(); assert.equal(m.atoms.selectedThemeDataState.data, data); assert.equal(m.atoms.selectedThemeDataState.img, data.themeImg); assert.equal(m.atoms.reviewModalState, true);
  assert.equal(m.requests.length, 0);
});

test('4-22 dropdown retains stopPropagation, edit/review callbacks, outside clicks and cleanup', () => {
  let review = 0, stopped = 0;
  const data = reservation(), m = mount(cards('ReservationDropDown'), { props: { reservation: data, onReviewClick: () => review++ } }); m.render();
  const open = () => { m.nodes(n => String(n.type).includes('more.svg') && n.props.onClick)[0].props.onClick({ stopPropagation: () => stopped++ }); m.render(); };
  open(); m.click('후기 작성', { stopPropagation: () => stopped++ }); assert.equal(review, 1);
  open(); m.click('예약 일정 변경', { stopPropagation: () => stopped++ }); assert.deepEqual(plain(m.atoms.scheduleModalState), { isOpen: true, mode: 'edit', reservation: data });
  open(); const inside = {}; m.nodes(n => n.props.ref)[0].props.ref.current = { contains: value => value === inside };
  m.dispatch('mousedown', { target: inside }); assert.match(m.text(), /예약 일정 변경/);
  m.dispatch('mousedown', { target: null }); assert.doesNotMatch(m.text(), /예약 일정 변경/); assert.equal(stopped, 5);
  m.unmount(); assert.equal(m.listeners.get('mousedown').size, 0);
});

test('4-22 deletion refreshes the captured month after success and preserves other monthly cache entries', async () => {
  const m = mount(cards('ReservationDropDown'), { props: { reservation: reservation(), onReviewClick() {} }, values: { calendarMonthState: new Date(2026, 10, 1), reservationListState: { '2026-10': [reservation()] } } }); m.render();
  const pending = m.children('PopUpModal')[0].props.onConfirm(); assert.equal(m.requests[0].method, 'DELETE'); assert.equal(m.requests[0].url, 'themes/7/reservations/81');
  assert.deepEqual(plain(m.requests[0].config.params), { themeId: 7, reservationId: 81 });
  m.requests[0].resolve('deleted'); await m.settle(); assert.equal(m.requests[1].url, 'members/reservations'); assert.deepEqual(plain(m.requests[1].config.params), { year: '2026', month: '11' });
  m.requests[1].resolve({ themeReservationList: {} }); await pending; await m.settle();
  assert.deepEqual(plain(m.atoms.reservationListState['2026-11']), []); assert.equal(m.atoms.reservationListState['2026-10'].length, 1); assert.deepEqual(m.alerts, ['예약이 삭제되었습니다.']);
});

test('4-22 failed deletion keeps cache and reports the existing failure alert', async () => {
  const initial = { '2026-11': [reservation()] };
  const m = mount(cards('ReservationDropDown'), { props: { reservation: reservation(), onReviewClick() {} }, values: { reservationListState: initial } }); m.render();
  const pending = m.children('PopUpModal')[0].props.onConfirm(); m.requests[0].reject(Error('401')); await pending;
  assert.equal(m.atoms.reservationListState, initial); assert.deepEqual(m.alerts, ['예약 삭제에 실패했습니다.']); assert.equal(m.requests.length, 1);
});

test('4-22 calendar retains dotted-date counts, cache aggregation, React Date-key text and month moves', () => {
  const m = mount(cards('CalendarSection'), { values: { calendarMonthState: new Date(2026, 10, 1), reservationListState: { '2026-11': [reservation(), reservation()], '2026-12': [] } } }); m.render();
  assert.match(m.text(), /2026년 11월/); assert.match(m.text(), /2건/);
  assert.equal(m.nodes(n => typeof n.props.isCurrentMonth === 'boolean').length % 7, 0);
  const eventDate = m.nodes(n => n.props.hasEvent === true)[0]; assert.equal(m.textOf(eventDate), '1');
  m.nodes(n => String(n.type).includes('rightArrow') && n.props.onClick)[0].props.onClick(); m.render(); assert.match(m.text(), /2026년 12월/);
  m.nodes(n => String(n.type).includes('leftArrow') && n.props.onClick)[0].props.onClick(); m.render(); assert.match(m.text(), /2026년 11월/);
  assert.equal(m.nodes(n => n.key && /GMT/.test(n.key)).length > 0, true);
});

const theme = (id = 7) => ({ themeId: id, themeName: `테마${id}`, locationName: '홍대', awardsYear: null, img: 'theme.png', satisfactionLevel: null, level: 3, playTime: 60, storeName: '매장', isLiked: false, genreList: [], price: null, maxHeadcount: null });
const detail = (img = 'detail.png') => ({ themeId: 7, themeName: '테마7', img, playTime: 60, minRecommendedHeadcount: null, maxRecommendedHeadcount: null, genreList: [], level: 3, horrorLevel: 2, synopsis: '', storeInfo: { storeId: 8, storeName: '매장', locationName: '홍대', storeWebsiteUrl: '', storeReservationUrl: '', storeAddress: '', storeContact: '' }, isLiked: false });

function itemSection(props = {}, values = {}) {
  const states = [];
  const m = mount(schedule('ScheduleItemSection'), { props: { isModal: true, onStateChange: state => states.push(state), ...props }, values });
  m.render(); return { m, states, state: () => states.at(-1) };
}

test('4-23 search retains request params, themeId keys, preview selection/clear and error-empty state', async () => {
  const { m, state } = itemSection(); assert.match(m.text(), /검색 결과가 표시됩니다/); assert.equal(m.children('ReservedCard')[0].props.data, null);
  const search = value => { m.nodes(n => n.type === 'styled.input')[0].props.onChange({ target: { value } }); m.render(); };
  search('테마'); assert.deepEqual(plain(m.requests[0].config.params), { keyword: '테마', page: 1, size: 10000 });
  m.requests[0].resolve({ contents: [theme()] }); await m.settle();
  const result = m.nodes(n => n.key === '7' && n.props.onClick)[0]; result.props.onClick(); m.render(); await m.settle();
  assert.equal(state().selectedThemeId, 7); assert.equal(state().isSubmitEnabled, false);
  assert.equal(m.children('ReservedCard')[0].props.data.themeImg, 'theme.png'); assert.equal(m.children('ReservedCard')[0].props.data.reservedAt, null);
  const card = m.children('ReservedCard')[0]; card.props.setSelectedTheme(null); card.props.setSelectedThemeId(null); m.render(); await m.settle(); assert.equal(m.children('ReservedCard')[0].props.data, null);
  search('다른 테마'); m.requests[1].reject(Error('401')); await m.settle(); assert.match(m.text(), /검색 결과가 없습니다/); assert.equal(m.errors.length, 2);
  search(''); assert.match(m.text(), /검색 결과가 표시됩니다/);
});

test('4-23 detail preview uses nested location and retains empty-image undefined plus card fallback', async () => {
  for (const img of ['detail.png', '']) {
    const { m } = itemSection({ themeId: '7' }); assert.equal(m.requests[0].url, 'themes/7');
    m.requests[0].resolve(detail(img)); await m.settle();
    const props = m.children('ReservedCard')[0].props; assert.equal(props.data.themeId, 7); assert.equal(props.data.locationName, '홍대'); assert.equal(props.data.themeImg, img || undefined);
    const preview = mount(cards('ReservedCard'), { props }); preview.render(); await preview.settle();
    const src = preview.nodes(n => n.type === 'img')[0].props.src;
    if (img) assert.equal(src, img); else assert.match(src, /thumbnailImg.png$/);
  }
});

test('4-23 false modal state renders no preview and creates no fallback data', { skip: !!process.env.RESERVATION_UI_BASELINE }, () => {
  const { m, state } = itemSection({ isModal: false }); assert.equal(m.nodes(n => n.type === 'styled.input').length, 1); assert.equal(m.children('ReservedCard').length, 0);
  assert.equal(state().selectedThemeId, null); assert.equal(state().reservedAt, null); assert.equal(m.requests.length, 0);
});

test('4-23 date-only remains enabled with null reservedAt; date/time changes keep existing formatting', async () => {
  const { m, state } = itemSection({ themeId: 7 }); m.requests[0].resolve(detail()); await m.settle();
  const date = new Date(2026, 10, 2); m.children('VisitDatePicker')[0].props.onChange(date); m.render(); await m.settle();
  assert.equal(state().visitDate, date); assert.equal(state().isSubmitEnabled, true); assert.equal(state().reservedAt, null);
  assert.equal(m.children('ReservedCard')[0].props.data.reservedAt, null);
  m.children('ScheduleTimePicker')[0].props.onTimeChange('14:35:00'); m.render(); await m.settle(); assert.equal(state().reservedAt, '2026-11-02T14:35:00');
  m.children('VisitDatePicker')[0].props.onChange(new Date(2026, 10, 3)); m.render(); await m.settle(); assert.equal(state().reservedAt, '2026-11-03T14:35:00');
});

test('4-23 time-first keeps the existing today fallback, while edit restores Dayjs and ISO preview', async () => {
  const first = itemSection({ themeId: 7 }); first.m.requests[0].resolve(detail()); await first.m.settle();
  first.m.children('ScheduleTimePicker')[0].props.onTimeChange('14:35:00'); first.m.render(); await first.m.settle();
  assert.equal(first.state().visitDate, null); assert.equal(first.state().reservedAt, `${dayjs().format('YYYY-MM-DD')}T14:35:00`); assert.equal(first.state().isSubmitEnabled, true);
  const edit = itemSection({}, { scheduleModalState: { isOpen: true, mode: 'edit', reservation: reservation() } }); await edit.m.settle();
  assert.equal(edit.m.requests.length, 0); assert.equal(dayjs.isDayjs(edit.state().visitDate), true); assert.equal(edit.state().reservedAt, '2026-11-01T14:30:00');
  assert.equal(edit.m.children('ReservedCard')[0].props.data.themeReservationId, 81); assert.equal(edit.m.children('ReservedCard')[0].props.hideTrash, false);
});

test('4-23 failed detail keeps empty selection, and undefined/null-entry IDs cause no initial request', async () => {
  const empty = itemSection(); assert.equal(empty.m.requests.length, 0); assert.equal(empty.state().selectedThemeId, null);
  const failed = itemSection({ themeId: 7 }); failed.m.requests[0].reject(Error('offline')); await failed.m.settle();
  assert.equal(failed.m.children('ReservedCard')[0].props.data, null); assert.equal(failed.state().isSubmitEnabled, false); assert.equal(failed.m.errors.length, 2);
});

test('4-23 time picker retains anchor, hour/minute/back flow, null no-op, 5-minute step and callback', async () => {
  // LocalizationProvider constructs this real adapter in the browser, which
  // initializes Dayjs parsing plugins before the initialTime effect runs.
  const { AdapterDayjs } = require('@mui/x-date-pickers/AdapterDayjs'); new AdapterDayjs();
  for (const isMobile of [false, true]) {
    const selected = [], anchor = {};
    const m = mount(schedule('ScheduleTimePicker'), { isMobile, props: { initialTime: null, onTimeChange: value => selected.push(value) } }); m.render(); assert.match(m.text(), /시간 선택/);
    m.nodes(n => n.props.onClick && n.type === 'styled.div')[0].props.onClick({ currentTarget: anchor }); m.render();
    assert.equal(m.children('Popover')[0].props.open, true); assert.equal(m.children('Popover')[0].props.anchorEl, anchor);
    m.children('TimeClock')[0].props.onChange(null); m.render(); assert.deepEqual(plain(m.children('TimeClock')[0].props.views), ['hours']);
    m.children('TimeClock')[0].props.onChange(dayjs().hour(13)); m.render(); assert.deepEqual(plain(m.children('TimeClock')[0].props.views), ['minutes']); assert.equal(m.children('TimeClock')[0].props.minutesStep, 5);
    m.nodes(n => n.props.onClick && String(n.type).includes('leftArrow'))[0].props.onClick(); m.render(); assert.deepEqual(plain(m.children('TimeClock')[0].props.views), ['hours']);
    m.children('TimeClock')[0].props.onChange(dayjs().hour(14)); m.render(); m.children('TimeClock')[0].props.onChange(dayjs().minute(35)); m.render();
    assert.deepEqual(selected, ['14:35:00']); assert.equal(m.children('Popover')[0].props.open, false); assert.match(m.text(), /14:35/);
    m.update({ initialTime: '15:20:00' }); await m.settle(); assert.match(m.text(), /15:20/);
  }
});

test('4-23 installed MUI clockSize removal preserves actual server-rendered clock markup and size', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { LocalizationProvider } = require('@mui/x-date-pickers/LocalizationProvider');
  const { AdapterDayjs } = require('@mui/x-date-pickers/AdapterDayjs');
  const { TimeClock } = require('@mui/x-date-pickers/TimeClock');
  const render = extra => renderToStaticMarkup(React.createElement(LocalizationProvider, { dateAdapter: AdapterDayjs },
    React.createElement(TimeClock, { value: dayjs('2026-11-01T13:00:00'), ampm: false, views: ['hours'], ...extra })));
  const after = render({});
  const warnings = [], previousError = console.error;
  try {
    // Capture the old unsupported-prop warning from the comparison fixture.
    console.error = (...args) => warnings.push(args.join(' '));
    for (const clockSize of [100, 180]) {
      const before = render({ clockSize });
      assert.equal(before.replace(/ clockSize="\d+"/, ''), after);
      assert.match(after, /width:220px/); assert.doesNotMatch(after, /clockSize=/);
    }
  } finally { console.error = previousError; }
  assert.equal(warnings.every(message => message.includes('clockSize')), true);
});

function saveModal({ mode = 'add', reservationData = null, props = {}, values = {} } = {}) {
  const m = mount(schedule('ScheduleModal'), { props, values: {
    calendarMonthState: new Date(2026, 10, 1), reservationListState: { '2026-10': [reservation()] },
    scheduleModalState: { isOpen: true, mode, reservation: reservationData }, ...values,
  } });
  m.render();
  const select = (change = {}) => {
    m.children('ScheduleItemSection')[0].props.onStateChange({ selectedThemeId: 7, visitDate: new Date(2026, 10, 2), isSubmitEnabled: true, reservedAt: '2026-11-02T14:35:00', ...change }); m.render();
  };
  const submit = () => m.click(mode === 'edit' ? '수정 완료하기' : '방탈출 예약 일정 추가하기');
  return { m, select, submit };
}

test('4-24 disabled/null-selection state does not submit and close keeps the existing mode/reservation fields', async () => {
  const { m, submit } = saveModal(); await submit(); assert.equal(m.requests.length, 0);
  m.nodes(n => n.props.onClick && String(n.type).includes('closeicon.svg'))[0].props.onClick(); m.render();
  assert.deepEqual(plain(m.atoms.scheduleModalState), { isOpen: false, mode: 'add', reservation: null });
  const edit = saveModal({ mode: 'edit' }); edit.select(); await edit.submit(); assert.equal(edit.m.requests.length, 0);
  await edit.m.children('PopUpModal')[0].props.onConfirm(); assert.equal(edit.m.requests.length, 0);
});

test('4-24 creation preserves null/date payloads, success alert, month refresh and close order', async () => {
  for (const reservedAt of [null, '2026-11-02T14:35:00']) {
    const { m, select, submit } = saveModal({ props: { themeId: '7' } }); select({ reservedAt });
    const pending = submit(); assert.equal(m.requests[0].url, 'themes/7/reservations'); assert.equal(m.requests[0].method, 'POST'); assert.deepEqual(plain(m.requests[0].body), { reservedAt });
    m.requests[0].resolve({ reservationId: 82 }); await m.settle();
    assert.deepEqual(m.alerts, ['예약이 추가되었습니다.']); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    assert.deepEqual(plain(m.requests[1].config.params), { year: '2026', month: '11' });
    m.requests[1].resolve({ themeReservationList: { '2026.11.02': [reservation()] } }); await pending; await m.settle();
    assert.equal(m.atoms.reservationListState['2026-11'].length, 1); assert.equal(m.atoms.reservationListState['2026-10'].length, 1); assert.equal(m.atoms.scheduleModalState.isOpen, false);
  }
});

test('4-24 edit uses original reservation URL and selected new theme in PATCH body', async () => {
  const { m, select, submit } = saveModal({ mode: 'edit', reservationData: reservation() }); select({ selectedThemeId: 8 });
  const pending = submit(); assert.equal(m.requests[0].url, 'themes/7/reservations/81'); assert.equal(m.requests[0].method, 'PATCH');
  assert.deepEqual(plain(m.requests[0].body), { themeId: 8, reservedAt: '2026-11-02T14:35:00' });
  m.requests[0].resolve('updated'); await m.settle(); assert.deepEqual(m.alerts, ['예약이 수정되었습니다.']);
  m.requests[1].resolve({}); await pending; await m.settle(); assert.deepEqual(plain(m.atoms.reservationListState['2026-11']), []); assert.equal(m.atoms.scheduleModalState.isOpen, false);
});

test('4-24 failed creation/edit keeps selected state and permits retry with unchanged payload', async () => {
  for (const mode of ['add', 'edit']) {
    const { m, select, submit } = saveModal({ mode, reservationData: mode === 'edit' ? reservation() : null }); select();
    const pending = submit(), original = plain(m.requests[0].body); m.requests[0].reject(Error('401')); await pending; await m.settle();
    assert.equal(m.atoms.scheduleModalState.isOpen, true); assert.equal(m.nodes(n => n.props.$isEnabled === true && n.props.onClick).length, 1);
    assert.deepEqual(m.alerts, [mode === 'edit' ? '예약 수정에 실패했습니다.' : '예약 추가에 실패했습니다.']);
    const retry = submit(); assert.deepEqual(plain(m.requests[1].body), original);
    m.requests[1].resolve(mode === 'edit' ? 'updated' : { reservationId: 82 }); await m.settle(); m.requests[2].resolve({ themeReservationList: {} }); await retry;
    assert.equal(m.atoms.scheduleModalState.isOpen, false);
  }
});

test('4-24 deletion refreshes before success alert/close; failure preserves modal and cache', async () => {
  for (const fail of [false, true]) {
    const { m } = saveModal({ mode: 'edit', reservationData: reservation() });
    m.click('예약 내역 삭제하기'); assert.equal(m.children('PopUpModal')[0].props.isOpen, true);
    const pending = m.children('PopUpModal')[0].props.onConfirm(); assert.equal(m.requests[0].method, 'DELETE'); assert.equal(m.requests[0].url, 'themes/7/reservations/81');
    if (fail) {
      m.requests[0].reject(Error('offline')); await pending; assert.deepEqual(m.alerts, ['예약 삭제에 실패했습니다.']); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    } else {
      m.requests[0].resolve('deleted'); await m.settle(); assert.deepEqual(m.alerts, []); assert.equal(m.atoms.scheduleModalState.isOpen, true);
      m.requests[1].resolve({ themeReservationList: {} }); await pending; assert.deepEqual(m.alerts, ['예약이 삭제되었습니다.']); assert.equal(m.atoms.scheduleModalState.isOpen, false);
    }
  }
});

test('4-24 month list retains sequential previous/current/next fetches, grouping, order, cache and modal entry', async () => {
  const m = mount(cards('ScheduleSection'), { values: { calendarMonthState: new Date(2026, 10, 1), reservationListState: { '2026-09': [reservation()] } } }); m.render();
  assert.match(m.text(), /예약된 테마가 없습니다/);
  const current = [reservation(), { ...reservation(), themeReservationId: 82 }, { ...reservation(), themeReservationId: 83, reservedAt: '2026.11.02 09:00' }];
  for (const [index, month, contents] of [[0, '10', []], [1, '11', current], [2, '12', []]]) {
    assert.equal(m.requests.length, index + 1); assert.deepEqual(plain(m.requests[index].config.params), { year: '2026', month });
    m.requests[index].resolve({ themeReservationList: { dates: contents } }); await m.settle();
  }
  assert.equal(m.atoms.reservationListState['2026-09'].length, 1); assert.deepEqual(m.children('ReservedCard').map(node => node.key), ['81', '82', '83']);
  assert.match(m.text(), /2026년 11월 1일/); assert.match(m.text(), /2026년 11월 2일/);
  m.click('일정 관리하기'); assert.equal(m.children('ScheduleModal').length, 1); assert.deepEqual(plain(m.atoms.scheduleModalState), { isOpen: true, mode: 'add', reservation: null });
  m.setAtom('calendarMonthState', new Date(2026, 11, 1)); assert.match(m.text(), /2026년 12월/); assert.match(m.text(), /예약된 테마가 없습니다/);
  assert.deepEqual(plain(m.requests[3].config.params), { year: '2026', month: '11' });
});

test('4-24 reservations page preserves responsive navigation, schedule reset and review theme mapping', () => {
  for (const isMobile of [false, true]) {
    const data = { ...reservation(), themeImg: null };
    const m = mount('src/pages/myPage/ReservationsPage.tsx', { isMobile, values: { reviewModalState: true, selectedThemeDataState: { data, img: null }, scheduleModalState: { isOpen: true, mode: 'edit', reservation: data } } }); m.render();
    assert.equal(m.children('CalendarSection').length, 1); assert.equal(m.children('ScheduleSection').length, 1);
    assert.deepEqual(plain(m.atoms.scheduleModalState), { isOpen: false, mode: 'add', reservation: null });
    assert.deepEqual(plain(m.children('ReviewWriteModal')[0].props.themeData), { ...data, img: null });
    const backs = m.nodes(n => n.props.onClick); assert.equal(backs.length, isMobile ? 0 : 1);
    if (!isMobile) { backs[0].props.onClick(); assert.equal(m.navigation[0][0], '/mypage'); }
    m.setAtom('selectedThemeDataState', null); assert.equal(m.children('ReviewWriteModal').length, 0); assert.equal(m.requests.length, 0);
  }
});

const changeSearch = (m, value) => {
  m.nodes(n => n.type === 'styled.input')[0].props.onChange({ target: { value } });
  m.render();
};
const enabledSubmit = m => m.nodes(n => n.props.$isEnabled === true && n.props.onClick)[0].props.onClick;
const closeSchedule = m => m.nodes(n => n.props.onClick && String(n.type).includes('closeicon.svg'))[0].props.onClick();
const replaceModal = (m, reservationData = null) => m.setAtom('scheduleModalState', {
  isOpen: true, mode: reservationData ? 'edit' : 'add', reservation: reservationData,
});
const cacheWrites = m => m.writes.filter(write => write.key === 'reservationListState');
const refreshPopup = m => m.children('PopUpModal').find(node => node.props.title === '예약 목록 갱신 실패').props;

test('async search A → B → A accepts only the latest request, including stale errors and same-query retries', async () => {
  for (const isMobile of [false, true]) {
    const m = mount(schedule('ScheduleItemSection'), { props: { isModal: true }, isMobile }); m.render();
    changeSearch(m, 'A'); changeSearch(m, 'B'); changeSearch(m, 'A');
    assert.deepEqual(m.requests.map(request => request.config.params.keyword), ['A', 'B', 'A']);
    m.requests[2].resolve({ contents: [theme(3)] }); await m.settle();
    m.requests[0].resolve({ contents: [theme(1)] }); m.requests[1].reject(Error('old B')); await m.settle();
    assert.match(m.text(), /테마3/); assert.doesNotMatch(m.text(), /테마1/);
    assert.equal(m.errors.some(args => args[0] === '검색 실패:'), false);
    const searchClick = m.nodes(n => n.props.onClick && String(n.type).includes('searchIcon.svg'))[0].props.onClick;
    const older = searchClick(), newer = searchClick();
    m.requests[4].resolve({ contents: [theme(5)] }); await newer; await m.settle();
    m.requests[3].resolve({ contents: [theme(4)] }); await older; await m.settle();
    assert.match(m.text(), /테마5/); assert.doesNotMatch(m.text(), /테마4/);
  }
});

test('async search clear, input-before-render, and unmount discard pending success/error writes', async () => {
  for (const finish of ['resolve', 'reject']) {
    const { m } = itemSection(); changeSearch(m, 'A');
    // A response can settle after input changes but before the next render.
    m.nodes(n => n.type === 'styled.input')[0].props.onChange({ target: { value: '' } });
    const before = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve({ contents: [theme(1)] }); else m.requests[0].reject(Error('old'));
    await flush(); assert.equal(m.stateWrites.length, before);
    m.render(); await m.settle(); assert.match(m.text(), /검색 결과가 표시됩니다/);
    changeSearch(m, 'B'); m.unmount(); const after = m.stateWrites.length;
    if (finish === 'resolve') m.requests[1].resolve({ contents: [theme(2)] }); else m.requests[1].reject(Error('old'));
    await m.settle(); assert.equal(m.stateWrites.length, after);
    assert.equal(m.errors.some(args => args[0] === '검색 실패:'), false);
  }
});

test('async month A → B → A cannot overwrite the latest shared cache or continue obsolete prefetches', async () => {
  const m = mount(cards('ScheduleSection'), { values: { calendarMonthState: new Date(2026, 10, 1), reservationListState: {} } }); m.render();
  m.setAtom('calendarMonthState', new Date(2026, 11, 1));
  m.setAtom('calendarMonthState', new Date(2026, 10, 1));
  m.requests[2].resolve({ themeReservationList: { dates: [reservation()] } }); await m.settle();
  const cache = m.atoms.reservationListState, count = cacheWrites(m).length;
  m.requests[0].resolve({ themeReservationList: { dates: [{ ...reservation(), themeReservationId: 999 }] } });
  m.requests[1].resolve({ themeReservationList: { dates: [] } }); await m.settle();
  assert.equal(m.atoms.reservationListState, cache); assert.equal(cacheWrites(m).length, count);
  assert.equal(m.atoms.reservationListState['2026-10'][0].themeReservationId, 81);
  assert.equal(m.requests.length, 4); // Only the current A load advances to its November request.
  m.requests[3].resolve({ themeReservationList: {} }); await m.settle();
  m.requests[4].resolve({ themeReservationList: {} }); await m.settle();
  assert.equal(m.requests.length, 5);
});

test('async unmounted month load cannot modify another consumer of the shared Recoil cache', async () => {
  for (const pendingIndex of [0, 1, 2]) {
    const sharedAtoms = { calendarMonthState: new Date(2026, 10, 1), reservationListState: { '2026-09': [{ ...reservation(), reservedAt: '2026.09.01 14:30' }] } };
    const m = mount(cards('ScheduleSection'), { sharedAtoms }); m.render();
    const calendar = mount(cards('CalendarSection'), { sharedAtoms }); calendar.render();
    for (let index = 0; index < pendingIndex; index++) {
      m.requests[index].resolve({ themeReservationList: {} }); await m.settle();
    }
    m.unmount();
    // A live consumer can publish fresh data after the old loader has unmounted.
    const fresh = { ...sharedAtoms.reservationListState, '2026-11': [reservation(), { ...reservation(), themeReservationId: 82 }] };
    calendar.setAtom('reservationListState', fresh); assert.match(calendar.text(), /2건/);
    const count = cacheWrites(m).length;
    m.requests[pendingIndex].resolve({ themeReservationList: { dates: [{ ...reservation(), themeReservationId: 999 }] } }); await m.settle();
    calendar.render(); assert.equal(sharedAtoms.reservationListState, fresh); assert.match(calendar.text(), /2건/);
    assert.equal(cacheWrites(m).length, count); assert.equal(m.requests.length, pendingIndex + 1);
  }
});

test('async month failures retain cache, stop the sequence and suppress obsolete UI error handling', async () => {
  for (const cleanup of ['none', 'month', 'unmount']) {
    const cache = { '2026-11': [reservation()] };
    const m = mount(cards('ScheduleSection'), { values: { calendarMonthState: new Date(2026, 10, 1), reservationListState: cache } }); m.render();
    if (cleanup === 'month') m.setAtom('calendarMonthState', new Date(2026, 11, 1));
    if (cleanup === 'unmount') m.unmount();
    m.requests[0].reject(Error('offline')); await m.settle();
    assert.equal(m.atoms.reservationListState, cache); assert.equal(cacheWrites(m).length, 0);
    assert.equal(m.errors.filter(args => args[0] === '예약 목록 조회 실패:').length, cleanup === 'none' ? 1 : 0);
    assert.equal(m.requests.length, cleanup === 'month' ? 2 : 1);
  }
});

test('async submit locks synchronously through mutation and refresh, then permits retry after failure', async () => {
  for (const mode of ['add', 'edit']) {
    const { m, select } = saveModal({ mode, reservationData: mode === 'edit' ? reservation() : null }); select({ reservedAt: null });
    const submit = enabledSubmit(m), first = submit();
    await submit(); await submit(); assert.equal(m.requests.length, 1);
    m.requests[0].reject(Error('offline')); await first; await m.settle();
    const retry = enabledSubmit(m)(); assert.equal(m.requests.length, 2);
    assert.deepEqual(plain(m.requests[1].body), plain(m.requests[0].body));
    m.requests[1].resolve(mode === 'edit' ? 'updated' : { reservationId: 82 }); await m.settle();
    await enabledSubmit(m)(); assert.equal(m.requests.length, 3); // GET is still pending, so submit stays locked.
    m.requests[2].resolve({ themeReservationList: { dates: [reservation()] } }); await retry; await m.settle();
    assert.equal(m.atoms.scheduleModalState.isOpen, false); assert.equal(cacheWrites(m).length, 1);
    assert.equal(m.alerts.length, 2); // One failed attempt, one normal success.
  }
});

test('async close invalidates old handlers before rendering, and re-entry ignores old success/error/finally', async () => {
  for (const finish of ['resolve', 'reject']) {
    const { m, select } = saveModal(); select();
    const submit = enabledSubmit(m), old = submit();
    closeSchedule(m); await submit(); assert.equal(m.requests.length, 1);
    m.render(); replaceModal(m); select();
    const current = enabledSubmit(m)(); assert.equal(m.requests.length, 2);
    if (finish === 'resolve') m.requests[0].resolve({ reservationId: 1 }); else m.requests[0].reject(Error('old'));
    await old; await m.settle();
    assert.equal(m.atoms.scheduleModalState.isOpen, true); assert.deepEqual(m.alerts, []); assert.equal(cacheWrites(m).length, 0);
    await enabledSubmit(m)(); assert.equal(m.requests.length, 2); // The old finally cannot unlock this request.
    m.requests[1].resolve({ reservationId: 2 }); await m.settle();
    m.requests[2].resolve({ themeReservationList: {} }); await current; await m.settle();
    assert.equal(m.atoms.scheduleModalState.isOpen, false); assert.deepEqual(m.alerts, ['예약이 추가되었습니다.']);
  }
});

test('async reservation A → B → A distinguishes modal generations even when IDs repeat', async () => {
  for (const finish of ['resolve', 'reject']) {
    const a = reservation(), b = { ...reservation(), themeId: 8, themeReservationId: 82 };
    const { m, select } = saveModal({ mode: 'edit', reservationData: a }); select();
    const old = enabledSubmit(m)(); replaceModal(m, b); select({ selectedThemeId: 8 });
    const middle = enabledSubmit(m)(); replaceModal(m, a); select();
    const current = enabledSubmit(m)(); assert.equal(m.requests.length, 3);
    m.requests[1].resolve('B');
    if (finish === 'resolve') m.requests[0].resolve('old A'); else m.requests[0].reject(Error('old A'));
    await Promise.all([old, middle]); await m.settle();
    assert.deepEqual(m.alerts, []); assert.equal(cacheWrites(m).length, 0); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    await enabledSubmit(m)(); assert.equal(m.requests.length, 3);
    m.requests[2].resolve('new A'); await m.settle();
    m.requests[3].resolve({ themeReservationList: {} }); await current;
    assert.equal(m.atoms.scheduleModalState.isOpen, false); assert.deepEqual(m.alerts, ['예약이 수정되었습니다.']);
  }
});

test('async selected theme A → B → A and entry theme prop changes invalidate previous saves', async () => {
  for (const change of ['selection', 'entry']) {
    const { m, select } = saveModal({ props: { themeId: 7 } }); select();
    const old = enabledSubmit(m)();
    if (change === 'selection') { select({ selectedThemeId: 8 }); select(); }
    else { m.update({ themeId: 8 }); m.update({ themeId: 7 }); select(); }
    const current = enabledSubmit(m)();
    m.requests[0].resolve({ reservationId: 1 }); await old; await m.settle();
    assert.equal(m.requests.length, 2); assert.deepEqual(m.alerts, []); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    await enabledSubmit(m)(); assert.equal(m.requests.length, 2);
    m.requests[1].resolve({ reservationId: 2 }); await m.settle(); m.requests[2].resolve({ themeReservationList: {} }); await current;
    assert.equal(m.atoms.scheduleModalState.isOpen, false);
  }
});

test('async old post-save refresh cannot write shared cache, close a new modal, or release its lock', async () => {
  for (const finish of ['resolve', 'reject']) {
    const { m, select } = saveModal(); select();
    const old = enabledSubmit(m)(); m.requests[0].resolve({ reservationId: 1 }); await m.settle();
    assert.deepEqual(m.alerts, ['예약이 추가되었습니다.']); assert.equal(m.requests.length, 2);
    closeSchedule(m); m.render(); replaceModal(m); select(); const current = enabledSubmit(m)();
    const fresh = { '2026-11': [reservation()] }; m.setAtom('reservationListState', fresh);
    const count = cacheWrites(m).length;
    if (finish === 'resolve') m.requests[1].resolve({ themeReservationList: {} }); else m.requests[1].reject(Error('old refresh'));
    await old; await m.settle();
    assert.equal(m.atoms.reservationListState, fresh); assert.equal(cacheWrites(m).length, count); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    assert.deepEqual(m.alerts, ['예약이 추가되었습니다.']); await enabledSubmit(m)(); assert.equal(m.requests.length, 3);
    m.requests[2].resolve({ reservationId: 2 }); await m.settle(); m.requests[3].resolve({ themeReservationList: {} }); await current;
    assert.equal(m.atoms.scheduleModalState.isOpen, false);
  }
});

test('async unmounted modal mutation/refresh never writes another instance shared state or displays stale alerts', async () => {
  for (const stage of ['mutation', 'refresh']) for (const finish of ['resolve', 'reject']) {
    const sharedAtoms = {
      calendarMonthState: new Date(2026, 10, 1), reservationListState: {},
      scheduleModalState: { isOpen: true, mode: 'add', reservation: null },
    };
    const m = mount(schedule('ScheduleModal'), { sharedAtoms }); m.render();
    m.children('ScheduleItemSection')[0].props.onStateChange({ selectedThemeId: 7, visitDate: null, reservedAt: '2026-11-02T14:35:00', isSubmitEnabled: true }); m.render();
    const old = enabledSubmit(m)();
    if (stage === 'refresh') { m.requests[0].resolve({ reservationId: 1 }); await m.settle(); }
    const alertsBefore = m.alerts.length;
    m.unmount();
    const next = mount(schedule('ScheduleModal'), { sharedAtoms });
    next.setAtom('scheduleModalState', { isOpen: true, mode: 'edit', reservation: { ...reservation(), themeReservationId: 99 } });
    const cache = sharedAtoms.reservationListState, context = sharedAtoms.scheduleModalState;
    const pending = m.requests.at(-1);
    if (finish === 'reject') pending.reject(Error('old')); else pending.resolve(stage === 'mutation' ? { reservationId: 1 } : { themeReservationList: { dates: [reservation()] } });
    await old; await m.settle();
    assert.equal(sharedAtoms.reservationListState, cache); assert.equal(sharedAtoms.scheduleModalState, context);
    assert.equal(cacheWrites(m).length, 0); assert.equal(m.alerts.length, alertsBefore);
    assert.equal(m.requests.length, stage === 'mutation' ? 1 : 2); assert.equal(m.stateWrites.some(write => write.unmounted), false);
  }
});

test('refresh failure keeps create/edit/delete successful and every retry sends only GET for the original month', async () => {
  for (const kind of ['add', 'edit', 'delete']) {
    const { m, select } = saveModal({ mode: kind === 'add' ? 'add' : 'edit', reservationData: kind === 'add' ? null : reservation() });
    select({ reservedAt: null });
    const start = kind === 'delete' ? m.children('PopUpModal')[0].props.onConfirm : enabledSubmit(m);
    const first = start(); m.requests[0].resolve(kind === 'add' ? { reservationId: 1 } : 'saved'); await m.settle();
    m.requests[1].reject(Error('refresh offline')); await first; await m.settle();
    const successAlerts = kind === 'delete' ? [] : [kind === 'add' ? '예약이 추가되었습니다.' : '예약이 수정되었습니다.'];
    assert.deepEqual(m.alerts, successAlerts); assert.equal(m.atoms.scheduleModalState.isOpen, true); assert.equal(cacheWrites(m).length, 0);
    assert.equal(refreshPopup(m).isOpen, true); assert.match(refreshPopup(m).message, /예약 처리는 완료/);
    m.setAtom('calendarMonthState', new Date(2026, 11, 1));
    const retry = refreshPopup(m).onConfirm(); await refreshPopup(m).onConfirm(); await start();
    assert.equal(m.requests.length, 3); assert.equal(m.requests[2].method, 'GET');
    assert.deepEqual(plain(m.requests[2].config.params), { year: '2026', month: '11' });
    m.requests[2].reject(Error('still offline')); await retry; await m.settle();
    assert.deepEqual(m.alerts, successAlerts); assert.equal(refreshPopup(m).isOpen, true);
    // Even an old save/delete handler must use the completed mutation's receipt.
    select({ selectedThemeId: 8 });
    const final = start(); assert.equal(m.requests[3].method, 'GET');
    m.requests[3].resolve({ themeReservationList: { dates: [reservation()] } }); await final; await m.settle();
    assert.equal(m.atoms.scheduleModalState.isOpen, false); assert.equal(m.atoms.reservationListState['2026-11'].length, 1);
    assert.deepEqual(m.requests.map(request => request.method), [kind === 'add' ? 'POST' : kind === 'edit' ? 'PATCH' : 'DELETE', 'GET', 'GET', 'GET']);
    assert.deepEqual(m.alerts, kind === 'delete' ? ['예약이 삭제되었습니다.'] : successAlerts);
  }
});

test('async modal deletion shares the synchronous save lock, supports retry and ignores obsolete completions', async () => {
  const { m, select } = saveModal({ mode: 'edit', reservationData: reservation() }); select();
  const confirm = m.children('PopUpModal')[0].props.onConfirm, failed = confirm();
  await confirm(); await enabledSubmit(m)(); assert.equal(m.requests.length, 1);
  m.requests[0].reject(Error('offline')); await failed; assert.deepEqual(m.alerts, ['예약 삭제에 실패했습니다.']);
  const old = confirm(); replaceModal(m, { ...reservation(), themeReservationId: 82 }); select();
  const current = enabledSubmit(m)(); m.requests[1].resolve('deleted'); await old; await m.settle();
  assert.equal(m.requests.length, 3); assert.equal(m.atoms.scheduleModalState.isOpen, true); assert.equal(cacheWrites(m).length, 0);
  await enabledSubmit(m)(); assert.equal(m.requests.length, 3);
  m.requests[2].resolve('updated'); await m.settle(); m.requests[3].resolve({ themeReservationList: {} }); await current;
  assert.equal(m.atoms.scheduleModalState.isOpen, false); assert.deepEqual(m.alerts, ['예약 삭제에 실패했습니다.', '예약이 수정되었습니다.']);
});

test('refresh separation preserves failed mutation inputs and permits normal create/edit/delete retries', async () => {
  for (const kind of ['add', 'edit', 'delete']) {
    const { m, select } = saveModal({ mode: kind === 'add' ? 'add' : 'edit', reservationData: kind === 'add' ? null : reservation() }); select();
    const start = kind === 'delete' ? m.children('PopUpModal')[0].props.onConfirm : enabledSubmit(m);
    const first = start(); await start(); assert.equal(m.requests.length, 1);
    const original = plain(m.requests[0].body ?? m.requests[0].config);
    m.requests[0].reject(Error('mutation failed')); await first; await m.settle();
    assert.equal(refreshPopup(m).isOpen, false); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    assert.equal(m.nodes(n => n.props.$isEnabled === true && n.props.onClick).length, 1);
    assert.deepEqual(m.alerts, [kind === 'add' ? '예약 추가에 실패했습니다.' : kind === 'edit' ? '예약 수정에 실패했습니다.' : '예약 삭제에 실패했습니다.']);
    const retry = start(); assert.equal(m.requests.length, 2); assert.equal(m.requests[1].method, m.requests[0].method);
    assert.deepEqual(plain(m.requests[1].body ?? m.requests[1].config), original);
    m.requests[1].resolve(kind === 'add' ? { reservationId: 1 } : 'saved'); await m.settle();
    assert.equal(m.requests[2].method, 'GET'); await start(); assert.equal(m.requests.length, 3);
    m.requests[2].resolve({ themeReservationList: {} }); await retry; await m.settle();
    assert.equal(m.atoms.scheduleModalState.isOpen, false); assert.equal(cacheWrites(m).length, 1);
    assert.equal(refreshPopup(m).isOpen, false); assert.equal(m.alerts.length, 2);
  }
});

test('refresh-only retry close/re-entry ignores old success/error/finally while the new save stays locked', async () => {
  for (const kind of ['add', 'edit', 'delete']) for (const finish of ['resolve', 'reject']) {
    const { m, select } = saveModal({ mode: kind === 'add' ? 'add' : 'edit', reservationData: kind === 'add' ? null : reservation() }); select();
    const first = kind === 'delete' ? m.children('PopUpModal')[0].props.onConfirm() : enabledSubmit(m)();
    m.requests[0].resolve(kind === 'add' ? { reservationId: 1 } : 'saved'); await m.settle();
    m.requests[1].reject(Error('refresh')); await first; await m.settle();
    const old = refreshPopup(m).onConfirm(), oldCancel = refreshPopup(m).onCancel;
    oldCancel(); m.render(); assert.equal(m.atoms.scheduleModalState.isOpen, false);
    replaceModal(m); select(); const current = enabledSubmit(m)();
    const alerts = [...m.alerts], cache = m.atoms.reservationListState;
    if (finish === 'resolve') m.requests[2].resolve({ themeReservationList: { dates: [reservation()] } }); else m.requests[2].reject(Error('old retry'));
    await old; await m.settle();
    oldCancel(); assert.equal(m.atoms.scheduleModalState.isOpen, true);
    assert.deepEqual(m.alerts, alerts); assert.equal(m.atoms.reservationListState, cache); assert.equal(refreshPopup(m).isOpen, false);
    await enabledSubmit(m)(); assert.equal(m.requests.length, 4);
    m.requests[3].resolve({ reservationId: 2 }); await m.settle(); m.requests[4].resolve({ themeReservationList: {} }); await current;
    assert.equal(m.atoms.scheduleModalState.isOpen, false);
  }
});

test('refresh-only retry handles reservation A → B → A and unmount without stale state or cache writes', async () => {
  for (const change of ['ABA', 'unmount']) for (const finish of ['resolve', 'reject']) {
    const { m, select } = saveModal({ mode: 'edit', reservationData: reservation() }); select();
    const first = enabledSubmit(m)(); m.requests[0].resolve('saved'); await m.settle();
    m.requests[1].reject(Error('refresh')); await first; await m.settle();
    const old = refreshPopup(m).onConfirm();
    let current;
    if (change === 'ABA') {
      replaceModal(m, { ...reservation(), themeId: 8, themeReservationId: 82 });
      replaceModal(m, reservation()); select(); current = enabledSubmit(m)();
    } else m.unmount();
    const writes = m.stateWrites.length, cache = m.atoms.reservationListState, alerts = [...m.alerts];
    if (finish === 'resolve') m.requests[2].resolve({ themeReservationList: { dates: [reservation()] } }); else m.requests[2].reject(Error('old retry'));
    await old; await m.settle();
    assert.equal(m.stateWrites.length, writes); assert.equal(m.atoms.reservationListState, cache); assert.deepEqual(m.alerts, alerts);
    if (current) {
      await enabledSubmit(m)(); assert.equal(m.requests.length, 4);
      m.requests[3].resolve('saved again'); await m.settle(); m.requests[4].resolve({ themeReservationList: {} }); await current;
      assert.equal(m.atoms.scheduleModalState.isOpen, false);
    }
  }
});

test('dropdown successful deletion retries only GET, preserves its original month and cannot resend DELETE', async () => {
  for (const isMobile of [false, true]) {
    const m = mount(cards('ReservationDropDown'), { isMobile, props: { reservation: reservation(), onReviewClick() {} }, values: { calendarMonthState: new Date(2026, 10, 1), reservationListState: { '2026-10': [reservation()] } } }); m.render();
    const confirm = m.children('PopUpModal')[0].props.onConfirm, first = confirm(); await confirm(); assert.equal(m.requests.length, 1);
    m.requests[0].resolve('deleted'); await m.settle(); m.requests[1].reject(Error('refresh')); await first; await m.settle();
    assert.deepEqual(m.alerts, []); assert.equal(refreshPopup(m).isOpen, true); assert.match(refreshPopup(m).message, /예약은 삭제/);
    m.setAtom('calendarMonthState', new Date(2026, 11, 1));
    const second = refreshPopup(m).onConfirm(); await refreshPopup(m).onConfirm(); await confirm(); assert.equal(m.requests.length, 3);
    assert.equal(m.requests[2].method, 'GET'); assert.deepEqual(plain(m.requests[2].config.params), { year: '2026', month: '11' });
    m.requests[2].reject(Error('still offline')); await second; await m.settle();
    assert.equal(refreshPopup(m).isOpen, true); refreshPopup(m).onCancel(); m.render();
    m.nodes(n => String(n.type).includes('more.svg') && n.props.onClick)[0].props.onClick({ stopPropagation() {} }); m.render();
    m.click('예약 내역 삭제', { stopPropagation() {} }); assert.equal(refreshPopup(m).isOpen, true);
    const retry = refreshPopup(m).onConfirm(); m.requests[3].resolve({ themeReservationList: {} }); await retry; await m.settle();
    assert.deepEqual(m.requests.map(request => request.method), ['DELETE', 'GET', 'GET', 'GET']); assert.deepEqual(m.alerts, ['예약이 삭제되었습니다.']);
    assert.deepEqual(plain(m.atoms.reservationListState['2026-11']), []); assert.equal(m.atoms.reservationListState['2026-10'].length, 1);
    assert.equal(refreshPopup(m).isOpen, false); assert.equal(m.children('PopUpModal')[0].props.isOpen, false);
  }
});

test('dropdown deletion failure leaves the confirmation retryable with unchanged DELETE parameters', async () => {
  const m = mount(cards('ReservationDropDown'), { props: { reservation: reservation(), onReviewClick() {} } }); m.render();
  const confirm = m.children('PopUpModal')[0].props.onConfirm, first = confirm();
  m.requests[0].reject(Error('delete offline')); await first; await m.settle();
  assert.equal(refreshPopup(m).isOpen, false); assert.deepEqual(m.alerts, ['예약 삭제에 실패했습니다.']);
  const retry = confirm(); assert.equal(m.requests[1].method, 'DELETE'); assert.equal(m.requests[1].url, m.requests[0].url);
  assert.deepEqual(plain(m.requests[1].config), plain(m.requests[0].config));
  m.requests[1].resolve('deleted'); await m.settle(); assert.equal(m.requests[2].method, 'GET');
  m.requests[2].resolve({ themeReservationList: {} }); await retry; await m.settle();
  assert.deepEqual(m.alerts, ['예약 삭제에 실패했습니다.', '예약이 삭제되었습니다.']); assert.equal(cacheWrites(m).length, 1);
});

test('dropdown refresh-only retry ignores A → B → A and unmount success/error without releasing new locks', async () => {
  for (const change of ['ABA', 'unmount']) for (const finish of ['resolve', 'reject']) {
    const m = mount(cards('ReservationDropDown'), { props: { reservation: reservation(), onReviewClick() {} } }); m.render();
    const first = m.children('PopUpModal')[0].props.onConfirm(); m.requests[0].resolve('deleted'); await m.settle();
    m.requests[1].reject(Error('refresh')); await first; await m.settle();
    const old = refreshPopup(m).onConfirm();
    let current;
    if (change === 'ABA') {
      m.update({ reservation: { ...reservation(), themeId: 8, themeReservationId: 82 } }); m.update({ reservation: reservation() });
      current = m.children('PopUpModal')[0].props.onConfirm();
    } else m.unmount();
    const writes = m.stateWrites.length, cache = m.atoms.reservationListState;
    if (finish === 'resolve') m.requests[2].resolve({ themeReservationList: { dates: [reservation()] } }); else m.requests[2].reject(Error('old refresh'));
    await old; await m.settle();
    assert.equal(m.stateWrites.length, writes); assert.equal(m.atoms.reservationListState, cache); assert.deepEqual(m.alerts, []);
    if (current) {
      await m.children('PopUpModal')[0].props.onConfirm(); assert.equal(m.requests.length, 4);
      m.requests[3].resolve('new deletion'); await m.settle(); m.requests[4].resolve({ themeReservationList: {} }); await current;
      assert.deepEqual(m.alerts, ['예약이 삭제되었습니다.']);
    }
  }
});

test('dropdown refresh dialog close/re-entry keeps deletion completed and isolates old GET finally', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(cards('ReservationDropDown'), { props: { reservation: reservation(), onReviewClick() {} } }); m.render();
    const first = m.children('PopUpModal')[0].props.onConfirm(); m.requests[0].resolve('deleted'); await m.settle();
    m.requests[1].reject(Error('refresh')); await first; await m.settle();
    const old = refreshPopup(m).onConfirm(); refreshPopup(m).onCancel(); m.render();
    m.nodes(n => String(n.type).includes('more.svg') && n.props.onClick)[0].props.onClick({ stopPropagation() {} }); m.render();
    m.click('예약 내역 삭제', { stopPropagation() {} });
    const current = refreshPopup(m).onConfirm(); assert.equal(m.requests.length, 4);
    if (finish === 'resolve') m.requests[2].resolve({ themeReservationList: { dates: [reservation()] } }); else m.requests[2].reject(Error('old refresh'));
    await old; await m.settle();
    assert.equal(refreshPopup(m).isOpen, true); assert.deepEqual(m.alerts, []); assert.equal(cacheWrites(m).length, 0);
    await refreshPopup(m).onConfirm(); assert.equal(m.requests.length, 4);
    m.requests[3].resolve({ themeReservationList: {} }); await current; await m.settle();
    assert.equal(refreshPopup(m).isOpen, false); assert.deepEqual(m.alerts, ['예약이 삭제되었습니다.']);
    assert.deepEqual(m.requests.map(request => request.method), ['DELETE', 'GET', 'GET', 'GET']);
  }
});
