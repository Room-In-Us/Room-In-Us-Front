const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));
const authUI = name => `src/features/auth/ui/${name}.tsx`;
const surveyUI = name => `src/features/survey/ui/${name}.tsx`;

// Actual atom defaults, option data and API functions are loaded; HTTP is replaced
// with a deferred local transport. UI children are inspected through their props.
function mount(relative, { props = {}, values = {}, sharedAtoms } = {}) {
  const atoms = sharedAtoms || {};
  const defaults = new Map(), setters = new Map(), cache = new Map();
  const slots = [], requests = [], writes = [], navigation = [], errors = [];
  let cursor = 0, changed = false, pending = [], tree;
  const setAtom = (key, value) => {
    const next = typeof value === 'function' ? value(atoms[key]) : value;
    if (!Object.is(atoms[key], next)) changed = true;
    atoms[key] = next; writes.push({ key, value: next });
  };
  const setter = key => {
    if (!setters.has(key)) setters.set(key, value => setAtom(key, value));
    return setters.get(key);
  };
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(slots[i], next)) changed = true;
        slots[i] = next; writes.push({ state: i, value: next });
      }];
    },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
    useEffect(effect, deps) {
      const i = cursor++;
      if (!slots[i]?.deps || deps.some((value, j) => !Object.is(value, slots[i].deps[j]))) {
        const previous = slots[i]; slots[i] = { deps };
        pending.push(() => { previous?.cleanup?.(); slots[i].cleanup = effect(); });
      }
    },
  };
  const transport = (method, url, body) => {
    let resolve, reject;
    const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
    requests.push({ method, url, body, resolve: data => resolve({ data }), reject });
    return promise;
  };
  const api = { get: url => transport('GET', url), patch: (url, body) => transport('PATCH', url, body) };
  const styled = new Proxy(target => () => `styled(${target})`, { get: (_, key) => () => `styled.${String(key)}` });
  const jsx = (type, props, key) => ({ type, props: props || {}, key });
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const requireModule = id => {
      if (id === 'react') return react;
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === 'prop-types') return require('prop-types');
      if (id === 'recoil') return {
        atom(config) {
          defaults.set(config.key, config.default);
          if (!Object.hasOwn(atoms, config.key)) atoms[config.key] = structuredClone(config.default);
          return config.key;
        },
        useRecoilState: key => [atoms[key], setter(key)], useRecoilValue: key => atoms[key],
        useSetRecoilState: setter, useResetRecoilState: key => () => setAtom(key, structuredClone(defaults.get(key))),
      };
      if (id === 'react-router-dom') return { useNavigate: () => (...args) => navigation.push(args) };
      if (id.includes('app/API')) return { api };
      if (id.includes('/api/') || id.includes('/model/')) return load(path.resolve(path.dirname(filename), id + '.ts'));
      return { __esModule: true, default: id.replace(/\.(jsx|tsx)$/, '') };
    };
    const original = process.env.PREFERENCE_BASELINE && path.join(process.env.PREFERENCE_BASELINE, path.relative(root, filename).replace(/\.tsx$/, '.jsx'));
    const sourceFile = original && fs.existsSync(original) ? original : filename;
    const code = ts.transpileModule(fs.readFileSync(sourceFile, 'utf8'), {
      fileName: sourceFile,
      compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(code, {
      module, exports: module.exports, require: requireModule,
      console: { log() {}, error(...args) { if (filename === path.join(root, relative)) errors.push(args[0]); } },
    }, { filename: sourceFile });
    cache.set(filename, module.exports); return module.exports;
  }
  const component = load(path.join(root, relative)).default;
  Object.assign(atoms, values);
  const render = () => { cursor = 0; changed = false; pending = []; tree = component(props); pending.forEach(effect => effect()); return tree; };
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
    atoms, requests, writes, errors, navigation, render, find, text: () => text(tree),
    children: name => find(n => String(n.type).endsWith('/' + name)),
    radios: () => find(n => n.type === 'styled.button' && typeof n.props.selected === 'boolean'),
    tags: () => find(n => n.props.item !== undefined),
    loading: () => find(n => String(n.type).endsWith('/Loading')).length > 0,
    update(values) { Object.entries(values).forEach(([key, value]) => setAtom(key, value)); return render(); },
    clickText(value) {
      const nodes = find(n => typeof n.props.onClick === 'function' && text(n) === value);
      assert.equal(nodes.length, 1, `Expected one clickable ${value}`); nodes[0].props.onClick(); render();
    },
    clickTag(label) { const tag = find(n => n.props.item === label)[0]; if (!tag.props.disabled) tag.props.onClick(); render(); },
    async settle() {
      for (let i = 0; i < 15; i++) { await flush(); if (!changed) return; render(); }
      throw Error('Component did not settle');
    },
    unmount() { slots.forEach(slot => slot?.cleanup?.()); },
  };
}

