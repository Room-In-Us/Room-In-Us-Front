const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));
const ui = name => `src/features/review/ui/${name}`;
const familyKey = id => `reviewStateFamily:${typeof id}:${JSON.stringify(id)}`;

// Load real option data, atom defaults, APIs and UI. Only React/DOM scheduling and
// the HTTP transport are simulated; no request can leave this test process.
function mount(relative, { props = {}, values = {}, sharedAtoms, isMobile = false, forwardedInput = false, forwardedRef = null } = {}) {
  const slots = [], effects = [], layoutEffects = [], writes = [], requests = [], timers = [], forwarded = [], navigation = [], stateWrites = [], errors = [];
  const cache = new Map(), defaults = new Map(), setters = new Map(), resetters = new Map();
  const atoms = sharedAtoms || { ...values };
  let cursor = 0, changed = false, tree, clock = 1000, unmounted = false;
  const listeners = { document: new Map(), window: new Map() };
  const events = target => ({
    addEventListener(name, fn) { if (!listeners[target].has(name)) listeners[target].set(name, new Set()); listeners[target].get(name).add(fn); },
    removeEventListener(name, fn) { listeners[target].get(name)?.delete(fn); },
  });
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
      return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; stateWrites.push({ afterUnmount: unmounted, value: slots[i] }); changed = true; }];
    },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
    useCallback(callback, deps) {
      const i = cursor++;
      if (!slots[i] || deps.some((value, j) => !Object.is(value, slots[i].deps[j]))) slots[i] = { callback, deps };
      return slots[i].callback;
    },
    useEffect: effectHook(effects),
    useLayoutEffect: effectHook(layoutEffects),
    forwardRef(render) { forwarded.push(render); return function Forwarded(props) { return render(props, null); }; },
  };
  const styled = new Proxy(target => () => `styled(${String(target)})`, { get: (_, name) => () => `styled.${String(name)}` });
  const jsx = (type, props, key) => ({ type, props: props || {}, key: key === undefined ? null : String(key) });
  const transport = (method, url, data) => new Promise((resolve, reject) => requests.push({ method, url, data, resolve: value => resolve({ data: value }), reject }));
  const api = { get: url => transport('GET', url), post: (url, data) => transport('POST', url, data), put: (url, data) => transport('PUT', url, data) };
  const clockDate = new Proxy(Date, { get: (target, key) => key === 'now' ? () => clock : Reflect.get(target, key) });
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const requireModule = id => {
      if (id === 'react') return { ...react, default: react, __esModule: true };
      if (id === 'axios') return require('axios');
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === 'date-fns' || id === 'date-fns/locale') return require(id);
      if (id === 'react-datepicker') return { __esModule: true, default: 'DatePicker' };
      if (id === 'react-router-dom') return { useNavigate: () => (...args) => navigation.push(args) };
      if (id === 'recoil') return {
        atom(config) { defaults.set(config.key, config.default); if (!Object.hasOwn(atoms, config.key)) atoms[config.key] = structuredClone(config.default); return config.key; },
        atomFamily(config) { return parameter => { const key = familyKey(parameter); defaults.set(key, config.default); if (!Object.hasOwn(atoms, key)) atoms[key] = structuredClone(config.default); return key; }; },
        useRecoilState: key => [atoms[key], setter(key)], useSetRecoilState: setter, useRecoilValue: key => atoms[key],
        useResetRecoilState: key => { if (!resetters.has(key)) resetters.set(key, () => setAtom(key, structuredClone(defaults.get(key)))); return resetters.get(key); },
      };
      if (id.endsWith('/hooks/useDevice')) return { __esModule: true, default: () => ({ isMobile }) };
      if (id.includes('app/API')) return { api };
      if (id.includes('/model/') || id.includes('/modal/reviewDataList') || id.includes('/api/')) return load(path.resolve(path.dirname(filename), id.replace(/\.(jsx|tsx)$/, '') + '.ts'));
      if (id.endsWith('/styles/ReviewStyles')) return Object.fromEntries(['Wrap1', 'Wrap2', 'Wrap3', 'Wrap5', 'Scroll', 'ImgSection', 'ThemeImg', 'ThemeTitle', 'ThemeSubText', 'Asterisk', 'GuideMsg', 'MsgWrapper', 'FinalWrapper'].map(name => [name, name]));
      return { __esModule: true, default: id.replace(/\.(jsx|tsx)$/, ''), ToggleCheckbox: 'ToggleCheckbox' };
    };
    const baseline = process.env.REVIEW_UI_BASELINE && [path.join(process.env.REVIEW_UI_BASELINE, path.relative(root, filename)), path.join(process.env.REVIEW_UI_BASELINE, path.relative(root, filename).replace(/\.tsx$/, '.jsx'))].find(file => fs.existsSync(file));
    const source = baseline && fs.existsSync(baseline) ? baseline : filename;
    const code = ts.transpileModule(fs.readFileSync(source, 'utf8'), { fileName: source, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: requireModule, Date: clockDate,
      document: events('document'), window: events('window'),
      setTimeout: (fn, delay) => { timers.push({ at: clock + delay, fn }); return timers.length; },
      console: { log() {}, error: (...args) => errors.push(args) },
    }, { filename: source });
    cache.set(filename, module.exports); return module.exports;
  }
  const exports = load(path.join(root, relative));
  const component = forwardedInput ? props => forwarded[0](props, forwardedRef) : exports.default || exports.ToggleCheckbox;
  const render = ({ deferPassive = false } = {}) => { cursor = 0; effects.length = 0; layoutEffects.length = 0; changed = false; tree = component(props); layoutEffects.splice(0).forEach(effect => effect()); if (!deferPassive) effects.splice(0).forEach(effect => effect()); return tree; };
  const nodes = predicate => {
    const found = [];
    const visit = node => { if (Array.isArray(node)) return node.forEach(visit); if (!node || typeof node !== 'object') return; if (predicate(node)) found.push(node); visit(node.props?.children); };
    visit(tree); return found;
  };
  const text = node => Array.isArray(node) ? node.map(text).join('') : node == null || typeof node === 'boolean' ? '' : typeof node === 'object' ? text(node.props?.children) : String(node);
  return {
    atoms, writes, requests, errors, render, nodes, text: () => text(tree), textOf: text, listeners, navigation, stateWrites,
    children: name => nodes(node => String(node.type).endsWith('/' + name) || node.type === name),
    update(next, options) { Object.assign(props, next); return render(options); },
    flushEffects() { effects.splice(0).forEach(effect => effect()); },
    setDraft(id, change) { setAtom(familyKey(id), value => ({ ...value, ...change })); return render(); },
    dispatch(target, name, event) { listeners[target].get(name)?.forEach(fn => fn(event)); return render(); },
    tick(ms) { clock += ms; for (const timer of timers.splice(0)) { if (timer.at <= clock) timer.fn(); else timers.push(timer); } return render(); },
    async settle() { for (let i = 0; i < 15; i++) { await flush(); if (unmounted || !changed) return; render(); } throw Error('UI did not settle'); },
    unmount() { unmounted = true; slots.forEach(slot => slot?.cleanup?.()); },
    remount() { slots.length = 0; unmounted = false; return render(); },
    strictReplay() { slots.forEach(slot => slot?.cleanup?.()); for (const layout of [true, false]) for (const slot of slots) if (typeof slot?.effect === 'function' && slot.isLayout === layout) slot.cleanup = slot.effect(); },
  };
}

