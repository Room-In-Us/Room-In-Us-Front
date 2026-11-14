const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const plain = value => JSON.parse(JSON.stringify(value));
const flush = () => new Promise(resolve => setImmediate(resolve));
const ui = name => `src/features/auth/ui/${name}`;

// Execute real UI, schemas, API functions and atom defaults with a local-only
// transport. OAuth navigation, storage, shared auth checks and browser UI are recorded.
function mount(relative, { values = {}, props = {}, sharedAtoms, isMobile = false, storage = {}, search = '' } = {}) {
  const slots = [], effects = [], layoutEffects = [], atoms = sharedAtoms || { ...values }, setters = new Map(), cache = new Map();
  const requests = [], authChecks = [], navigation = [], alerts = [], errors = [], timers = [], stateWrites = [], writes = [], cleanedUrls = [];
  const items = new Map(Object.entries(storage));
  const localStorage = { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, String(value)), removeItem: key => items.delete(key) };
  const window = { location: { pathname: '/auth/callback', href: 'https://localhost:5173/auth/callback' }, history: { replaceState: (...args) => cleanedUrls.push(args) }, open: (...args) => navigation.push(args) };
  const navigate = (...args) => navigation.push(args);
  let cursor = 0, changed = false, tree, unmounted = false;
  const setter = key => {
    if (!setters.has(key)) setters.set(key, value => { atoms[key] = typeof value === 'function' ? value(atoms[key]) : value; writes.push({ key, value: atoms[key] }); changed = true; });
    return setters.get(key);
  };
  const effectHook = queue => (effect, deps) => {
    const i = cursor++;
    if (!slots[i] || deps.some((value, index) => !Object.is(value, slots[i].deps[index]))) {
      const previous = slots[i]; slots[i] = { deps, effect, isLayout: queue === layoutEffects }; queue.push(() => { previous?.cleanup?.(); slots[i].cleanup = effect(); });
    }
  };
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial; return [slots[i], value => { const next = typeof value === 'function' ? value(slots[i]) : value; stateWrites.push({ value: next, unmounted }); changed ||= !Object.is(slots[i], next); slots[i] = next; }]; },
    useRef(initial) { const i = cursor++; if (!(i in slots)) slots[i] = { current: initial }; return slots[i]; },
    useEffect: effectHook(effects), useLayoutEffect: effectHook(layoutEffects),
  };
  const jsx = (type, props, key) => ({ type, props: props || {}, key });
  const styled = new Proxy(target => () => `styled(${String(target)})`, { get: (_, name) => () => `styled.${String(name)}` });
  const transport = (method, url, body, config) => new Promise((resolve, reject) => requests.push({ method, url, body, config, resolve: data => resolve({ data }), reject }));
  const api = { get: (url, config) => transport('GET', url, undefined, config), post: (url, body, config) => transport('POST', url, body, config), patch: (url, body, config) => transport('PATCH', url, body, config) };
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const requireModule = id => {
      if (id === 'react') return { ...react, __esModule: true, default: react };
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === 'prop-types' || id === 'yup' || id === 'axios') return require(id);
      if (id === 'react-router-dom') return { useNavigate: () => navigate, useSearchParams: () => [new URLSearchParams(search)] };
      if (id === 'recoil') return { atom(config) { if (!Object.hasOwn(atoms, config.key)) atoms[config.key] = structuredClone(config.default); return config.key; }, useRecoilState: key => [atoms[key], setter(key)], useRecoilValue: key => atoms[key], useSetRecoilState: setter };
      if (id.endsWith('/hooks/useDevice')) return { __esModule: true, default: () => ({ isMobile }) };
      if (id.endsWith('/auth/sessionState')) return load(path.resolve(path.dirname(filename), id + '.ts'));
      if (id.endsWith('/auth/authSession')) return { checkAuthSession: config => {
        load(path.join(root, 'src/shared/auth/sessionState.ts')).synchronizeAuthSessionToken();
        return new Promise((resolve, reject) => authChecks.push({ config, resolve, reject }));
      } };
      if (id.includes('app/API')) return { api };
      if (id.includes('/model/') || id.includes('/api/')) return load(path.resolve(path.dirname(filename), id + '.ts'));
      return { __esModule: true, default: id.replace(/\.(jsx|tsx)$/, '') };
    };
    const base = process.env.AUTH_UI_BASELINE;
    const original = base && [path.join(base, path.relative(root, filename)), path.join(base, path.relative(root, filename).replace(/\.(tsx|ts)$/, '.jsx')), path.join(base, path.relative(root, filename).replace(/\.ts$/, '.js'))].find(file => fs.existsSync(file));
    const source = original || filename;
    const code = ts.transpileModule(fs.readFileSync(source, 'utf8').replaceAll('import.meta.env.VITE_SERVER_URL_API', "'https://api.example.test/'"), { fileName: source, compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    vm.runInNewContext(code, { module, exports: module.exports, require: requireModule, window, document: { title: 'Auth UI tests' }, localStorage, console: { log() {}, error: (...args) => errors.push(args) }, alert: message => alerts.push(message), setTimeout: (fn, ms) => { timers.push({ fn, ms, cancelled: false }); return timers.length; }, clearTimeout: id => { if (timers[id - 1]) timers[id - 1].cancelled = true; } }, { filename: source });
    cache.set(filename, module.exports); return module.exports;
  }
  const loaded = load(path.join(root, relative)), component = loaded.default;
  const render = () => { cursor = 0; changed = false; effects.length = 0; layoutEffects.length = 0; tree = component(props); layoutEffects.splice(0).forEach(effect => effect()); effects.splice(0).forEach(effect => effect()); return tree; };
  const nodes = predicate => { const found = []; const visit = node => { if (Array.isArray(node)) return node.forEach(visit); if (!node || typeof node !== 'object') return; if (predicate(node)) found.push(node); visit(node.props?.children); }; visit(tree); return found; };
  const textOf = node => Array.isArray(node) ? node.map(textOf).join('') : node == null || typeof node === 'boolean' ? '' : typeof node === 'object' ? textOf(node.props?.children) : String(node);
  return { loaded, atoms, requests, authChecks, navigation, alerts, errors, timers, stateWrites, writes, cleanedUrls, localStorage, window, render, nodes, textOf,
    text: () => textOf(tree), children: name => nodes(node => String(node.type).endsWith('/' + name)),
    click(label) { const result = nodes(node => node.props.onClick && textOf(node) === label)[0].props.onClick(); render(); return result; },
    update(next) { Object.assign(props, next); return render(); },
    setAtom(key, value) { setter(key)(value); return render(); },
    setSearch(next) { search = next; return render(); },
    input(value) { nodes(node => node.props.onChange)[0].props.onChange({ target: { value } }); return render(); },
    async settle() { for (let i = 0; i < 20; i++) { await flush(); if (unmounted || !changed) return; render(); } throw Error('UI did not settle'); },
    unmount() { unmounted = true; slots.forEach(slot => slot?.cleanup?.()); },
    remount() { slots.length = 0; unmounted = false; return render(); },
    strictReplay() { slots.forEach(slot => slot?.cleanup?.()); for (const layout of [true, false]) for (const slot of slots) if (typeof slot?.effect === 'function' && slot.isLayout === layout) slot.cleanup = slot.effect(); },
    sessionState: () => load(path.join(root, 'src/shared/auth/sessionState.ts')),
  };
}