const preference = {
  proficiency: 'JUNIOR', preferredGenreList: ['HORROR', 'SF'], preferredHeadcount: 3,
  preferredElementList: ['PRICE', 'STORY'], preferredActivity: 'LOW', preferredDevice: 'LOCK',
  horrorPos: 'NERVOUS', preference: '추리 선호',
};

test('4-14 normal read-only fields preserve nullable fallbacks, selected values and option order', () => {
  for (const missing of [null, undefined]) {
    for (const name of ['ProficiencySection', 'HeadcountSection', 'PositionSection']) {
      const m = mount(authUI('preferences/' + name), { props: { userInfo: missing } }); m.render();
      assert.equal(m.radios().some(n => n.props.selected), false); assert.equal(m.writes.length, 0);
    }
    const info = mount(authUI('preferences/InfoSection'), { props: { userInfo: missing } }); info.render();
    assert.equal(info.find(n => n.props.readOnly)[0].props.value, '');
    const genre = mount(authUI('preferences/GenreSection'), { props: { userInfo: missing } }); genre.render();
    assert.equal(genre.tags().length, 20); assert.equal(genre.tags().some(n => n.props.selected), false);
    const pref = mount(authUI('preferences/PreferenceSection'), { props: { elementInfo: missing, deviceInfo: missing, activityInfo: missing } }); pref.render();
    assert.equal(pref.tags().length, 12); assert.equal(pref.tags().some(n => n.props.selected), false);
  }
  const genre = mount(authUI('preferences/GenreSection'), { props: { userInfo: preference.preferredGenreList } }); genre.render();
  assert.deepEqual(genre.tags().filter(n => n.props.selected).map(n => n.props.item), ['공포', 'SF']);
  const head = mount(authUI('preferences/HeadcountSection'), { props: { userInfo: 0 } }); head.render();
  assert.equal(head.radios().some(n => n.props.selected), false);
});

test('4-14 normal tags keep optional callbacks and existing disabled click behavior', () => {
  let count = 0;
  for (const disabled of [false, true, undefined]) {
    const m = mount(authUI('preferences/SurveyTag'), { props: { item: '장르', onClick: () => count++, disabled } }); const tree = m.render();
    if (disabled) assert.equal(tree.props.onClick, undefined); else tree.props.onClick();
    assert.equal(Object.hasOwn(tree.props, 'disabled'), false); // Existing CSS prop omission is intentionally preserved.
  }
  assert.equal(count, 2);
});

test('4-14 normal member requests and all eight response fields stay unchanged', async () => {
  for (const id of [7, '7']) {
    const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: id, userInfoNameState: '테스터' } }); m.render();
    assert.equal(m.loading(), true); assert.equal(m.requests[0].url, 'members/7/preferences');
    m.requests[0].resolve({ memberId: 7, ...preference }); await m.settle(); assert.equal(m.loading(), false);
    assert.equal(m.children('ProficiencySection')[0].props.userInfo, 'JUNIOR');
    assert.deepEqual(plain(m.children('GenreSection')[0].props.userInfo), ['HORROR', 'SF']);
    assert.equal(m.children('HeadcountSection')[0].props.userInfo, 3);
    assert.deepEqual(plain(m.children('PreferenceSection')[0].props), { elementInfo: ['PRICE', 'STORY'], deviceInfo: 'LOCK', activityInfo: 'LOW' });
    assert.equal(m.children('PositionSection')[0].props.userInfo, 'NERVOUS');
    assert.equal(m.children('InfoSection')[0].props.userInfo, '추리 선호');
    m.render(); assert.equal(m.requests.length, 1); // No direct /members authentication query.
    m.find(n => typeof n.props.onClick === 'function')[0].props.onClick(); assert.equal(m.atoms.userInfoModalState, false);
  }
});