test('4-18 dropdown retains null/boolean/string option values, keys, callback order and outside-click cleanup', () => {
  for (const value of [null, true, false, 'JUNIOR']) {
    let received, wasOpen;
    const options = [{ value: null, label: '미선택' }, { value: true, label: '성공' }, { value: false, label: '실패' }, { value: 'JUNIOR', label: '방초보' }];
    const m = mount(ui('ReviewDropdown.tsx'), { props: { placeholder: '선택', options, selected: '', onSelect: next => { received = next; wasOpen = m.nodes(n => n.key === String(value)).length; } } });
    m.render(); m.nodes(n => typeof n.props.onClick === 'function')[0].props.onClick(); m.render();
    assert.equal(m.listeners.document.get('mousedown').size, 1);
    m.nodes(n => n.key === String(value))[0].props.onClick(); m.render();
    assert.equal(received, value); assert.equal(wasOpen, 1); assert.equal(m.listeners.document.get('mousedown').size, 0);
    m.nodes(n => typeof n.props.onClick === 'function')[0].props.onClick(); m.render();
    const wrapper = m.nodes(n => n.props.ref)[0]; wrapper.props.ref.current = { contains: node => node === 'inside' };
    m.dispatch('document', 'mousedown', { target: 'inside' }); assert.equal(m.listeners.document.get('mousedown').size, 1);
    m.dispatch('document', 'mousedown', { target: null }); assert.equal(m.listeners.document.get('mousedown').size, 0);
    m.unmount();
  }
});

test('4-18 stars preserve null/zero, half-step icons, hover feedback and the optional callback', () => {
  const values = [];
  const m = mount(ui('StarRating.tsx'), { props: { value: null, onChange: value => values.push(value) } }); m.render();
  assert.equal(m.nodes(n => n.type === 'styled.img').every(n => String(n.props.src).endsWith('starEmpty.svg')), true);
  assert.equal(m.text(), '\u00a0');
  const halves = () => m.nodes(n => typeof n.props.onMouseEnter === 'function');
  for (let i = 0; i < 10; i++) halves()[i].props.onClick();
  assert.deepEqual(values, [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]);
  halves()[2].props.onMouseEnter(); m.render(); assert.equal(m.text(), '재미없어요');
  m.update({ value: 0, feedbackTexts: [] });
  m.nodes(n => typeof n.props.onMouseLeave === 'function')[0].props.onMouseLeave(); m.render(); assert.equal(m.text(), '\u00a0');
  m.update({ value: 1.5, feedbackTexts: ['a', 'b', 'c'] }); assert.equal(m.text(), 'c');
  assert.equal(m.nodes(n => n.type === 'styled.img').filter(n => String(n.props.src).endsWith('starhalf.svg')).length, 1);
  const optional = mount(ui('StarRating.tsx')); optional.render(); optional.nodes(n => typeof n.props.onClick === 'function')[0].props.onClick();
});

test('4-18 escape time retains numeric parsing, empty-to-zero, digit filtering and 59 cap', () => {
  for (const [input, expected] of [['', 0], ['abc', 0], ['-12x', 12], ['99', 59], ['0', 0], ['08', 8]]) {
    let next;
    const m = mount(ui('EscapeTimePicker.tsx'), { props: { value: { min: 3, sec: 4 }, onChange: value => { next = value; } } }); m.render();
    const inputs = m.nodes(n => n.type === 'styled.input');
    inputs[0].props.onChange({ target: { value: input } }); assert.deepEqual(plain(next), { min: expected, sec: 4 });
    inputs[1].props.onChange({ target: { value: input } }); assert.deepEqual(plain(next), { min: 3, sec: expected });
  }
});

test('4-18 hint counter retains zero floor, optional initial zero and disabled no-op', () => {
  for (const disabled of [false, true]) {
    const values = [], m = mount(ui('HintCounter.tsx'), { props: { disabled, onChange: value => values.push(value) } }); m.render();
    m.nodes(n => n.props.alt === 'minus')[0].props.onClick(); m.nodes(n => n.props.alt === 'plus')[0].props.onClick();
    assert.deepEqual(values, disabled ? [] : [0, 1]);
  }
});

test('4-18 range selection retains empty, singleton, ordered bounds, reset and 6+ label', () => {
  let next;
  const m = mount(ui('FlexibleRangeSelector.tsx'), { props: { onChange: value => { next = value; } } }); m.render();
  const choose = number => { m.nodes(n => n.key === String(number) && typeof n.props.onClick === 'function')[0].props.onClick(); m.update({ value: next }); };
  choose(4); assert.deepEqual(plain(next), [4]); choose(4); assert.deepEqual(plain(next), []);
  choose(5); choose(2); assert.deepEqual(plain(next), [2, 5]);
  assert.equal(m.nodes(n => n.key && n.props.$inRange).length, 4);
  choose(6); assert.deepEqual(plain(next), [6]); assert.equal(m.text().includes('6+'), true);
});

test('4-18 date picker preserves Date/string/dayjs-like parsing, fallback and undefined family isolation', () => {
  const date = new Date(2026, 10, 1);
  const dayjs = require('dayjs');
  for (const value of [date, '2026-11-01', '2026.11.01', dayjs(date)]) {
    const m = mount(ui('VisitDatePicker.tsx'), { props: { value } }); m.render();
    const picker = m.nodes(n => n.type === 'styled(DatePicker)')[0];
    assert.equal(picker.props.selected.getFullYear(), 2026); assert.equal(picker.props.selected.getMonth(), 10); assert.equal(picker.props.selected.getDate(), 1);
  }
  const m = mount(ui('VisitDatePicker.tsx'), { props: { value: '', onChange: value => { assert.equal(value, date); } } }); m.render();
  const initial = m.atoms[familyKey(undefined)]; m.nodes(n => n.type === 'styled(DatePicker)')[0].props.onChange(date); m.render();
  assert.equal(m.atoms[familyKey(undefined)], initial);
  m.update({ themeId: '7' }); m.nodes(n => n.type === 'styled(DatePicker)')[0].props.onChange(date); m.render();
  assert.equal(m.atoms[familyKey('7')].playedAt, '2026-11-01'); assert.equal(m.atoms[familyKey(undefined)].playedAt, null);
  m.tick(200); assert.equal(m.nodes(n => n.type === 'styled(DatePicker)')[0].props.open, false);
  const invalid = mount(ui('VisitDatePicker.tsx'), { props: { value: 'not-a-date' } }); invalid.render(); assert.equal(invalid.nodes(n => n.type === 'styled(DatePicker)')[0].props.selected, null);
});

test('4-18 custom date button keeps ref, preventDefault, 250ms duplicate guard and disabled behavior', () => {
  let count = 0, prevented = 0;
  const ref = { current: null };
  const m = mount(ui('VisitDatePicker.tsx'), { forwardedInput: true, forwardedRef: ref, props: { value: '', onToggle: () => count++ } });
  const button = m.render(); assert.equal(button.props.ref, ref); assert.equal(m.text(), '날짜 선택');
  const event = { preventDefault() { prevented++; } };
  button.props.onPointerDown(event); button.props.onMouseDown(event); button.props.onTouchStart(event); assert.equal(count, 1); assert.equal(prevented, 3);
  m.tick(249); m.render().props.onPointerDown(event); assert.equal(count, 1);
  m.tick(1); m.render().props.onPointerDown(event); assert.equal(count, 2);
  m.update({ disabled: true }); m.render().props.onPointerDown(event); assert.equal(count, 2);
});

test('4-18 named checkbox export retains callback event, optional icon and selected image', () => {
  const event = { type: 'click' }; let received;
  const m = mount(ui('ToggleCheckBox.tsx'), { props: { label: '기재 안 함', checked: true, onToggle: value => { received = value; } } });
  m.render().props.onClick(event); assert.equal(received, event);
  assert.equal(m.nodes(n => n.type === 'styled.img').length, 1);
  m.update({ checked: false, special: true, icon: 'icon.svg' }); assert.equal(m.nodes(n => n.type === 'styled.img').length, 2);
});