test('4-30 legacy schemas preserve string fields, password constraints and exact Korean validation messages', async () => {
  const { signupSchema, loginSchema } = mount('src/features/auth/model/authSchema.ts').loaded;
  const valid = { name: '닉네임', email: 'user@example.test', password: 'Abcdefghij12', confirmPassword: 'Abcdefghij12' };
  assert.deepEqual(await signupSchema.validate(valid), valid); assert.deepEqual(await loginSchema.validate({ email: valid.email, password: 'x' }), { email: valid.email, password: 'x' });
  for (const [value, message] of [
    [{ ...valid, name: '' }, '닉네임을 입력해주세요'], [{ ...valid, email: '' }, '이메일을 입력해주세요'], [{ ...valid, email: 'wrong' }, '올바른 이메일 형식을 입력하세요'],
    [{ ...valid, password: '', confirmPassword: '' }, '비밀번호를 입력해주세요'], [{ ...valid, password: 'Abcdefghij1!', confirmPassword: 'Abcdefghij1!' }, '비밀번호에는 특수문자가 포함될 수 없어요'],
    [{ ...valid, password: 'ABCDEFGHIJ12', confirmPassword: 'ABCDEFGHIJ12' }, '비밀번호에는 1개 이상의 소문자가 포함되어야 해요'],
    [{ ...valid, password: 'abcdefghij12', confirmPassword: 'abcdefghij12' }, '비밀번호에는 1개 이상의 대문자가 포함되어야 해요'],
    [{ ...valid, password: 'Abcdefghijkl', confirmPassword: 'Abcdefghijkl' }, '비밀번호에는 1개 이상의 숫자가 포함되어야 해요'],
    [{ ...valid, password: 'Abc12', confirmPassword: 'Abc12' }, '비밀번호는 12자 이상이어야 해요'],
    [{ ...valid, password: 'Abcdefghijklmnopqrstuvwxyz12', confirmPassword: 'Abcdefghijklmnopqrstuvwxyz12' }, '비밀번호는 25자를 넘을 수 없어요'],
    // Yup의 oneOf가 빈 확인 비밀번호에도 먼저 불일치 메시지를 반환한다.
    [{ ...valid, confirmPassword: '' }, '비밀번호가 일치하지 않아요'], [{ ...valid, confirmPassword: 'other' }, '비밀번호가 일치하지 않아요'],
  ]) await assert.rejects(signupSchema.validate(value, { abortEarly: false }), error => error.errors.includes(message));
  await assert.rejects(loginSchema.validate({ email: '', password: '' }, { abortEarly: false }), error => error.errors.includes('이메일을 입력해주세요') && error.errors.includes('비밀번호를 입력해주세요'));
});

test('4-30 nickname check preserves ten-character input, raw payload, success/duplicate labels and backup reset', async () => {
  const m = mount(ui('NicknameSection.tsx')); m.render(); assert.equal(m.nodes(node => node.props.onClick && m.textOf(node) === '닉네임 중복 검사')[0].props.disabled, true);
  m.input('12345678901'); assert.equal(m.nodes(node => node.props.onChange)[0].props.value, '1234567890');
  m.input(' nickname '); const pending = m.click('닉네임 중복 검사'); assert.equal(m.requests[0].url, 'sign-up/nickname'); assert.deepEqual(plain(m.requests[0].body), { nickname: ' nickname ' });
  m.requests[0].resolve({ isAvailable: true }); await pending; await m.settle(); assert.equal(m.atoms.nicknameBackupState, ' nickname '); assert.match(m.text(), /사용 가능한 닉네임/);
  assert.equal(m.nodes(node => node.props.isSuccess !== undefined)[0].props.isSuccess, 'nickname');
  m.input('changed'); assert.equal(m.atoms.nicknameBackupState, ''); assert.equal(m.nodes(node => node.props.isVisible !== undefined)[0].props.isVisible, false);
  const duplicate = m.click('닉네임 중복 검사'); m.requests[1].resolve({ isAvailable: false }); await duplicate; await m.settle(); assert.match(m.text(), /이미 존재하는 닉네임/); assert.equal(m.atoms.nicknameBackupState, '');
});

test('4-30 nickname API failure preserves input and existing guidance, then permits retry and next-stage transition', async () => {
  const m = mount(ui('NicknameSection.tsx')); m.render(); m.input('nickname'); const failed = m.click('닉네임 중복 검사'); m.requests[0].reject(Error('failed')); await failed; await m.settle();
  assert.match(m.text(), /닉네임 중복 검사 중 오류가 발생했습니다/); assert.equal(m.nodes(node => node.props.onChange)[0].props.value, 'nickname');
  const retry = m.click('닉네임 중복 검사'); m.requests[1].resolve({ isAvailable: true }); await retry; await m.settle(); await m.click('다음으로'); assert.equal(m.atoms.signupSectionState, 'agree');
});