test('4-14 normal empty/optional/null response fields and failure keep the no-data view', async () => {
  for (const response of [{}, { memberId: 7 }, { proficiency: null, preferredGenreList: [], preferredElementList: [], preference: '', preferredHeadcount: 0 }]) {
    const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: 7 } }); m.render();
    m.requests[0].resolve(response); await m.settle(); assert.equal(m.loading(), false); assert.equal(m.children('GenreSection').length, 0);
    assert.equal(m.text().includes('정보가 없습니다'), true);
  }
  const failed = mount(authUI('UserInfoModal'), { values: { userInfoIdState: 7 } }); failed.render();
  failed.requests[0].reject(Error('mock failure')); await failed.settle(); assert.equal(failed.loading(), false); assert.equal(failed.text().includes('정보가 없습니다'), true);
});

test('4-14 null member ID skips requests and hides prior data in the first render', async () => {
  const empty = mount(authUI('UserInfoModal')); empty.render(); await empty.settle();
  assert.equal(empty.requests.length, 0); assert.equal(empty.loading(), false); assert.equal(empty.text().includes('정보가 없습니다'), true);
  const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: 7 } }); m.render(); m.requests[0].resolve(preference); await m.settle();
  m.update({ userInfoIdState: null }); assert.equal(m.children('GenreSection').length, 0); assert.equal(m.loading(), false);
  await m.settle(); assert.equal(m.requests.length, 1);
});

test('4-14 missing memberId from an invalid JS caller is rejected without widening the atom or API type', async () => {
  const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: undefined } }); m.render(); await m.settle();
  assert.equal(m.requests.length, 0); assert.equal(m.loading(), false); assert.equal(m.text().includes('정보가 없습니다'), true);
});

test('4-14 member changes immediately hide old data and stale errors/finally cannot end current loading', async () => {
  const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: 7 } }); m.render(); m.requests[0].resolve(preference); await m.settle();
  m.update({ userInfoIdState: 8 }); assert.equal(m.children('InfoSection').length, 0); assert.equal(m.loading(), true);
  m.update({ userInfoIdState: 9 }); await m.settle(); const writes = m.writes.length, errors = m.errors.length;
  m.requests[1].reject(Error('old failure')); await m.settle();
  assert.equal(m.writes.length, writes); assert.equal(m.errors.length, errors); assert.equal(m.loading(), true);
  m.requests[2].resolve({ preference: '새 회원' }); await m.settle(); assert.equal(m.children('InfoSection')[0].props.userInfo, '새 회원');
});

test('4-14 A → B → A checks request generations for success, error and finally', async () => {
  for (const failCurrent of [false, true]) {
    const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: 7 } }); m.render();
    m.update({ userInfoIdState: 8 }); m.update({ userInfoIdState: 7 }); await m.settle();
    if (failCurrent) m.requests[2].reject(Error('current failure')); else m.requests[2].resolve({ preference: '최신 A' });
    await m.settle(); const count = m.writes.length, errors = m.errors.length;
    m.requests[0].resolve({ preference: '이전 A' }); m.requests[1].reject(Error('old B failure')); await m.settle();
    assert.equal(m.writes.length, count); assert.equal(m.errors.length, errors); assert.equal(m.loading(), false);
    if (failCurrent) assert.equal(m.children('InfoSection').length, 0); else assert.equal(m.children('InfoSection')[0].props.userInfo, '최신 A');
  }
});