function slider(disabled = false) {
  const changes = [];
  const m = mount(ui('RangeItem.tsx'), { props: { value: 50, disabled, onChange: value => changes.push(value) } });
  m.render();
  const track = () => m.nodes(n => n.props.ref)[0];
  track().props.ref.current = { getBoundingClientRect: () => ({ left: 100, width: 200 }) };
  return { m, changes, track };
}

test('4-18 mouse slider preserves margin, clamping, rounding and stop/cleanup behavior', () => {
  const { m, changes, track } = slider();
  m.dispatch('window', 'mousemove', { clientX: 200 }); assert.deepEqual(changes, []);
  track().props.onMouseDown({ clientX: 100 });
  m.dispatch('window', 'mousemove', { clientX: 200 });
  m.dispatch('window', 'mousemove', { clientX: 400 });
  m.dispatch('window', 'mouseup', { clientX: 100 });
  m.dispatch('window', 'mousemove', { clientX: 100 });
  assert.deepEqual(changes, [10, 50, 90]);
  m.unmount(); assert.equal([...m.listeners.window.values()].every(set => set.size === 0), true);
  const disabled = slider(true); disabled.track().props.onMouseDown({ clientX: 200 });
  disabled.m.dispatch('window', 'mousemove', { clientX: 200 }); assert.deepEqual(disabled.changes, []);
});

test('4-18 touch slider uses active/changed touches, stops on end/cancel and never emits NaN', { skip: !!process.env.REVIEW_UI_BASELINE }, () => {
  const { m, changes, track } = slider();
  track().props.onTouchStart({ touches: [] });
  m.dispatch('window', 'touchmove', { touches: [{ clientX: 200 }] }); assert.deepEqual(changes, []);
  track().props.onTouchStart({ touches: [{ clientX: 100 }] });
  m.dispatch('window', 'touchmove', { touches: [{ clientX: 200 }] });
  m.dispatch('window', 'touchmove', { touches: [] });
  m.dispatch('window', 'touchend', { touches: [], changedTouches: [{ clientX: 300 }] });
  m.dispatch('window', 'touchmove', { touches: [{ clientX: 100 }] });
  assert.deepEqual(changes, [10, 50, 90]); assert.equal(changes.every(Number.isFinite), true);
  track().props.onTouchStart({ touches: [{ clientX: 200 }] });
  m.dispatch('window', 'touchcancel', { changedTouches: [{ clientX: 100 }] });
  m.dispatch('window', 'touchmove', { touches: [{ clientX: 100 }] }); assert.deepEqual(changes, [10, 50, 90, 50]);
  m.unmount(); assert.equal([...m.listeners.window.values()].every(set => set.size === 0), true);
  const disabled = slider(true); disabled.track().props.onTouchStart({ touches: [{ clientX: 200 }] });
  disabled.m.dispatch('window', 'touchend', { changedTouches: [{ clientX: 300 }] }); assert.deepEqual(disabled.changes, []);
});

test('4-19 escape result preserves time/null toggles, failure reason, ending independence and hidden state', () => {
  const m = mount(ui('EscapeResultDetails.tsx'), { props: { themeId: 7, selected: true } }); m.render();
  const draft = () => m.atoms[familyKey(7)];
  m.children('EscapeTimePicker')[0].props.onChange({ min: 2, sec: 9 }); m.render(); assert.equal(draft().remainingTime, '00:02:09');
  m.children('ToggleCheckbox')[0].props.onToggle(); m.render(); assert.equal(draft().remainingTime, null);
  assert.equal(m.children('EscapeTimePicker')[0].props.disabled, true);
  m.children('ToggleCheckbox')[0].props.onToggle(); m.render(); assert.equal(draft().remainingTime, '00:00:00');
  m.update({ selected: false }); m.children('ReviewDropdown')[0].props.onSelect('TIME'); m.render();
  m.children('ToggleCheckbox')[0].props.onToggle(); m.render(); assert.equal(draft().failReason, 'TIME'); assert.equal(draft().hasViewedEnding, true);
  m.children('ReviewDropdown')[0].props.onSelect(null); m.render(); assert.equal(draft().hasViewedEnding, true);
  m.update({ selected: null }); assert.equal(m.render(), null);
});

test('4-19 input box forwards events/ratings and preserves clothing nullable selection and feedback', () => {
  let cloth, changed, rating;
  const props = { label: '활동성', placeholder: '선택', value: '', rateValue: null, rateOnChange: value => { rating = value; }, onChange: event => { changed = event; }, active: true, selected: null, handleSelect: value => { cloth = value; } };
  const m = mount(ui('InputBox.tsx'), { props }); m.render();
  const event = { target: { value: 'a' } }; m.nodes(n => n.type === 'styled.textarea')[0].props.onChange(event); assert.equal(changed, event);
  const stars = m.children('StarRating')[0]; assert.equal(stars.props.value, null); assert.equal(stars.props.feedbackTexts.length, 10);
  stars.props.onChange(4.5); assert.equal(rating, 4.5);
  for (const value of ['PANTS', 'LONG_SKIRT', 'SHORT_SKIRT', null]) {
    m.nodes(n => n.key === String(value))[0].props.onClick(); assert.equal(cloth, value);
  }
  m.update({ active: false }); assert.equal(m.nodes(n => n.key !== null).length, 0);
});

test('4-19 first section preserves nullable rating, evaluation, 500 limit, image fallback and theme family', () => {
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewFirst.tsx'), { isMobile, props: { themeData: { themeId: 7, themeImg: 'reservation.png' } } }); m.render();
    assert.equal(m.children('StarRating')[0].props.value, null);
    assert.equal(m.nodes(n => n.type === 'ThemeImg')[0].props.src, isMobile ? '' : 'reservation.png');
    const input = () => m.nodes(n => n.type === 'styled.textarea')[0];
    input().props.onChange({ target: { value: 'a'.repeat(500) } }); m.render();
    input().props.onChange({ target: { value: 'b'.repeat(501) } }); m.render();
    assert.equal(m.atoms[familyKey(7)].reviewComment, 'a'.repeat(500));
    m.children('StarRating')[0].props.onChange(0.5); m.children('ReviewDropdown')[0].props.onSelect('FLOWER'); m.render();
    assert.equal(m.atoms[familyKey(7)].satisfactionLevel, 0.5); assert.equal(m.atoms[familyKey(7)].review, 'FLOWER');
    m.update({ themeData: {} }); assert.equal(m.atoms[familyKey(undefined)].reviewComment, '');
  }
});

test('4-19 third section preserves five scores/comments, 200 limit, clothing and existing zero-to-null ratio', () => {
  const fields = ['level', 'horrorLevel', 'activityLevel', 'storyLevel', 'interiorLevel'];
  const comments = ['levelComment', 'horrorComment', 'activityComment', 'storyComment', 'interiorComment'];
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewThird.tsx'), { isMobile, props: { themeData: { themeId: 7 } } }); m.render();
    assert.equal(m.children('InputBox').length, 5);
    for (let i = 0; i < 5; i++) {
      assert.equal(m.children('InputBox')[i].props.rateValue, null);
      m.children('InputBox')[i].props.rateOnChange(i + 0.5);
      m.children('InputBox')[i].props.onChange({ target: { value: 'a'.repeat(200) } }); m.render();
      m.children('InputBox')[i].props.onChange({ target: { value: 'b'.repeat(201) } }); m.render();
      assert.equal(m.atoms[familyKey(7)][fields[i]], i + 0.5); assert.equal(m.atoms[familyKey(7)][comments[i]], 'a'.repeat(200));
    }
    m.children('InputBox')[2].props.handleSelect('PANTS'); m.render(); assert.equal(m.atoms[familyKey(7)].recommendedCloth, 'PANTS');
    m.children('InputBox')[2].props.handleSelect(null); m.children('RangeItem')[0].props.onChange(0); m.render();
    assert.equal(m.atoms[familyKey(7)].recommendedCloth, null); assert.equal(m.atoms[familyKey(7)].lockRatio, null);
    m.children('RangeItem')[0].props.onChange(60); m.render(); assert.equal(m.atoms[familyKey(7)].lockRatio, 6);
  }
});