test('4-30 OAuth buttons preserve provider URLs and desktop/mobile logo placement; guest navigation stays /home', () => {
  for (const isMobile of [false, true]) {
    const m = mount('src/pages/LoginPage.tsx', { isMobile }); m.render();
    assert.equal(m.nodes(node => String(node.type).includes('textLogo.svg')).length, 1);
    m.click('카카오 계정으로 로그인'); assert.equal(m.window.location.href, 'https://api.example.test/oauth2/authorization/kakao');
    m.click('구글 계정으로 로그인'); assert.equal(m.window.location.href, 'https://api.example.test/oauth2/authorization/google');
    m.click('로그인 없이 둘러보기'); assert.deepEqual(plain(m.navigation), [['/home']]); assert.equal(m.requests.length, 0);
  }
});

test('4-30 auth error alert/navigation run once; signup completion and existing optional modal routes are preserved', () => {
  const failed = mount(ui('AuthError.ts')); failed.render(); failed.render(); assert.deepEqual(failed.alerts, ['에러가 발생하였습니다.']); assert.deepEqual(plain(failed.navigation), [['/login']]);
  const complete = mount(ui('CompleteSection.tsx')); complete.render(); complete.click('성향조사 하기'); complete.click('다음에 할게요'); assert.deepEqual(plain(complete.navigation), [['/survey'], ['/home']]);
  const modal = mount(ui('SignupModal.tsx'), { props: { isOpen: false } }); modal.render(); assert.equal(modal.nodes(node => Object.hasOwn(node.props, 'isOpen'))[0].props.isOpen, false);
  modal.update({ isOpen: true }); modal.click('다음에 할게요'); modal.click('입력하기'); assert.deepEqual(plain(modal.navigation), [['/login'], ['/userInfo']]); modal.update({ isOpen: false });
});

const signupAlert = '회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.';
const memberInfo = () => ({ memberId: 7, nickname: 'nickname', email: 'user@example.test' });
const checkbox = (m, index) => { m.nodes(node => Object.hasOwn(node.props, 'isChecked'))[index].props.onClick(); m.render(); };
const enableSignup = m => { checkbox(m, 1); checkbox(m, 2); };
const submitSignup = m => m.nodes(node => node.props.onClick && m.textOf(node) === '회원가입 완료')[0].props.onClick;
function agreement(storage = { userCode: 'code-a' }) { const m = mount(ui('AgreeSection.tsx'), { storage, values: { nicknameBackupState: 'nickname' } }); m.render(); enableSignup(m); return m; }

test('4-31 signup page retains all three Recoil stages and does not add a request or reset on navigation', () => {
  const m = mount('src/pages/SignupPage.tsx'); m.render(); assert.equal(m.children('NicknameSection').length, 1);
  m.setAtom('signupSectionState', 'agree'); assert.equal(m.children('AgreeSection').length, 1); assert.equal(m.children('NicknameSection').length, 0);
  m.setAtom('signupSectionState', 'complete'); assert.equal(m.children('CompleteSection').length, 1); assert.equal(m.requests.length, 0);
});

test('4-31 callback prioritizes userCode, cleans the URL and keeps successful OAuth token → shared lookup → /home order', async () => {
  const signup = mount(ui('AuthCallback.ts'), { search: '?userCode=code-a&accessToken=ignored' }); signup.render(); await signup.settle();
  assert.equal(signup.localStorage.getItem('userCode'), 'code-a'); assert.equal(signup.localStorage.getItem('accessToken'), null); assert.equal(signup.authChecks.length, 0); assert.deepEqual(plain(signup.navigation), [['/signup']]); assert.equal(signup.cleanedUrls.length, 1);
  const login = mount(ui('AuthCallback.ts'), { search: '?accessToken=oauth-token' }); login.render(); assert.equal(login.localStorage.getItem('accessToken'), 'oauth-token'); assert.equal(login.authChecks.length, 1); assert.deepEqual(plain(login.authChecks[0].config), { force: true }); assert.equal(login.navigation.length, 0);
  login.authChecks[0].resolve(memberInfo()); await login.settle(); assert.deepEqual(plain(login.navigation), [['/home']]); assert.equal(login.cleanedUrls.length, 1);
  const stale = mount(ui('AuthCallback.ts'), { search: '?accessToken=stale-token' }); stale.render(); stale.authChecks[0].resolve(null); await stale.settle(); assert.equal(stale.navigation.length, 0); assert.equal(stale.cleanedUrls.length, 0);
  const empty = mount(ui('AuthCallback.ts')); empty.render(); assert.equal(empty.authChecks.length, 0); assert.equal(empty.navigation.length, 0);
});

test('4-31 agreement required/optional choices preserve the payload and original signup → login → completion order', async () => {
  const m = agreement(); assert.equal(m.nodes(node => node.props.onClick && m.textOf(node) === '회원가입 완료')[0].props.disabled, false);
  const pending = submitSignup(m)(); assert.equal(m.requests.length, 1); assert.equal(m.requests[0].method, 'POST'); assert.equal(m.requests[0].url, 'sign-up');
  assert.deepEqual(plain(m.requests[0].body), { code: 'code-a', nickname: 'nickname', isTermAgreed: true, isPrivacyAgreed: true, isMarketingAgreed: false }); assert.equal(m.authChecks.length, 0);
  m.requests[0].resolve({ accessToken: 'signup-token' }); await m.settle(); assert.equal(m.localStorage.getItem('accessToken'), 'signup-token'); assert.deepEqual(plain(m.authChecks[0].config), { force: true }); assert.notEqual(m.atoms.signupSectionState, 'complete');
  m.authChecks[0].resolve(memberInfo()); await pending; await m.settle(); assert.equal(m.atoms.signupSectionState, 'complete'); assert.deepEqual(m.alerts, []);
  checkbox(m, 0); assert.deepEqual(m.nodes(node => Object.hasOwn(node.props, 'isChecked')).map(node => node.props.isChecked), [true, true, true, true]);
  checkbox(m, 0); assert.deepEqual(m.nodes(node => Object.hasOwn(node.props, 'isChecked')).map(node => node.props.isChecked), [false, false, false, false]);
});