test('4-14 null transition and unmount ignore every pending response path', async () => {
  for (const nullId of [false, true]) {
    for (const fails of [false, true]) {
      const m = mount(authUI('UserInfoModal'), { values: { userInfoIdState: 7 } }); m.render();
      if (nullId) { m.update({ userInfoIdState: null }); await m.settle(); } else m.unmount();
      const count = m.writes.length, errors = m.errors.length;
      if (fails) m.requests[0].reject(Error('late failure')); else m.requests[0].resolve(preference);
      await m.settle(); assert.equal(m.writes.length, count); assert.equal(m.errors.length, errors);
    }
  }
});

test('4-15 normal proficiency toggles retain literal values, null and navigation', () => {
  const m = mount(surveyUI('SurveyProficiencySection')); m.render();
  assert.equal(m.atoms.surveyState.proficiency, null);
  ['BEGINNER', 'JUNIOR', 'SENIOR', 'MASTER'].forEach((value, index) => {
    m.radios()[index].props.onClick(); m.render(); assert.equal(m.atoms.surveyState.proficiency, value);
    m.radios()[index].props.onClick(); m.render(); assert.equal(m.atoms.surveyState.proficiency, null);
  });
  m.clickText('질문 넘기기'); assert.equal(m.atoms.surveySectionState, 'genre');
  m.clickText('루미너스 메인으로 이동하기'); assert.equal(m.atoms.modalState, true); assert.equal(m.requests.length, 0);
});

test('4-15 normal genre selection keeps order, maximum four and remove/reselect behavior', () => {
  const m = mount(surveyUI('SurveyGenreSection')); m.render();
  ['감성', '공포', '스릴러', '추리'].forEach(label => m.clickTag(label));
  assert.deepEqual(plain(m.atoms.surveyState.preferredGenreList), ['SENTIMENTAL', 'HORROR', 'THRILLER', 'DETECTIVE']);
  assert.equal(m.tags().find(n => n.props.item === '미스터리').props.disabled, true);
  m.tags().find(n => n.props.item === '미스터리').props.onClick(); m.render(); // Handler itself also enforces the maximum.
  assert.equal(m.atoms.surveyState.preferredGenreList.length, 4);
  m.clickTag('공포'); m.clickTag('미스터리');
  assert.deepEqual(plain(m.atoms.surveyState.preferredGenreList), ['SENTIMENTAL', 'THRILLER', 'DETECTIVE', 'MYSTERY']);
  m.clickText('다음으로'); assert.equal(m.atoms.surveySectionState, 'headcount');
  m.find(n => String(n.type).includes('/leftArrow.svg'))[0].props.onClick(); assert.equal(m.atoms.surveySectionState, 'proficiency');
  assert.equal(m.requests.length, 0);
});

test('4-15 normal headcount keeps numeric 1–6 and null toggles, without changing other drafts', () => {
  const otherDraft = { preference: '마이페이지 성향' };
  const m = mount(surveyUI('SurveyHeadcountSection'), { values: { myPageSurveyState: otherDraft } }); m.render();
  for (let count = 1; count <= 6; count++) {
    m.radios()[count - 1].props.onClick(); m.render(); assert.equal(m.atoms.surveyState.preferredHeadcount, count);
    m.radios()[count - 1].props.onClick(); m.render(); assert.equal(m.atoms.surveyState.preferredHeadcount, null);
  }
  assert.equal(m.text().includes('6인 이상'), true); assert.equal(m.atoms.myPageSurveyState, otherDraft);
  m.clickText('질문 넘기기'); assert.equal(m.atoms.surveySectionState, 'preference');
});

test('4-15 normal survey tags keep optional props, callbacks and disabled behavior', () => {
  let count = 0;
  for (const disabled of [false, true, undefined]) {
    const m = mount(surveyUI('SurveyTag'), { props: { item: '태그', onClick: () => count++, disabled } }); const tree = m.render();
    if (disabled) assert.equal(tree.props.onClick, undefined); else tree.props.onClick();
    assert.equal(Object.hasOwn(tree.props, 'disabled'), false);
  }
  assert.equal(count, 2);
});