test('4-19 participant callbacks preserve raw proficiency, note, owner/delete behavior', () => {
  let skill, note, removed = 0;
  const m = mount(ui('PlayerBoxSection.tsx'), { props: { skill: '', note: '메모', isOwner: true, onSkillChange: value => { skill = value; }, onNoteChange: value => { note = value; }, onRemove: () => removed++ } }); m.render();
  assert.equal(m.children('ReviewDropdown')[0].props.selected, '');
  m.children('ReviewDropdown')[0].props.onSelect(null); assert.equal(skill, null);
  m.children('ReviewDropdown')[0].props.onSelect('MASTER'); assert.equal(skill, 'MASTER');
  m.nodes(n => n.type === 'styled.input')[0].props.onChange({ target: { value: '새 메모' } }); assert.equal(note, '새 메모');
  assert.equal(m.nodes(n => n.props.src && typeof n.props.onClick === 'function').length, 0);
  m.update({ isOwner: false }); m.nodes(n => n.props.src && typeof n.props.onClick === 'function')[0].props.onClick(); assert.equal(removed, 1);
});

test('4-19 nullable participant note changes only input display; source and writes stay untouched', { skip: !!process.env.REVIEW_UI_BASELINE }, () => {
  for (const note of [null, undefined, '', ' ', '메모']) {
    const participant = { proficiency: null, remark: note }; let changed;
    const m = mount(ui('PlayerBoxSection.tsx'), { props: { skill: participant.proficiency, note: participant.remark, isOwner: true, onSkillChange() {}, onNoteChange: value => { changed = value; }, onRemove() {} } }); m.render();
    assert.equal(m.nodes(n => n.type === 'styled.input')[0].props.value, note ?? '');
    assert.equal(participant.remark, note); assert.equal(changed, undefined); assert.deepEqual(m.writes, []);
  }
});

test('4-19 last section preserves add/edit wording, responsive image and empty theme fallback', () => {
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewLast.tsx'), { isMobile, props: { themeData: { themeImg: 'reservation.png' } } }); m.render();
    const normal = m.text(); m.update({ isEditMode: true }); assert.notEqual(m.text(), normal);
    assert.equal(m.nodes(n => n.type === 'ThemeImg')[0].props.src, 'reservation.png');
    m.update({ themeData: {} }); assert.equal(m.nodes(n => n.type === 'ThemeImg')[0].props.src, '');
  }
});

test('4-20 participants retain nullable restored fields, added empty strings and owner deletion guard', () => {
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewSecond.tsx'), { isMobile, props: { themeData: { themeId: 7 } } }); m.render();
    const draft = () => m.atoms[familyKey(7)];
    m.setDraft(7, { participantList: [{ proficiency: null, remark: null, isOwner: true }, {}] });
    assert.equal(m.children('PlayerBoxSection')[0].props.note, null); assert.equal(m.children('PlayerBoxSection')[1].props.note, undefined);
    m.children('PlayerBoxSection')[0].props.onRemove(); m.render(); assert.equal(draft().participantList.length, 2);
    m.children('PlayerBoxSection')[0].props.onSkillChange('JUNIOR'); m.render();
    m.children('PlayerBoxSection')[1].props.onNoteChange('메모'); m.render();
    assert.equal(draft().participantList[0].proficiency, 'JUNIOR'); assert.equal(draft().participantList[0].remark, null); assert.equal(draft().participantList[1].remark, '메모');
    m.nodes(n => typeof n.props.onClick === 'function' && m.textOf(n) === '인원 추가')[0].props.onClick(); m.render();
    assert.deepEqual(plain(draft().participantList[2]), { proficiency: '', remark: '' });
    m.children('PlayerBoxSection')[1].props.onRemove(); m.render(); assert.equal(draft().participantList.length, 2);
    assert.equal(m.children('PlayerBoxSection')[0].props.isOwner, true); assert.equal(m.children('PlayerBoxSection')[1].props.isOwner, false);
  }
});

test('4-20 date/hint/headcount opt-outs preserve uiState and null/reset behavior in both layouts', () => {
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewSecond.tsx'), { isMobile, props: { themeData: { themeId: 7 } } }); m.render();
    const draft = () => m.atoms[familyKey(7)];
    const checks = () => m.children('ToggleCheckbox').filter(n => !n.props.special);
    m.children('VisitDatePicker')[0].props.onChange(new Date(2026, 10, 1)); m.render(); assert.equal(draft().playedAt, '2026-11-01');
    m.children('HintCounter')[0].props.onChange(3); m.render(); assert.equal(draft().usedHint, 3);
    for (const [range, expected] of [[[], [null, null]], [[4], [4, 4]], [[2, 6], [2, 6]]]) {
      m.children('FlexibleRangeSelector')[0].props.onChange(range); m.render(); assert.deepEqual([draft().minRecommendedHeadcount, draft().maxRecommendedHeadcount], expected);
    }
    for (let i = 0; i < 3; i++) { checks()[i].props.onToggle(); m.render(); }
    assert.deepEqual(plain(draft().uiState), { checkedDate: true, checkedHint: true, checkedPeople: true });
    assert.equal(draft().playedAt, null); assert.equal(draft().usedHint, null); assert.equal(draft().minRecommendedHeadcount, null); assert.equal(draft().maxRecommendedHeadcount, null);
    assert.equal(m.children('VisitDatePicker')[0].props.disabled, true); assert.equal(m.children('HintCounter')[0].props.disabled, true);
    for (let i = 0; i < 3; i++) { checks()[i].props.onToggle(); m.render(); }
    assert.equal(draft().playedAt, null); assert.equal(draft().usedHint, null); assert.equal(draft().minRecommendedHeadcount, null);
    assert.deepEqual(plain(draft().uiState), { checkedDate: false, checkedHint: false, checkedPeople: false });
  }
});

test('4-20 escape boolean/null and issue selection retain raw values, order and final-null list', () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
  for (const value of [false, null, true]) {
    m.nodes(n => n.key === String(value))[0].props.onClick(); m.render(); assert.equal(m.atoms[familyKey(7)].isEscaped, value);
    assert.equal(m.children('EscapeResultDetails')[0].props.selected, value);
  }
  const toggle = key => { m.children('ToggleCheckbox').find(n => n.key === key).props.onToggle(); m.render(); };
  toggle('AGING'); toggle('DEVICE_ERROR'); assert.deepEqual(plain(m.atoms[familyKey(7)].reviewTagList), ['AGING', 'DEVICE_ERROR']);
  toggle('AGING'); toggle('DEVICE_ERROR'); assert.equal(m.atoms[familyKey(7)].reviewTagList, null);
});