test('signup contract fix: missing userCode skips POST and preserves consent, nickname and token', async () => {
  const m = agreement({ accessToken: 'existing-token' }); const before = m.nodes(node => Object.hasOwn(node.props, 'isChecked')).map(node => node.props.isChecked);
  await submitSignup(m)(); assert.equal(m.requests.length, 0); assert.equal(m.authChecks.length, 0); assert.deepEqual(m.alerts, [signupAlert]); assert.equal(m.atoms.nicknameBackupState, 'nickname'); assert.equal(m.localStorage.getItem('accessToken'), 'existing-token');
  assert.deepEqual(m.nodes(node => Object.hasOwn(node.props, 'isChecked')).map(node => node.props.isChecked), before);
});

test('signup contract fix: missing/empty tokens are signup success with no login, failure alert, token write or repeated POST', async () => {
  for (const response of [{}, { accessToken: '' }]) {
    const m = agreement({ userCode: 'code-a', accessToken: 'existing-token' }), pending = submitSignup(m)();
    m.requests[0].resolve(response); await pending; await m.settle(); assert.equal(m.localStorage.getItem('accessToken'), 'existing-token'); assert.equal(m.authChecks.length, 0); assert.deepEqual(m.alerts, []); assert.notEqual(m.atoms.signupSectionState, 'complete'); assert.equal(m.atoms.nicknameBackupState, 'nickname');
    await submitSignup(m)(); assert.equal(m.requests.length, 1);
    m.unmount(); m.remount(); enableSignup(m); await submitSignup(m)(); assert.equal(m.requests.length, 1); assert.equal(m.localStorage.getItem('accessToken'), 'existing-token');
  }
});

test('signup duplicate fix: calls before state/render share a synchronous lock and successful codes never repeat POST', async () => {
  const m = agreement(), submit = submitSignup(m); const first = submit(), duplicate = submit(); assert.equal(m.requests.length, 1);
  m.requests[0].resolve({ accessToken: 'signup-token' }); await m.settle(); await submit(); assert.equal(m.requests.length, 1); assert.equal(m.authChecks.length, 1);
  m.authChecks[0].resolve(memberInfo()); await Promise.all([first, duplicate]); await m.settle(); await submitSignup(m)(); assert.equal(m.requests.length, 1); assert.equal(m.atoms.signupSectionState, 'complete');
});

test('signup duplicate fix: POST failure permits retry with unchanged fields; post-success member failure cannot repeat signup', async () => {
  const m = agreement(), failed = submitSignup(m)(); m.requests[0].reject(Error('POST failed')); await failed; await m.settle(); assert.deepEqual(m.alerts, [signupAlert]); assert.equal(m.atoms.nicknameBackupState, 'nickname');
  const retry = submitSignup(m)(); assert.equal(m.requests.length, 2); assert.deepEqual(plain(m.requests[1].body), plain(m.requests[0].body));
  m.requests[1].resolve({ accessToken: 'signup-token' }); await m.settle(); m.authChecks[0].reject(Error('member lookup failed')); await retry; await m.settle(); assert.equal(m.alerts.length, 2); assert.equal(m.errors.at(-1)[0], '회원가입 후 자동 로그인 실패:');
  await submitSignup(m)(); assert.equal(m.requests.length, 2); assert.notEqual(m.atoms.signupSectionState, 'complete');
});

test('signup lifetime fix: pending/success records survive remount, while old successful responses cannot log in or navigate', async () => {
  const m = agreement(), old = submitSignup(m)(); m.unmount(); m.remount(); enableSignup(m); await submitSignup(m)(); assert.equal(m.requests.length, 1);
  const writes = m.writes.length, states = m.stateWrites.length;
  m.requests[0].resolve({ accessToken: 'obsolete-token' }); await old; await m.settle(); assert.equal(m.localStorage.getItem('accessToken'), null); assert.equal(m.authChecks.length, 0); assert.equal(m.writes.length, writes); assert.equal(m.stateWrites.length, states); assert.deepEqual(m.alerts, []);
  await submitSignup(m)(); assert.equal(m.requests.length, 1);
  m.localStorage.setItem('userCode', 'code-b'); const fresh = submitSignup(m)(); assert.equal(m.requests.length, 2); m.requests[1].resolve({ accessToken: 'fresh-token' }); await m.settle(); m.authChecks[0].resolve(memberInfo()); await fresh; await m.settle(); assert.equal(m.atoms.signupSectionState, 'complete');
});

test('signup lifetime fix: failure after unmount releases only its own code and permits retry on reentry', async () => {
  const m = agreement(), old = submitSignup(m)(); m.unmount(); m.remount(); enableSignup(m);
  m.requests[0].reject(Error('old POST failed')); await old; await m.settle(); assert.deepEqual(m.alerts, []);
  const retry = submitSignup(m)(); assert.equal(m.requests.length, 2); m.requests[1].resolve({}); await retry; await m.settle(); assert.deepEqual(m.alerts, []);
});

test('signup code races: A → B → A and old finally cannot unlock a new attempt or block another userCode', async () => {
  const m = agreement(), a = submitSignup(m)(); m.localStorage.setItem('userCode', 'code-b'); const b = submitSignup(m)(); assert.equal(m.requests.length, 2);
  m.requests[0].reject(Error('old A')); await a; await m.settle(); await submitSignup(m)(); assert.equal(m.requests.length, 2); assert.deepEqual(m.alerts, []);
  m.localStorage.setItem('userCode', 'code-a'); const latest = submitSignup(m)(); assert.equal(m.requests.length, 3);
  m.requests[1].resolve({ accessToken: 'old-b-token' }); await b; await m.settle(); assert.equal(m.localStorage.getItem('accessToken'), null); await submitSignup(m)(); assert.equal(m.requests.length, 3);
  m.requests[2].resolve({ accessToken: 'latest-a-token' }); await m.settle(); m.authChecks[0].resolve(memberInfo()); await latest; await m.settle(); assert.equal(m.localStorage.getItem('accessToken'), 'latest-a-token'); assert.equal(m.atoms.signupSectionState, 'complete');
  m.localStorage.setItem('userCode', 'code-b'); await submitSignup(m)(); assert.equal(m.requests.length, 3); assert.equal(m.localStorage.getItem('accessToken'), 'latest-a-token');
});