test('4-16 normal preference choices retain order, maximum three, enum values and nullable toggles', () => {
  const m = mount(surveyUI('SurveyPreferenceSection')); m.render();
  ['가격', '스토리', '연출'].forEach(label => m.clickTag(label));
  assert.deepEqual(plain(m.atoms.surveyState.preferredElementList), ['PRICE', 'STORY', 'DIRECTION']);
  m.tags().find(n => n.props.item === '볼륨').props.onClick(); m.render(); assert.equal(m.atoms.surveyState.preferredElementList.length, 3);
  m.clickTag('스토리'); m.clickTag('볼륨');
  assert.deepEqual(plain(m.atoms.surveyState.preferredElementList), ['PRICE', 'DIRECTION', 'VOLUME']);
  for (const [offset, field, options] of [[6, 'preferredDevice', ['DEVICE', 'LOCK', 'NO_MATTER']], [9, 'preferredActivity', ['HIGH', 'LOW', 'NO_MATTER']]]) {
    options.forEach((value, index) => {
      m.tags()[offset + index].props.onClick(); m.render(); assert.equal(m.atoms.surveyState[field], value);
      m.tags()[offset + index].props.onClick(); m.render(); assert.equal(m.atoms.surveyState[field], null);
    });
  }
  m.clickText('다음으로'); assert.equal(m.atoms.surveySectionState, 'position'); assert.equal(m.requests.length, 0);
});

test('4-16 normal horror positions retain all six literal values and deselect to null', () => {
  const m = mount(surveyUI('SurveyPositionSection')); m.render();
  ['FEARLESS', 'FEARFUL_TANK', 'RELUCTANT_TANK', 'NERVOUS', 'SCARED', 'EXTREME_SCARED'].forEach((value, index) => {
    m.radios()[index].props.onClick(); m.render(); assert.equal(m.atoms.surveyState.horrorPos, value);
    m.radios()[index].props.onClick(); m.render(); assert.equal(m.atoms.surveyState.horrorPos, null);
  });
  m.clickText('질문 넘기기'); assert.equal(m.atoms.surveySectionState, 'info');
});

test('4-16 normal text editing keeps raw textarea text, trimmed draft and eight-field submission', async () => {
  for (const input of ['  추리 선호  ', '   ', '']) {
    const m = mount(surveyUI('SurveyInfoSection'), { values: { surveyState: { ...preference }, surveySectionState: 'info' } }); m.render();
    const textarea = () => m.find(n => n.type === 'styled.textarea')[0];
    textarea().props.onChange({ target: { value: input } }); m.render();
    assert.equal(textarea().props.value, input); assert.equal(m.atoms.surveyState.preference, input.trim());
    m.clickText('제출하기'); assert.equal(m.atoms.surveySectionState, 'info');
    assert.equal(m.requests[0].method, 'PATCH'); assert.equal(m.requests[0].url, 'members/preferences');
    assert.deepEqual(plain(m.requests[0].body), { ...preference, preference: input.trim() || null });
    m.requests[0].resolve('저장 완료'); await m.settle(); assert.equal(m.atoms.surveySectionState, 'complete');
    assert.equal(m.atoms.surveyState.preference, input.trim()); assert.equal(m.navigation.length, 0);
  }
});

test('4-16 normal empty initial text and failed submit preserve draft, page and navigation', async () => {
  const m = mount(surveyUI('SurveyInfoSection'), { values: { surveySectionState: 'info' } }); m.render();
  assert.equal(m.find(n => n.type === 'styled.textarea')[0].props.value, '');
  m.clickText('제출하기'); const draft = m.atoms.surveyState;
  assert.deepEqual(plain(m.requests[0].body), { proficiency: null, preferredGenreList: [], preferredHeadcount: null, preferredElementList: [], preferredActivity: null, preferredDevice: null, horrorPos: null, preference: null });
  m.requests[0].reject(Error('mock save failure')); await m.settle();
  assert.equal(m.atoms.surveyState, draft); assert.equal(m.atoms.surveySectionState, 'info'); assert.equal(m.navigation.length, 0);
});