test('4-20 proficiency autofill skips missing/null/error, preserves existing selection and runs once', async () => {
  for (const response of [{}, { proficiency: null }, { proficiency: 'MASTER' }, new Error('offline')]) {
    const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
    assert.equal(m.requests.length, 1); assert.equal(m.requests[0].url, 'members/preferences');
    if (response instanceof Error) m.requests[0].reject(response); else m.requests[0].resolve(response);
    await m.settle(); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, response.proficiency ?? null);
    m.render(); assert.equal(m.requests.length, 1); assert.equal(m.requests.every(r => r.method === 'GET'), true);
    m.unmount();
  }
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
  m.children('PlayerBoxSection')[0].props.onSkillChange('BEGINNER'); m.render();
  m.requests[0].resolve({ proficiency: 'MASTER' }); await m.settle(); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, 'BEGINNER');
});

test('4-20 removed props were ignored by the children; working date/result contracts remain', { skip: !!process.env.REVIEW_UI_BASELINE }, () => {
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewSecond.tsx'), { isMobile, props: { themeData: { themeId: 7 } } }); m.render();
    const date = m.children('VisitDatePicker')[0].props, result = m.children('EscapeResultDetails')[0].props;
    assert.equal(Object.hasOwn(date, 'selectedDate'), false); assert.equal(typeof date.onChange, 'function'); assert.equal(date.themeId, 7);
    assert.equal(Object.hasOwn(result, 'disabled'), false); assert.equal(Object.hasOwn(result, 'onUpdate'), false);
    assert.equal(result.themeId, 7); assert.equal(result.selected, true);
  }
});

test('review modal existing navigation retains draft, validates players, closes and resets only new sessions', async () => {
  const m = mount(ui('ReviewWriteModal.tsx'), { props: { themeData: { themeId: 7 }, isEditMode: false }, values: { reviewModalState: true } }); m.render(); await m.settle();
  const click = label => { m.nodes(n => typeof n.props.onClick === 'function' && m.textOf(n) === label)[0].props.onClick(); m.render(); };
  m.setDraft(7, { reviewComment: '보존', participantList: [{ proficiency: 'BEGINNER', remark: null }] });
  click('다음'); assert.equal(m.atoms.reviewSectionState, 'second');
  click('다음'); assert.equal(m.atoms.reviewSectionState, 'third');
  click('이전'); assert.equal(m.atoms.reviewSectionState, 'second'); assert.equal(m.atoms[familyKey(7)].reviewComment, '보존'); assert.equal(m.atoms[familyKey(7)].participantList[0].remark, null);
  m.setDraft(7, { participantList: [{ proficiency: '' }] }); click('다음'); assert.equal(m.atoms.reviewSectionState, 'second');
  assert.equal(m.children('PopUpModal')[0].props.isOpen, true);
  m.nodes(n => n.type === 'styled.img' && typeof n.props.onClick === 'function')[0].props.onClick(); m.render(); assert.equal(m.atoms.reviewModalState, false);
  m.atoms.reviewModalState = true; m.render(); await m.settle(); assert.equal(m.atoms[familyKey(7)].reviewComment, ''); assert.equal(m.atoms.reviewSectionState, 'first');
  m.setDraft(7, { reviewComment: '수정 복원', participantList: [{ proficiency: null, remark: null }] });
  m.update({ isEditMode: true }); await m.settle(); assert.equal(m.atoms[familyKey(7)].reviewComment, '수정 복원');
  assert.equal(m.requests.length, 0);
});

const validReview = () => ({
  satisfactionLevel: 4.5, review: 'FLOWER', reviewComment: '체험 기록',
  participantList: [{ proficiency: 'JUNIOR', remark: '', isOwner: true }],
  level: 3, horrorLevel: 2, activityLevel: 2.5, storyLevel: 4, interiorLevel: 4.5,
});

async function reviewModal(props = {}, options = {}) {
  const m = mount(ui('ReviewWriteModal.tsx'), {
    ...options, props: { themeData: { themeId: 7, themeName: '테마', storeInfo: { storeName: '매장' }, img: 'theme.png' }, ...props },
    values: { reviewModalState: true },
  });
  m.render(); await m.settle(); m.setDraft(7, validReview());
  m.atoms.reviewSectionState = 'third'; m.render();
  return m;
}

function submitReview(m) {
  return m.nodes(n => typeof n.props.onClick === 'function' && /후기 (작성|수정) 완료/.test(m.textOf(n)))[0].props.onClick();
}

function clickReview(m, text) {
  m.nodes(n => typeof n.props.onClick === 'function' && m.textOf(n) === text)[0].props.onClick(); m.render();
}

test('4-21 normal POST preserves payload values, callback/reset order, completion and share navigation', async () => {
  let callbacks = 0, commentAtCallback;
  const m = await reviewModal({ onUpdated: () => { callbacks++; commentAtCallback = m.atoms[familyKey(7)].reviewComment; } });
  const pending = submitReview(m);
  assert.equal(m.requests.length, 1); const request = m.requests[0]; assert.equal(request.method, 'POST'); assert.equal(request.url, 'themes/7/reviews');
  assert.equal(Object.hasOwn(request.data, 'uiState'), false);
  assert.deepEqual(plain(request.data.participantList), validReview().participantList);
  assert.equal(request.data.playedAt, null); assert.equal(request.data.usedHint, null); assert.equal(request.data.lockRatio, 5);
  request.resolve({ reviewId: 81 }); await pending; await m.settle();
  assert.equal(callbacks, 1); assert.equal(commentAtCallback, '체험 기록'); assert.equal(m.atoms[familyKey(7)].reviewComment, '');
  assert.equal(m.atoms.reviewSectionState, 'last'); assert.equal(m.atoms.reviewModalState, true);
  clickReview(m, '공유하기'); assert.equal(m.atoms.reviewModalState, false); assert.equal(m.navigation[0][0], '/review/share');
  const shared = m.navigation[0][1].state.reviewData;
  assert.equal(shared.reviewId, 81); assert.equal(shared.reviewComment, '체험 기록'); assert.equal(shared.storeName, '매장'); assert.equal(shared.thumbnailUrl, 'theme.png'); assert.equal(shared.participantCnt, 1);
});

test('4-21 normal PUT accepts string success and shares the existing review ID', async () => {
  const m = await reviewModal({ isEditMode: true, reviewId: 81 });
  const pending = submitReview(m); assert.equal(m.requests[0].method, 'PUT'); assert.equal(m.requests[0].url, 'themes/7/reviews/81');
  m.requests[0].resolve('수정되었습니다.'); await pending; await m.settle();
  assert.equal(m.atoms.reviewSectionState, 'last'); clickReview(m, '공유하기');
  assert.equal(m.navigation[0][1].state.reviewData.reviewId, 81);
  assert.equal(m.navigation[0][1].state.backButtonText, '후기 수정으로 돌아가기');
});

test('4-21 POST failure preserves draft and parses existing field messages; PUT failure preserves draft', async () => {
  for (const isEditMode of [false, true]) {
    let callbacks = 0;
    const m = await reviewModal({ isEditMode, reviewId: 81, onUpdated: () => callbacks++ });
    const pending = submitReview(m);
    m.requests[0].reject({ isAxiosError: true, response: { data: { message: 'level: 난이도를 선택해주세요\nhorror: 0.5 단위로 입력해 주세요\nignored' } } });
    await pending; await m.settle();
    assert.equal(m.atoms.reviewSectionState, 'third'); assert.equal(m.atoms[familyKey(7)].reviewComment, '체험 기록'); assert.equal(callbacks, 0);
    const popup = m.children('PopUpModal')[0]; assert.equal(popup.props.isOpen, !isEditMode);
    if (!isEditMode) assert.deepEqual(plain(popup.props.messageList), ['난이도를 선택해주세요']);
  }
});