test('signup auth races: another account token supersedes an old signup without being overwritten', async () => {
  const m = agreement(), pending = submitSignup(m)(); m.localStorage.setItem('accessToken', 'different-account-token');
  m.requests[0].resolve({ accessToken: 'obsolete-token' }); await pending; await m.settle(); assert.equal(m.localStorage.getItem('accessToken'), 'different-account-token'); assert.equal(m.authChecks.length, 0); assert.notEqual(m.atoms.signupSectionState, 'complete'); assert.deepEqual(m.alerts, []);
});

test('4-31 mypage keeps its separate profile fetch, ten-character nickname edits, cancel, PATCH payload and navigation', async () => {
  const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); assert.equal(m.requests[0].url, 'members'); assert.equal(m.authChecks.length, 0);
  m.requests[0].resolve(memberInfo()); await m.settle(); assert.match(m.text(), /nickname/); assert.match(m.text(), /user@example.test/);
  const icon = name => m.nodes(node => node.props.onClick && String(node.type).includes(name))[0];
  icon('updateIcon.svg').props.onClick(); m.render(); m.input('12345678901'); assert.equal(m.nodes(node => node.props.onChange)[0].props.value, '1234567890');
  icon('cancelIcon.svg').props.onClick(); m.render(); assert.match(m.text(), /nickname/);
  icon('updateIcon.svg').props.onClick(); m.render(); m.input('new-name'); const pending = icon('checkIcon.svg').props.onClick(); assert.equal(m.requests[1].method, 'PATCH'); assert.equal(m.requests[1].url, '/members/nickname'); assert.deepEqual(plain(m.requests[1].body), { nickname: 'new-name' });
  m.requests[1].resolve('updated'); await pending; await m.settle(); assert.match(m.text(), /new-name/); assert.equal(m.nodes(node => node.props.onChange).length, 0);
  for (const label of ['내 성향조사 수정하기', '예약한 방탈출 관리', '찜해둔 방탈출', '내가 작성한 후기']) m.click(label);
  assert.deepEqual(plain(m.navigation), [['/mypage/preferences'], ['/mypage/reservations'], ['/mypage/favorites'], ['/mypage/reviews']]);
});

test('4-31 mypage retains 409/generic failure guidance, current input, 2000ms error timing and normal retry', async () => {
  for (const error of [{ response: { status: 409 } }, Error('network failure')]) {
    const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); m.requests[0].resolve(memberInfo()); await m.settle();
    m.nodes(node => node.props.onClick && String(node.type).includes('updateIcon.svg'))[0].props.onClick(); m.render(); m.input('new-name');
    const update = () => m.nodes(node => node.props.onClick && String(node.type).includes('checkIcon.svg'))[0].props.onClick();
    const failed = update(); m.requests[1].reject(error); await failed; await m.settle(); assert.match(m.text(), error.response ? /이미 존재하는 닉네임/ : /닉네임 수정 중 오류가 발생했습니다/); assert.equal(m.nodes(node => node.props.onChange)[0].props.value, 'new-name'); assert.equal(m.timers[0].ms, 2000);
    m.timers[0].fn(); await m.settle(); assert.equal(m.nodes(node => Object.hasOwn(node.props, 'errorState'))[0].props.errorState, false);
    const retry = update(); m.requests[2].resolve('updated'); await retry; await m.settle(); assert.equal(m.nodes(node => node.props.onChange).length, 0);
  }
});

test('signup finally fix: an older code completing cannot release or invalidate the current code lock', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = agreement(), old = submitSignup(m)(); m.localStorage.setItem('userCode', 'code-b'); const current = submitSignup(m)();
    if (finish === 'resolve') m.requests[0].resolve({ accessToken: 'obsolete-token' }); else m.requests[0].reject(Error('old code failure'));
    await old; await m.settle(); await submitSignup(m)(); assert.equal(m.requests.length, 2); assert.equal(m.authChecks.length, 0); assert.deepEqual(m.alerts, []);
    m.requests[1].resolve({ accessToken: 'current-token' }); await m.settle(); assert.equal(m.authChecks.length, 1); m.authChecks[0].resolve(memberInfo()); await current; await m.settle();
    assert.equal(m.localStorage.getItem('accessToken'), 'current-token'); assert.equal(m.atoms.signupSectionState, 'complete');
  }
});

test('signup member races: an old member lookup and finally cannot complete or unlock a newer code login', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = agreement(), old = submitSignup(m)(); m.requests[0].resolve({ accessToken: 'token-a' }); await m.settle();
    m.localStorage.setItem('userCode', 'code-b'); const current = submitSignup(m)(); m.requests[1].resolve({ accessToken: 'token-b' }); await m.settle(); assert.equal(m.authChecks.length, 2);
    if (finish === 'resolve') m.authChecks[0].resolve(memberInfo()); else m.authChecks[0].reject(Error('old member lookup failed'));
    await old; await m.settle(); assert.notEqual(m.atoms.signupSectionState, 'complete'); assert.equal(m.localStorage.getItem('accessToken'), 'token-b'); assert.deepEqual(m.alerts, []);
    await submitSignup(m)(); assert.equal(m.requests.length, 2);
    m.authChecks[1].resolve({ ...memberInfo(), memberId: 8 }); await current; await m.settle(); assert.equal(m.atoms.signupSectionState, 'complete');
  }
});

test('signup member lifetime: completion or failure after unmount cannot affect a reentered screen or repeat the successful POST', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = agreement(), old = submitSignup(m)(); m.requests[0].resolve({ accessToken: 'signup-token' }); await m.settle();
    m.unmount(); m.remount(); enableSignup(m); const writes = m.writes.length, states = m.stateWrites.length;
    if (finish === 'resolve') m.authChecks[0].resolve(memberInfo()); else m.authChecks[0].reject(Error('old member lookup failed'));
    await old; await m.settle(); assert.notEqual(m.atoms.signupSectionState, 'complete'); assert.equal(m.writes.length, writes); assert.equal(m.stateWrites.length, states); assert.deepEqual(m.alerts, []);
    await submitSignup(m)(); assert.equal(m.requests.length, 1); assert.equal(m.authChecks.length, 1); assert.equal(m.atoms.nicknameBackupState, 'nickname');
  }
});