test('4-16 normal quit-save sends draft unchanged and resets/navigates only after success', async () => {
  const m = mount(surveyUI('QuitModal'), { values: { surveyState: { ...preference, preference: '' }, surveySectionState: 'position', modalState: true } }); m.render();
  m.clickText('저장할래요'); assert.equal(m.atoms.modalState, true); assert.equal(m.atoms.surveySectionState, 'position');
  assert.equal(m.navigation.length, 0); assert.deepEqual(plain(m.requests[0].body), { ...preference, preference: '' });
  m.requests[0].resolve('저장 완료'); await m.settle();
  assert.equal(m.atoms.surveySectionState, 'proficiency'); assert.equal(m.atoms.modalState, false);
  assert.deepEqual(plain(m.atoms.surveyState.preferredGenreList), []); assert.equal(m.atoms.surveyState.preference, null);
  assert.deepEqual(m.writes.filter(w => w.key).slice(-3).map(w => w.key), ['surveySectionState', 'surveyState', 'modalState']);
  assert.deepEqual(m.navigation, [['/home']]);
});

test('4-16 normal quit-save failure does not reset state or navigate', async () => {
  const m = mount(surveyUI('QuitModal'), { values: { surveyState: { ...preference }, surveySectionState: 'genre', modalState: true } }); m.render();
  const draft = m.atoms.surveyState; m.clickText('저장할래요'); m.requests[0].reject(Error('mock failure')); await m.settle();
  assert.equal(m.atoms.surveyState, draft); assert.equal(m.atoms.surveySectionState, 'genre'); assert.equal(m.atoms.modalState, true); assert.equal(m.navigation.length, 0);
});

test('4-16 normal quit without save preserves existing reset behavior and close retains draft', () => {
  const m = mount(surveyUI('QuitModal'), { values: { surveyState: { ...preference }, surveySectionState: 'genre', modalState: true } }); m.render();
  const draft = m.atoms.surveyState;
  m.find(n => String(n.type).includes('modalCancelIcon.svg'))[0].props.onClick(); m.render();
  assert.equal(m.atoms.modalState, false); assert.equal(m.atoms.surveyState, draft);
  m.clickText('저장하지 않을래요'); assert.equal(m.atoms.modalState, false); assert.deepEqual(plain(m.atoms.surveyState.preferredGenreList), []);
  assert.equal(m.atoms.surveySectionState, 'genre'); // Existing cancel path does not reset the section.
  assert.deepEqual(m.navigation, [['/home']]); assert.equal(m.requests.length, 0);
});

test('4-16 normal completion resets the survey section and draft before returning home', () => {
  const m = mount(surveyUI('SurveyCompleteSection'), { values: { surveyState: { ...preference }, surveySectionState: 'complete' } }); m.render();
  m.clickText('루미너스 메인으로'); assert.equal(m.atoms.surveySectionState, 'proficiency'); assert.equal(m.atoms.surveyState.proficiency, null);
  assert.deepEqual(plain(m.atoms.surveyState.preferredElementList), []); assert.deepEqual(m.navigation, [['/home']]);
});

test('4-16 normal SurveyPage selects all seven sections and backdrop closes only the modal', () => {
  const children = ['SurveyProficiencySection', 'SurveyGenreSection', 'SurveyHeadcountSection', 'SurveyPreferenceSection', 'SurveyPositionSection', 'SurveyInfoSection', 'SurveyCompleteSection'];
  ['proficiency', 'genre', 'headcount', 'preference', 'position', 'info', 'complete'].forEach((section, index) => {
    const m = mount('src/pages/SurveyPage.tsx', { values: { surveySectionState: section, modalState: true } }); m.render();
    assert.equal(m.children(children[index]).length, 1); assert.equal(m.children('QuitModal').length, 1);
    m.find(n => typeof n.props.onClick === 'function')[0].props.onClick(); m.render(); assert.equal(m.atoms.modalState, false);
    assert.equal(m.atoms.surveySectionState, section); assert.equal(m.requests.length, 0);
  });
});