test('4-21 null/missing remarks block POST and PUT without coercion, preserve draft and allow explicit empty retry', async () => {
  for (const isEditMode of [false, true]) {
    for (const participant of [{ proficiency: 'JUNIOR', remark: null }, { proficiency: 'JUNIOR' }, { proficiency: 'JUNIOR', remark: undefined }]) {
      const m = await reviewModal({ isEditMode, reviewId: 81 });
      m.setDraft(7, { participantList: [participant] }); const draft = m.atoms[familyKey(7)];
      await submitReview(m); await m.settle();
      assert.equal(m.requests.length, 0); assert.equal(m.atoms[familyKey(7)], draft);
      assert.equal(m.atoms[familyKey(7)].participantList[0].remark, participant.remark);
      assert.equal(m.children('PopUpModal')[0].props.isOpen, true);
      assert.match(m.children('PopUpModal')[0].props.messageList[0], /1번의 특이 사항/);
      m.children('PopUpModal')[0].props.onConfirm(); m.render();
      m.setDraft(7, { participantList: [{ ...participant, remark: '' }] });
      const pending = submitReview(m); assert.equal(m.requests.length, 1); assert.equal(m.requests[0].data.participantList[0].remark, '');
      m.requests[0].resolve(isEditMode ? 'updated' : { reviewId: 81 }); await pending; await m.settle(); assert.equal(m.atoms.reviewSectionState, 'last');
    }
  }
});

test('4-21 missing IDs show the existing popup and preserve draft; zero and string review IDs remain valid', async () => {
  for (const props of [
    { themeData: {} }, { themeData: { themeId: null } },
    { isEditMode: true }, { isEditMode: true, reviewId: null }, { isEditMode: true, reviewId: '' },
  ]) {
    const m = await reviewModal(props); const id = props.themeData ? props.themeData.themeId : 7;
    m.setDraft(id, validReview()); const draft = m.atoms[familyKey(id)];
    await submitReview(m); await m.settle();
    assert.equal(m.requests.length, 0); assert.equal(m.atoms[familyKey(id)], draft);
    const popup = m.children('PopUpModal')[0]; assert.equal(popup.props.isOpen, true); assert.match(popup.props.messageList[0], /정보를 확인할 수 없습니다/);
  }
  for (const reviewId of [0, '81']) {
    const m = await reviewModal({ themeData: { themeId: 0 }, isEditMode: true, reviewId }); m.setDraft(0, validReview());
    const pending = submitReview(m); assert.equal(m.requests[0].url, `themes/0/reviews/${reviewId}`);
    m.requests[0].resolve('updated'); await pending; await m.settle(); assert.equal(m.atoms.reviewSectionState, 'last');
  }
});

test('4-21 original score/evaluation rules now run before both requests and keep draft', async () => {
  const fields = ['satisfactionLevel', 'level', 'horrorLevel', 'activityLevel', 'storyLevel', 'interiorLevel'];
  for (const isEditMode of [false, true]) {
    for (const field of fields) {
      for (const value of [null, undefined, 0]) {
        const m = await reviewModal({ isEditMode, reviewId: 81 }); m.setDraft(7, { [field]: value }); const draft = m.atoms[familyKey(7)];
        await submitReview(m); await m.settle(); assert.equal(m.requests.length, 0); assert.equal(m.atoms[familyKey(7)], draft);
        assert.equal(m.children('PopUpModal')[0].props.messageList.length, 1);
      }
    }
    const m = await reviewModal({ isEditMode, reviewId: 81 }); m.setDraft(7, { review: null });
    await submitReview(m); await m.settle(); assert.equal(m.requests.length, 0); assert.deepEqual(plain(m.children('PopUpModal')[0].props.messageList), ['총평 선택']);
    m.setDraft(7, { review: 'FLOWER', participantList: [{ proficiency: '', remark: '' }, { remark: '' }] });
    await submitReview(m); await m.settle(); assert.equal(m.requests.length, 0); assert.match(m.children('PopUpModal')[0].props.messageList[0], /1, 2번의 숙련도/);
  }
});

test('4-21 valid payload keeps empty/space strings, zeros, nullable fields, order and restored metadata', async () => {
  for (const isEditMode of [false, true]) {
    const m = await reviewModal({ isEditMode, reviewId: 81 });
    m.setDraft(7, { participantList: [{ proficiency: 'MASTER', remark: '', isOwner: true }, { proficiency: 'JUNIOR', remark: ' ', isOwner: false }],
      reviewComment: '', usedHint: 0, lockRatio: 0, reviewTagList: [], playedAt: null, isEscaped: null,
      remainingTime: null, hasViewedEnding: false, reviewId: 81, memberId: 6, createdAt: 'original', img: 'original.png' });
    const expected = { ...m.atoms[familyKey(7)] }; delete expected.uiState;
    const pending = submitReview(m); assert.deepEqual(plain(m.requests[0].data), plain(expected));
    assert.equal(m.atoms[familyKey(7)].participantList[1].remark, ' ');
    m.requests[0].resolve(isEditMode ? 'updated' : { reviewId: 82 }); await pending;
  }
});

test('4-21 immediate duplicate calls share the lock and failed requests can be retried', async () => {
  for (const isEditMode of [false, true]) {
    const m = await reviewModal({ isEditMode, reviewId: 81 });
    const first = submitReview(m), duplicate = submitReview(m); await duplicate; m.render(); await submitReview(m);
    assert.equal(m.requests.length, 1);
    m.requests[0].reject(Error('offline')); await first; await m.settle();
    assert.equal(m.atoms[familyKey(7)].reviewComment, '체험 기록');
    const retry = submitReview(m); assert.equal(m.requests.length, 2);
    m.requests[1].resolve(isEditMode ? 'updated' : { reviewId: 82 }); await retry; await m.settle(); assert.equal(m.atoms.reviewSectionState, 'last');
  }
});

function closeReview(m) {
  m.nodes(n => n.type === 'styled.img' && typeof n.props.onClick === 'function')[0].props.onClick();
}

test('4-21 close invalidates saves synchronously before render; stale submit/success/error/finally cannot write', async () => {
  for (const isEditMode of [false, true]) {
    for (const fail of [false, true]) {
      let callbacks = 0;
      const m = await reviewModal({ isEditMode, reviewId: 81, onUpdated: () => callbacks++ });
      const previousSubmit = m.nodes(n => typeof n.props.onClick === 'function' && /후기 (작성|수정) 완료/.test(m.textOf(n)))[0].props.onClick;
      const pending = previousSubmit(); closeReview(m);
      await previousSubmit(); assert.equal(m.requests.length, 1);
      const writes = m.writes.length, stateWrites = m.stateWrites.length;
      if (fail) m.requests[0].reject(Error('late failure')); else m.requests[0].resolve(isEditMode ? 'updated' : { reviewId: 82 });
      await pending; assert.equal(m.writes.length, writes); assert.equal(m.stateWrites.length, stateWrites); assert.equal(callbacks, 0);
      assert.equal(m.atoms[familyKey(7)].reviewComment, '체험 기록'); assert.equal(m.atoms.reviewModalState, false);
    }
  }
});