// API functions retain their own diagnostics. Only component-level handling
// (along with state/navigation assertions below) must ignore stale failures.
const componentErrors = m => m.errors.filter(([message]) => [
  '닉네임 중복 검사 중 오류 발생:', '로그인 사용자 정보 조회 실패:',
  '닉네임 불러오는 중 오류 발생:', '닉네임 수정 중 오류 발생:',
].includes(message));
const nicknameInput = m => m.nodes(node => node.props.onChange)[0];
const nextNickname = m => m.nodes(node => node.props.onClick && m.textOf(node) === '다음으로')[0];
const profileIcon = (m, name) => m.nodes(node => node.props.onClick && String(node.type).includes(`${name}Icon.svg`))[0].props.onClick;

test('auth races: nickname response for an old input cannot validate the currently displayed input', async () => {
  const m = mount(ui('NicknameSection.tsx')); m.render(); m.input('input-a');
  const pending = m.click('닉네임 중복 검사'); m.input('input-b');
  m.requests[0].resolve({ isAvailable: true }); await pending; await m.settle();
  assert.equal(nicknameInput(m).props.value, 'input-b'); assert.equal(m.atoms.nicknameBackupState, '');
  assert.equal(nextNickname(m).props.disabled, true); assert.equal(m.nodes(node => node.props.isVisible !== undefined)[0].props.isVisible, false);
});

test('auth races: callback unmount blocks late navigation and URL cleanup', async () => {
  const m = mount(ui('AuthCallback.ts'), { search: '?accessToken=local-fixture' }); m.render(); m.unmount();
  m.authChecks[0].resolve(memberInfo()); await m.settle();
  assert.equal(m.navigation.length, 0); assert.equal(m.cleanedUrls.length, 0);
});

test('auth races: initial profile response preserves an active nickname edit while still loading email', async () => {
  const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); profileIcon(m, 'update')(); m.render(); m.input('edited');
  m.requests[0].resolve(memberInfo()); await m.settle();
  assert.equal(nicknameInput(m).props.value, 'edited'); assert.match(m.text(), /user@example.test/);
  profileIcon(m, 'cancel')(); m.render(); assert.match(m.text(), /nickname/); assert.equal(m.requests.length, 1);
});

const checkNickname = m => m.nodes(node => node.props.onClick && m.textOf(node) === '닉네임 중복 검사')[0].props.onClick;
const profileErrors = m => m.nodes(node => Object.hasOwn(node.props, 'errorState'))[0].props.errorState;
const loadedProfile = async () => {
  const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); m.requests[0].resolve(memberInfo()); await m.settle(); return m;
};

test('auth races: nickname A-B-A ignores old success/error and old finally cannot release the latest lock', async () => {
  const m = mount(ui('NicknameSection.tsx')); m.render(); m.input('input-a');
  const old = checkNickname(m)(), duplicate = checkNickname(m)(); assert.equal(m.requests.length, 1);
  m.input('input-b'); const middle = checkNickname(m)(); m.input('input-a'); const current = checkNickname(m)();
  assert.equal(m.requests.length, 3);
  m.requests[0].resolve({ isAvailable: true }); m.requests[1].reject(Error('old failure')); await Promise.all([old, middle, duplicate]); await m.settle();
  assert.equal(m.atoms.nicknameBackupState, ''); assert.equal(componentErrors(m).length, 0); assert.equal(nextNickname(m).props.disabled, true);
  await checkNickname(m)(); assert.equal(m.requests.length, 3);
  m.requests[2].resolve({ isAvailable: true }); await current; await m.settle();
  assert.equal(m.atoms.nicknameBackupState, 'input-a'); assert.equal(nextNickname(m).props.disabled, false);
  await nextNickname(m).props.onClick(); assert.equal(m.atoms.signupSectionState, 'agree');
});

test('auth races: nickname edits invalidate verification and retained next/check handlers before React renders', async () => {
  const m = mount(ui('NicknameSection.tsx')); m.render(); m.input('input-a'); const verified = checkNickname(m)();
  m.requests[0].resolve({ isAvailable: true }); await verified; await m.settle();
  const oldNext = nextNickname(m).props.onClick, oldCheck = checkNickname(m);
  nicknameInput(m).props.onChange({ target: { value: 'input-b' } });
  await oldNext(); assert.notEqual(m.atoms.signupSectionState, 'agree');
  const current = oldCheck(); assert.deepEqual(plain(m.requests[1].body), { nickname: 'input-b' });
  m.render(); assert.equal(nextNickname(m).props.disabled, true);
  m.requests[1].resolve({ isAvailable: true }); await current; await m.settle(); assert.equal(m.atoms.nicknameBackupState, 'input-b');
});

test('auth races: nickname API failure and duplicate response retain raw input and allow a fresh retry', async () => {
  const m = mount(ui('NicknameSection.tsx')); m.render(); m.input(' raw ');
  const pending = checkNickname(m)(); m.requests[0].reject(Error('local failure')); await pending; await m.settle();
  assert.equal(nicknameInput(m).props.value, ' raw '); assert.match(m.text(), /닉네임 중복 검사 중 오류/); assert.equal(nextNickname(m).props.disabled, true);
  const duplicate = checkNickname(m)(); m.requests[1].resolve({ isAvailable: false }); await duplicate; await m.settle();
  assert.match(m.text(), /이미 존재하는 닉네임/); assert.equal(m.atoms.nicknameBackupState, '');
  const retry = checkNickname(m)(); assert.deepEqual(plain(m.requests[2].body), { nickname: ' raw ' });
  m.requests[2].resolve({ isAvailable: true }); await retry; await m.settle(); assert.equal(m.atoms.nicknameBackupState, ' raw ');
});

test('auth races: nickname remount and StrictMode replay ignore old completions and keep the new check locked', async () => {
  for (const lifecycle of ['remount', 'strictReplay']) for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('NicknameSection.tsx')); m.render(); m.input('input-a'); const old = checkNickname(m)();
    if (lifecycle === 'remount') { m.unmount(); m.remount(); m.input('input-a'); } else { m.strictReplay(); m.render(); }
    const current = checkNickname(m)(); const states = m.stateWrites.length, writes = m.writes.length;
    if (finish === 'resolve') m.requests[0].resolve({ isAvailable: true }); else m.requests[0].reject(Error('old failure'));
    await old; await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(m.writes.length, writes); assert.equal(componentErrors(m).length, 0);
    await checkNickname(m)(); assert.equal(m.requests.length, 2);
    m.requests[1].resolve({ isAvailable: true }); await current; await m.settle(); assert.equal(nextNickname(m).props.disabled, false);
  }
});