test('4-21 close/reopen with the same IDs ignores old completion and old finally cannot unlock the new save', async () => {
  for (const isEditMode of [false, true]) {
    for (const fail of [false, true]) {
      let callbacks = 0;
      const m = await reviewModal({ isEditMode, reviewId: 81, onUpdated: () => callbacks++ }); const old = submitReview(m);
      closeReview(m); m.render(); m.atoms.reviewModalState = true; m.render(); await m.settle();
      m.setDraft(7, { ...validReview(), reviewComment: 'new session' }); m.atoms.reviewSectionState = 'third'; m.render();
      const current = submitReview(m); const writes = m.writes.length, stateWrites = m.stateWrites.length;
      if (fail) m.requests[0].reject(Error('old failure')); else m.requests[0].resolve(isEditMode ? 'updated' : { reviewId: 11 });
      await old; assert.equal(m.writes.length, writes); assert.equal(m.stateWrites.length, stateWrites); assert.equal(callbacks, 0);
      assert.equal(m.atoms[familyKey(7)].reviewComment, 'new session');
      await submitReview(m); assert.equal(m.requests.length, 2);
      m.requests[1].resolve(isEditMode ? 'updated' : { reviewId: 22 }); await current; await m.settle();
      assert.equal(callbacks, 1); assert.equal(m.atoms.reviewSectionState, 'last');
      clickReview(m, '공유하기'); assert.equal(m.navigation[0][1].state.reviewData.reviewComment, 'new session');
    }
  }
});

test('4-21 A-B-A theme/review/mode changes use generations, preserve current draft and current callback', async () => {
  for (const target of ['theme', 'review', 'mode']) {
    for (const fail of [false, true]) {
      let oldCallbacks = 0, currentCallbacks = 0;
      const m = await reviewModal({ isEditMode: true, reviewId: 81, onUpdated: () => oldCallbacks++ }); const old = submitReview(m);
      if (target === 'theme') { m.update({ themeData: { themeId: 8 } }); m.update({ themeData: { themeId: 7 } }); }
      if (target === 'review') { m.update({ reviewId: 82 }); m.update({ reviewId: 81 }); }
      if (target === 'mode') { m.update({ isEditMode: false }); m.update({ isEditMode: true }); }
      m.update({ onUpdated: () => currentCallbacks++ }); m.setDraft(7, { ...validReview(), reviewComment: 'A again' });
      m.atoms.reviewSectionState = 'third'; m.render();
      const current = submitReview(m), writes = m.writes.length, states = m.stateWrites.length;
      if (fail) m.requests[0].reject(Error('old failure')); else m.requests[0].resolve('old updated');
      await old; assert.equal(m.writes.length, writes); assert.equal(m.stateWrites.length, states); assert.equal(oldCallbacks, 0); assert.equal(currentCallbacks, 0);
      assert.equal(m.atoms[familyKey(7)].reviewComment, 'A again'); await submitReview(m); assert.equal(m.requests.length, 2);
      m.requests[1].resolve('updated'); await current; await m.settle(); assert.equal(currentCallbacks, 1); assert.equal(m.atoms.reviewSectionState, 'last');
    }
  }
});

test('4-21 unmounted save cannot mutate a new modal sharing the same Recoil draft or release its lock', async () => {
  for (const isEditMode of [false, true]) {
    for (const fail of [false, true]) {
      const sharedAtoms = {}; let oldCallbacks = 0, currentCallbacks = 0;
      sharedAtoms.reviewModalState = true;
      const oldModal = await reviewModal({ isEditMode, reviewId: 81, onUpdated: () => oldCallbacks++ }, { sharedAtoms });
      const old = submitReview(oldModal); oldModal.unmount();
      const currentModal = await reviewModal({ isEditMode, reviewId: 81, onUpdated: () => currentCallbacks++ }, { sharedAtoms });
      currentModal.setDraft(7, { reviewComment: 'replacement' }); const current = submitReview(currentModal);
      const writes = oldModal.writes.length, states = oldModal.stateWrites.length;
      if (fail) oldModal.requests[0].reject(Error('old failure')); else oldModal.requests[0].resolve(isEditMode ? 'updated' : { reviewId: 11 });
      await old; assert.equal(oldModal.writes.length, writes); assert.equal(oldModal.stateWrites.length, states); assert.equal(oldCallbacks, 0);
      assert.equal(sharedAtoms[familyKey(7)].reviewComment, 'replacement'); await submitReview(currentModal); assert.equal(currentModal.requests.length, 1);
      currentModal.requests[0].resolve(isEditMode ? 'updated' : { reviewId: 22 }); await current; await currentModal.settle(); assert.equal(currentCallbacks, 1);
    }
  }
});

test('4-21 callback-triggered unmount stops subsequent reset/section/finally writes', async () => {
  let callbacks = 0;
  const m = await reviewModal({ onUpdated: () => { callbacks++; m.unmount(); } });
  const pending = submitReview(m); m.requests[0].resolve({ reviewId: 81 }); await pending;
  assert.equal(callbacks, 1); assert.equal(m.atoms[familyKey(7)].reviewComment, '체험 기록'); assert.equal(m.atoms.reviewSectionState, 'third');
  assert.equal(m.stateWrites.filter(write => write.afterUnmount).length, 0);
});

test('4-21 old response arriving after current success cannot replace the completed share data', async () => {
  for (const isEditMode of [false, true]) {
    for (const fail of [false, true]) {
      let callbacks = 0;
      const m = await reviewModal({ isEditMode, reviewId: 81, onUpdated: () => callbacks++ }); const old = submitReview(m);
      m.update({ themeData: { themeId: 8 } }); m.update({ themeData: { themeId: 7 } });
      m.setDraft(7, { ...validReview(), reviewComment: 'current success' }); m.atoms.reviewSectionState = 'third'; m.render();
      const current = submitReview(m); m.requests[1].resolve(isEditMode ? 'updated' : { reviewId: 22 }); await current; await m.settle();
      const writes = m.writes.length, states = m.stateWrites.length;
      if (fail) m.requests[0].reject(Error('old failure')); else m.requests[0].resolve(isEditMode ? 'old updated' : { reviewId: 11 });
      await old; assert.equal(callbacks, 1); assert.equal(m.writes.length, writes); assert.equal(m.stateWrites.length, states); assert.equal(m.atoms.reviewSectionState, 'last');
      clickReview(m, '공유하기'); assert.equal(m.navigation[0][1].state.reviewData.reviewComment, 'current success'); assert.equal(m.navigation[0][1].state.reviewData.reviewId, isEditMode ? 81 : 22);
    }
  }
});

test('4-21 POST optional/zero reviewId retains existing null fallback and zero identity', async () => {
  for (const response of [{}, { reviewId: 0 }]) {
    const m = await reviewModal(); const pending = submitReview(m); m.requests[0].resolve(response); await pending; await m.settle();
    clickReview(m, '공유하기'); assert.equal(m.navigation[0][1].state.reviewData.reviewId, response.reviewId ?? null);
  }
});


test('async autofill: unmounted second step cannot write into the shared review draft', async () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render(); const writes = m.writes.length;
  m.unmount(); m.requests[0].resolve({ proficiency: 'MASTER' }); await flush(); await flush();
  assert.equal(m.writes.length, writes); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, null);
});

test('async autofill: explicitly cleared proficiency stays null when automatic input finishes', async () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
  m.children('PlayerBoxSection')[0].props.onSkillChange('BEGINNER'); m.render();
  m.children('PlayerBoxSection')[0].props.onSkillChange(null); m.render();
  m.requests[0].resolve({ proficiency: 'MASTER' }); await m.settle();
  assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, null);
});

const autofillErrors = m => m.errors.filter(([message]) => message === '유저 성향 불러오기 실패:');
const ownerSkill = (m, value) => { m.children('PlayerBoxSection')[0].props.onSkillChange(value); m.render(); };