test('auth races: callback URL A-B-A distinguishes generations even when the token value repeats', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('AuthCallback.ts'), { search: '?accessToken=fixture-a' }); m.render();
    m.setSearch('?accessToken=fixture-b'); m.setSearch('?accessToken=fixture-a'); assert.equal(m.authChecks.length, 3);
    if (finish === 'resolve') m.authChecks[0].resolve(memberInfo()); else m.authChecks[0].reject(Error('old failure'));
    m.authChecks[1].reject(Error('middle failure')); await m.settle();
    assert.equal(m.navigation.length, 0); assert.equal(m.cleanedUrls.length, 0); assert.equal(componentErrors(m).length, 0);
    m.authChecks[2].resolve(memberInfo()); await m.settle(); assert.deepEqual(plain(m.navigation), [['/home']]); assert.equal(m.cleanedUrls.length, 1);
  }
});

test('auth races: callback reentry and StrictMode replay discard obsolete success/error without cancelling shared auth', async () => {
  for (const lifecycle of ['remount', 'strictReplay']) for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('AuthCallback.ts'), { search: '?accessToken=fixture-a' }); m.render();
    if (lifecycle === 'remount') { m.unmount(); m.remount(); } else m.strictReplay();
    assert.equal(m.authChecks.length, 2);
    if (finish === 'resolve') m.authChecks[0].resolve(memberInfo()); else m.authChecks[0].reject(Error('old failure'));
    await m.settle(); assert.equal(m.navigation.length, 0); assert.equal(m.cleanedUrls.length, 0); assert.equal(componentErrors(m).length, 0);
    m.authChecks[1].resolve(memberInfo()); await m.settle(); assert.deepEqual(plain(m.navigation), [['/home']]); assert.equal(m.cleanedUrls.length, 1);
  }
});

test('auth races: switching a pending callback to signup keeps the new userCode route and ignores old outcomes', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount(ui('AuthCallback.ts'), { search: '?accessToken=fixture-a' }); m.render();
    m.setSearch('?userCode=fixture-code'); assert.equal(m.authChecks.length, 1); assert.deepEqual(plain(m.navigation), [['/signup']]);
    if (finish === 'resolve') m.authChecks[0].resolve(memberInfo()); else m.authChecks[0].reject(Error('old failure'));
    await m.settle(); assert.deepEqual(plain(m.navigation), [['/signup']]); assert.equal(m.cleanedUrls.length, 1); assert.equal(componentErrors(m).length, 0);
  }
});

test('auth races: current callback failure preserves its prior guidance/redirect and reentry can retry normally', async () => {
  const m = mount(ui('AuthCallback.ts'), { search: '?accessToken=fixture-a' }); m.render();
  m.authChecks[0].reject(Error('current failure')); await m.settle(); assert.equal(componentErrors(m).length, 1); assert.deepEqual(plain(m.navigation), [['/home']]);
  m.unmount(); m.remount(); assert.equal(m.authChecks.length, 2);
  m.authChecks[1].resolve(memberInfo()); await m.settle(); assert.deepEqual(plain(m.navigation), [['/home'], ['/home']]); assert.equal(m.requests.length, 0);
});

test('auth races: callback unmount suppresses late failure logging and URL writes', async () => {
  const m = mount(ui('AuthCallback.ts'), { search: '?accessToken=fixture-a' }); m.render(); m.unmount();
  m.authChecks[0].reject(Error('old failure')); await m.settle(); assert.equal(componentErrors(m).length, 0); assert.equal(m.navigation.length, 0); assert.equal(m.cleanedUrls.length, 0);
});

test('auth races: profile StrictMode replay rejects the first read success/error and performs no edit-triggered GET', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); m.strictReplay(); assert.equal(m.requests.length, 2);
    const states = m.stateWrites.length;
    if (finish === 'resolve') m.requests[0].resolve(memberInfo()); else m.requests[0].reject(Error('old failure'));
    await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(componentErrors(m).length, 0);
    m.requests[1].resolve({ ...memberInfo(), nickname: 'latest' }); await m.settle(); assert.match(m.text(), /latest/);
    profileIcon(m, 'update')(); m.render(); m.input('edit-a'); m.input('edit-b'); m.input('edit-a');
    assert.equal(nicknameInput(m).props.value, 'edit-a'); assert.equal(m.requests.length, 2); assert.equal(m.authChecks.length, 0);
  }
});

test('auth races: a current profile read failure is retryable on reentry with no polling added', async () => {
  const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); m.requests[0].reject(Error('current failure')); await m.settle(); assert.equal(componentErrors(m).length, 1);
  m.unmount(); m.remount(); assert.equal(m.requests.length, 2); m.requests[1].resolve(memberInfo()); await m.settle(); assert.match(m.text(), /nickname/);
  m.render(); m.render(); assert.equal(m.requests.length, 2);
});

test('auth races: a profile read predating a successful nickname PATCH cannot restore the old nickname or cancel baseline', async () => {
  const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); profileIcon(m, 'update')(); m.render(); m.input('saved');
  const save = profileIcon(m, 'check')(); assert.deepEqual(plain(m.requests[1].body), { nickname: 'saved' });
  m.requests[1].resolve('updated'); await save; await m.settle();
  m.requests[0].resolve(memberInfo()); await m.settle(); assert.equal(m.nodes(node => node.props.onChange).length, 0); assert.match(m.text(), /saved/);
  profileIcon(m, 'update')(); m.render(); m.input('abandoned'); profileIcon(m, 'cancel')(); m.render(); assert.match(m.text(), /saved/);
});

test('auth races: profile PATCH A-B-A uses synchronous locks and old success/error/finally cannot affect the newest edit', async () => {
  const m = await loadedProfile(); profileIcon(m, 'update')(); m.render(); m.input('edit-a');
  const submit = profileIcon(m, 'check'), old = submit(), duplicate = submit(); assert.equal(m.requests.length, 2);
  m.input('edit-b'); const middle = profileIcon(m, 'check')(); m.input('edit-a'); const current = profileIcon(m, 'check')(); assert.equal(m.requests.length, 4);
  m.requests[1].resolve('old success'); m.requests[2].reject({ response: { status: 409 } }); await Promise.all([old, middle, duplicate]); await m.settle();
  assert.equal(nicknameInput(m).props.value, 'edit-a'); assert.equal(profileErrors(m), false); assert.equal(componentErrors(m).length, 0); assert.equal(m.timers.length, 0);
  await profileIcon(m, 'check')(); assert.equal(m.requests.length, 4);
  m.requests[3].resolve('updated'); await current; await m.settle(); assert.equal(m.nodes(node => node.props.onChange).length, 0); assert.match(m.text(), /edit-a/);
});

test('auth races: cancelling and reopening the same profile edit cannot be closed or unlocked by an older PATCH', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = await loadedProfile(); profileIcon(m, 'update')(); m.render(); m.input('edit-a'); const old = profileIcon(m, 'check')();
    profileIcon(m, 'cancel')(); m.render(); profileIcon(m, 'update')(); m.render(); m.input('edit-a'); const current = profileIcon(m, 'check')();
    if (finish === 'resolve') m.requests[1].resolve('old success'); else m.requests[1].reject(Error('old failure'));
    await old; await m.settle(); assert.equal(nicknameInput(m).props.value, 'edit-a'); assert.equal(profileErrors(m), false); assert.equal(componentErrors(m).length, 0);
    await profileIcon(m, 'check')(); assert.equal(m.requests.length, 3);
    m.requests[2].resolve('updated'); await current; await m.settle(); assert.equal(m.nodes(node => node.props.onChange).length, 0);
  }
});

test('auth races: profile failures keep input/retry and an old error timer cannot clear the latest failure', async () => {
  const m = await loadedProfile(); profileIcon(m, 'update')(); m.render(); m.input('edit-a');
  const first = profileIcon(m, 'check')(); m.requests[1].reject({ response: { status: 409 } }); await first; await m.settle();
  assert.equal(nicknameInput(m).props.value, 'edit-a'); assert.equal(profileErrors(m), true); assert.equal(m.timers[0].ms, 2000);
  const retry = profileIcon(m, 'check')(); assert.equal(m.timers[0].cancelled, true); const states = m.stateWrites.length;
  m.timers[0].fn(); assert.equal(m.stateWrites.length, states); m.requests[2].reject(Error('current failure')); await retry; await m.settle();
  assert.equal(profileErrors(m), true); m.timers[0].fn(); await m.settle(); assert.equal(profileErrors(m), true); assert.equal(m.timers[1].cancelled, false);
  m.timers[1].fn(); await m.settle(); assert.equal(profileErrors(m), false);
  const success = profileIcon(m, 'check')(); assert.deepEqual(plain(m.requests[3].body), plain(m.requests[1].body)); m.requests[3].resolve('updated'); await success; await m.settle();
  assert.equal(m.nodes(node => node.props.onChange).length, 0);
});

test('auth races: profile unmount suppresses read/write outcomes and cancels even an already queued error timer', async () => {
  for (const phase of ['read', 'write', 'timer']) for (const finish of ['resolve', 'reject']) {
    const m = phase === 'read' ? mount('src/pages/myPage/MyPage.tsx') : await loadedProfile();
    let pending;
    if (phase === 'read') m.render(); else {
      profileIcon(m, 'update')(); m.render(); m.input('edit-a'); pending = profileIcon(m, 'check')();
      if (phase === 'timer') { m.requests[1].reject(Error('current failure')); await pending; await m.settle(); }
    }
    m.unmount(); const states = m.stateWrites.length, errors = componentErrors(m).length;
    if (phase === 'timer') { assert.equal(m.timers[0].cancelled, true); m.timers[0].fn(); }
    else {
      const request = m.requests[phase === 'read' ? 0 : 1];
      if (finish === 'resolve') request.resolve(phase === 'read' ? memberInfo() : 'updated'); else request.reject(Error('old failure'));
      if (pending) await pending;
    }
    await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(componentErrors(m).length, errors);
  }
});


test('auth races: profile read A-B-A lifetimes cannot write into a reentered active edit', async () => {
  for (const finish of ['resolve', 'reject']) {
    const m = mount('src/pages/myPage/MyPage.tsx'); m.render();
    m.unmount(); m.remount(); m.unmount(); m.remount(); assert.equal(m.requests.length, 3);
    profileIcon(m, 'update')(); m.render(); m.input('edited-a'); const states = m.stateWrites.length;
    m.requests[0].resolve({ ...memberInfo(), nickname: 'old-a' });
    if (finish === 'resolve') m.requests[1].resolve({ ...memberInfo(), nickname: 'old-b' }); else m.requests[1].reject(Error('old failure'));
    await m.settle(); assert.equal(m.stateWrites.length, states); assert.equal(componentErrors(m).length, 0); assert.equal(nicknameInput(m).props.value, 'edited-a');
    m.requests[2].resolve({ ...memberInfo(), nickname: 'latest-a' }); await m.settle(); assert.equal(nicknameInput(m).props.value, 'edited-a');
    profileIcon(m, 'cancel')(); m.render(); assert.match(m.text(), /latest-a/); assert.equal(m.requests.length, 3);
  }
});

test('auth races: a failed edit during initial loading preserves input and the late read remains the cancel baseline', async () => {
  const m = mount('src/pages/myPage/MyPage.tsx'); m.render(); profileIcon(m, 'update')(); m.render(); m.input('edited');
  const save = profileIcon(m, 'check')(); m.requests[1].reject({ response: { status: 409 } }); await save; await m.settle();
  m.requests[0].resolve(memberInfo()); await m.settle(); assert.equal(nicknameInput(m).props.value, 'edited'); assert.equal(profileErrors(m), true);
  profileIcon(m, 'cancel')(); m.render(); assert.match(m.text(), /nickname/); assert.equal(profileErrors(m), false);
  assert.equal(m.requests.length, 2);
});