test('async autofill: theme A-B-A uses independent requests and old success/error cannot change either shared draft', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
    m.update({ themeData: { themeId: 8 } }); m.update({ themeData: { themeId: 7 } }); assert.equal(m.requests.length, 3);
    const before = m.writes.length;
    m.requests[2].resolve({ proficiency: 'MASTER' }); await m.settle(); assert.equal(m.writes.length, before + 1);
    if (finish === 'resolve') m.requests[0].resolve({ proficiency: 'BEGINNER' }); else m.requests[0].reject(Error('old failure'));
    m.requests[1].resolve({ proficiency: 'JUNIOR' }); await m.settle();
    assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, 'MASTER'); assert.equal(m.atoms[familyKey(8)].participantList[0].proficiency, null);
    assert.equal(m.writes.length, before + 1); assert.equal(autofillErrors(m).length, 0);
  }
});

test('async autofill: review A-B-A within one theme invalidates the previous review context', async () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
  m.setDraft(7, { reviewId: 21 }); m.setDraft(7, { reviewId: 22 }); m.setDraft(7, { reviewId: 21 }); assert.equal(m.requests.length, 4);
  const writes = m.writes.length;
  m.requests[0].resolve({ proficiency: 'BEGINNER' }); m.requests[1].resolve({ proficiency: 'BEGINNER' }); m.requests[2].reject(Error('old failure')); await m.settle();
  assert.equal(m.writes.length, writes); assert.equal(autofillErrors(m).length, 0);
  m.requests[3].resolve({ proficiency: 'MASTER' }); await m.settle(); assert.equal(m.atoms[familyKey(7)].reviewId, 21); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, 'MASTER');
});

test('async autofill: modal/step close and reentry discard old success/error while the new request remains usable', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render(); m.unmount(); m.remount();
    const writes = m.writes.length; assert.equal(m.requests.length, 2);
    if (finish === 'resolve') m.requests[0].resolve({ proficiency: 'MASTER' }); else m.requests[0].reject(Error('old failure'));
    await m.settle(); assert.equal(m.writes.length, writes); assert.equal(autofillErrors(m).length, 0);
    m.requests[1].resolve({ proficiency: 'JUNIOR' }); await m.settle(); assert.equal(m.writes.length, writes + 1); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, 'JUNIOR');
  }
});

test('async autofill: StrictMode shares a target lookup and only its active continuation writes the draft', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render(); m.strictReplay(); assert.equal(m.requests.length, 1);
    if (finish === 'resolve') m.requests[0].resolve({ proficiency: 'MASTER' }); else m.requests[0].reject(Error('current failure'));
    await m.settle(); assert.equal(m.writes.length, finish === 'resolve' ? 1 : 0); assert.equal(autofillErrors(m).length, finish === 'reject' ? 1 : 0);
    m.render(); assert.equal(m.requests.length, 1);
  }
});

test('async autofill: current lookup failure keeps once-per-context behavior and reentry permits retry', async () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
  m.requests[0].reject(Error('current failure')); await m.settle(); assert.equal(autofillErrors(m).length, 1); assert.equal(m.writes.length, 0);
  m.render(); m.render(); assert.equal(m.requests.length, 1);
  m.unmount(); m.remount(); m.requests[1].resolve({ proficiency: 'MASTER' }); await m.settle(); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, 'MASTER');
});

test('async autofill: nullable or absent proficiency stays unchanged and valid values fill only an empty owner field', async () => {
  for (const empty of [null, '', undefined]) for (const response of [{}, { proficiency: null }, { proficiency: 'MASTER' }]) {
    const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
    m.setDraft(7, { participantList: [{ proficiency: empty, remark: null, isOwner: true }, { proficiency: 'BEGINNER', remark: '' }] });
    m.requests[0].resolve(response); await m.settle(); const players = m.atoms[familyKey(7)].participantList;
    assert.equal(players[0].proficiency, response.proficiency ?? empty); assert.equal(players[0].remark, null); assert.deepEqual(plain(players[1]), { proficiency: 'BEGINNER', remark: '' });
  }
});

test('async autofill: manual owner changes, including explicit null and changes before render, always win', async () => {
  for (const isMobile of [false, true]) for (const changes of [[null], ['BEGINNER'], ['BEGINNER', null], ['BEGINNER', 'MASTER', 'BEGINNER']]) {
    const m = mount(ui('ReviewSecond.tsx'), { isMobile, props: { themeData: { themeId: 7 } } }); m.render();
    const change = m.children('PlayerBoxSection')[0].props.onSkillChange;
    for (const value of changes) change(value); // Intentionally do not wait for a React render.
    const writes = m.writes.length; m.requests[0].resolve({ proficiency: 'JUNIOR' }); await m.settle();
    assert.equal(m.writes.length, writes); assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, changes.at(-1));
  }
});

test('async autofill: edits to notes and other participants do not block or get lost in the owner proficiency fill', async () => {
  for (const isMobile of [false, true]) {
    const m = mount(ui('ReviewSecond.tsx'), { isMobile, props: { themeData: { themeId: 7 } } }); m.render();
    m.children('PlayerBoxSection')[0].props.onNoteChange('owner note'); m.render();
    m.children('PlayerBoxSection')[1].props.onSkillChange('BEGINNER'); m.render();
    m.children('HintCounter')[0].props.onChange(3); m.render();
    m.requests[0].resolve({ proficiency: 'MASTER' }); await m.settle(); const draft = m.atoms[familyKey(7)];
    assert.equal(draft.participantList[0].proficiency, 'MASTER'); assert.equal(draft.participantList[0].remark, 'owner note'); assert.equal(draft.participantList[1].proficiency, 'BEGINNER'); assert.equal(draft.usedHint, 3);
    assert.equal(m.requests.length, 1);
  }
});

test('async autofill: a manual owner choice in A does not disable untouched automatic input for a new target B', async () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render(); ownerSkill(m, null);
  m.update({ themeData: { themeId: 8 } }); m.requests[1].resolve({ proficiency: 'MASTER' }); await m.settle(); m.requests[0].resolve({ proficiency: 'JUNIOR' }); await m.settle();
  assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, null); assert.equal(m.atoms[familyKey(8)].participantList[0].proficiency, 'MASTER');
});

test('async autofill: changed target invalidates the old continuation before passive cleanup', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render();
    m.update({ themeData: { themeId: 8 } }, { deferPassive: true }); const writes = m.writes.length;
    if (finish === 'resolve') m.requests[0].resolve({ proficiency: 'MASTER' }); else m.requests[0].reject(Error('old failure'));
    await flush(); await flush(); assert.equal(m.writes.length, writes); assert.equal(autofillErrors(m).length, 0);
    m.flushEffects(); m.requests[1].resolve({ proficiency: 'JUNIOR' }); await m.settle(); assert.equal(m.atoms[familyKey(8)].participantList[0].proficiency, 'JUNIOR');
  }
});

test('async autofill: returning A-B-A preserves an explicit owner clear in the same shared draft session', async () => {
  const m = mount(ui('ReviewSecond.tsx'), { props: { themeData: { themeId: 7 } } }); m.render(); ownerSkill(m, null);
  m.update({ themeData: { themeId: 8 } }); m.requests[1].resolve({ proficiency: 'JUNIOR' }); await m.settle();
  m.update({ themeData: { themeId: 7 } }); const writes = m.writes.length;
  m.requests[2].resolve({ proficiency: 'MASTER' }); m.requests[0].resolve({ proficiency: 'MASTER' }); await m.settle();
  assert.equal(m.atoms[familyKey(7)].participantList[0].proficiency, null); assert.equal(m.atoms[familyKey(8)].participantList[0].proficiency, 'JUNIOR'); assert.equal(m.writes.length, writes);
});
