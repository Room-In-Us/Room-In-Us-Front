const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const axios = require('axios');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');

const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

const flush = () => new Promise((resolve) => setImmediate(resolve));
const member = (memberId = 1, nickname = 'current') => ({
  memberId,
  nickname,
  email: `member${memberId}@example.test`,
});

function loadComponentHandler(relative, name, bindings) {
  const filename = path.join(root, relative);
  const source = ts.createSourceFile(
    filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.JSX,
  );
  let initializer;
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) {
      initializer = node.initializer;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  assert.ok(initializer, `${relative} exports an executable ${name} closure`);
  return vm.runInNewContext(`(${initializer.getText(source)})`, bindings, { filename });
}

function createEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
    },
    dispatchEvent(event) {
      for (const listener of [...(listeners.get(event.type) || [])]) {
        listener(event);
      }
      return true;
    },
    listenerCount(type) {
      return listeners.get(type)?.size || 0;
    },
  };
}

function createStorage() {
  const items = new Map();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
    clear: () => items.clear(),
  };
}

// Every request goes through this adapter; the test process never uses HTTP.
function createHarness(respond = () => ({ status: 200, data: member() })) {
  let now = 1_000_000;
  const requests = [];
  const localStorage = createStorage();
  const sessionStorage = createStorage();
  const window = Object.assign(createEventTarget(), {
    location: { pathname: '/', href: 'https://app.example.test/' },
    localStorage,
    sessionStorage,
    dataLayer: [],
  });
  const document = Object.assign(createEventTarget(), {
    visibilityState: 'visible',
  });
  const hookSubscriptions = [];
  const react = {
    useSyncExternalStore(subscribe, getSnapshot) {
      const subscription = {
        getSnapshot,
        subscribe,
        notifications: 0,
        notify() {
          subscription.notifications += 1;
        },
      };
      subscription.unsubscribe = subscribe(subscription.notify);
      hookSubscriptions.push(subscription);
      return getSnapshot();
    },
  };
  const adapter = async (config) => {
    const request = {
      method: config.method,
      url: config.url,
      authorization: config.headers.get('Authorization'),
      config,
    };
    requests.push(request);
    const reply = await respond(request, requests);
    const response = {
      status: reply.status ?? 200,
      data: reply.data,
      statusText: String(reply.status ?? 200),
      headers: {},
      config,
    };
    if (config.validateStatus && !config.validateStatus(response.status)) {
      throw new axios.AxiosError(
        `Mock response ${response.status}`,
        axios.AxiosError.ERR_BAD_REQUEST,
        config,
        undefined,
        response,
      );
    }
    return response;
  };
  const mockAxios = {
    ...axios,
    create: (config) => axios.create({ ...config, adapter }),
  };
  class ClockDate extends Date {
    static now() {
      return now;
    }
  }
  const context = vm.createContext({
    console: { log() {}, error() {}, warn() {} },
    window,
    document,
    localStorage,
    sessionStorage,
    Event,
    Date: ClockDate,
    setTimeout,
    clearTimeout,
    queueMicrotask,
  });
  const cache = new Map();

  function load(relative, importer = path.join(root, 'index.js')) {
    if (relative === 'axios') return mockAxios;
    if (relative === 'react') return react;
    if (!relative.startsWith('.') && !path.isAbsolute(relative)) {
      throw new Error(`Unexpected external test dependency: ${relative}`);
    }
    const base = path.isAbsolute(relative)
      ? relative
      : path.resolve(path.dirname(importer), relative);
    const filename = [base, `${base}.ts`, `${base}.js`, `${base}.tsx`, `${base}.jsx`]
      .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(filename, `Module exists: ${base}`);
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const source = fs.readFileSync(filename, 'utf8')
      .replaceAll('import.meta.env.VITE_SERVER_URL_API', "'https://api.example.test/'");
    const compiled = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        esModuleInterop: true,
      },
    }).outputText;
    const execute = new vm.Script(
      `(function(require, module, exports) {\n${compiled}\n})`,
      { filename },
    ).runInContext(context);
    execute((specifier) => load(specifier, filename), module, module.exports);
    return module.exports;
  }

  const loadSource = (relative) => load(path.join(root, relative));
  return {
    requests,
    localStorage,
    window,
    document,
    load: loadSource,
    state: () => loadSource('src/shared/auth/sessionState.ts'),
    session: () => loadSource('src/shared/auth/authSession.ts'),
    advance: (milliseconds) => { now += milliseconds; },
    emit: (target, type, fields = {}) => target.dispatchEvent({ type, ...fields }),
    memberRequests: () => requests.filter(({ url }) => url === 'members'),
    refreshRequests: () => requests.filter(({ url }) => url === 'access-token'),
    mountHooks(count) {
      const useAuthSession = loadSource('src/shared/hooks/useAuthSession.js').default;
      return Array.from({ length: count }, () => useAuthSession());
    },
    replayStrictModeSubscriptions() {
      for (const subscription of hookSubscriptions) subscription.unsubscribe();
      for (const subscription of hookSubscriptions) {
        subscription.unsubscribe = subscription.subscribe(subscription.notify);
      }
    },
    unmountHooks() {
      for (const subscription of hookSubscriptions) subscription.unsubscribe();
    },
    hookSubscriptions,
  };
}

test('30 hook subscriptions and StrictMode replay share one initial check', async () => {
  const pending = deferred();
  const harness = createHarness(() => pending.promise);
  harness.mountHooks(30);
  harness.replayStrictModeSubscriptions();
  await flush();
  assert.equal(harness.memberRequests().length, 1);
  assert.equal(harness.state().getAuthSessionSnapshot(), null);
  pending.resolve({ status: 200, data: member() });
  await flush();
  assert.equal(harness.state().getAuthSessionSnapshot(), true);
  assert.equal(harness.hookSubscriptions.every(({ getSnapshot }) => getSnapshot() === true), true);
  harness.mountHooks(5);
  await flush();
  assert.equal(harness.memberRequests().length, 1, 'new cards reuse the checked session');
  harness.advance(120_000);
  harness.mountHooks(1);
  await flush();
  assert.equal(harness.memberRequests().length, 1, 'elapsed time and card mounts never poll');
  for (const type of ['focus', 'storage']) {
    assert.equal(harness.window.listenerCount(type), 1);
  }
  assert.equal(harness.document.listenerCount('visibilitychange'), 1);
  harness.unmountHooks();
  assert.equal(harness.window.listenerCount('focus'), 0);
  assert.equal(harness.window.listenerCount('storage'), 0);
  assert.equal(harness.window.listenerCount('accessTokenRefreshed'), 0);
  assert.equal(harness.document.listenerCount('visibilitychange'), 0);
});

test('focus and visibility use a 60-second completion TTL, including failures', async () => {
  let next = { status: 200, data: member() };
  const harness = createHarness(() => next);
  harness.mountHooks(2);
  await flush();
  harness.advance(59_999);
  harness.emit(harness.window, 'focus');
  harness.emit(harness.document, 'visibilitychange');
  await flush();
  assert.equal(harness.memberRequests().length, 1);
  harness.advance(1);
  const pending = deferred();
  next = pending.promise;
  harness.emit(harness.window, 'focus');
  harness.emit(harness.document, 'visibilitychange');
  await flush();
  assert.equal(harness.memberRequests().length, 2);
  assert.equal(harness.state().getAuthSessionSnapshot(), true, 'background check keeps existing state');
  pending.resolve({ status: 401, data: {} });
  await flush();
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  assert.equal(harness.state().getAuthSessionCheckedAt(), 1_060_000);
  harness.emit(harness.window, 'focus');
  harness.emit(harness.document, 'visibilitychange');
  await flush();
  assert.equal(harness.memberRequests().length, 2, 'failed checks also receive the TTL');
  harness.advance(60_000);
  next = { status: 200, data: member() };
  harness.document.visibilityState = 'hidden';
  harness.emit(harness.document, 'visibilitychange');
  await flush();
  assert.equal(harness.memberRequests().length, 2, 'hidden tabs do not revalidate');
  harness.document.visibilityState = 'visible';
  harness.emit(harness.document, 'visibilitychange');
  await flush();
  assert.equal(harness.memberRequests().length, 3);
  assert.equal(harness.state().getAuthSessionSnapshot(), true);
  harness.unmountHooks();
});

test('the 60-second TTL starts when the check completes, rather than when it starts', async () => {
  const pending = deferred();
  const harness = createHarness(() => pending.promise);
  harness.mountHooks(1);
  await flush();
  harness.advance(120_000);
  pending.resolve({ status: 200, data: member() });
  await flush();
  assert.equal(harness.state().getAuthSessionCheckedAt(), 1_120_000);
  harness.advance(59_999);
  harness.emit(harness.window, 'focus');
  await flush();
  assert.equal(harness.memberRequests().length, 1);
  harness.unmountHooks();
});

test('access-token refresh events never generate a new members check', async () => {
  const harness = createHarness();
  harness.mountHooks(3);
  await flush();
  harness.advance(120_000);
  harness.emit(harness.window, 'accessTokenRefreshed');
  await flush();
  assert.equal(harness.memberRequests().length, 1);
  harness.unmountHooks();
});

test('login page skips both automatic and forced checks', async () => {
  const harness = createHarness();
  harness.window.location.pathname = '/login';
  harness.mountHooks(2);
  await flush();
  assert.equal(harness.memberRequests().length, 0);
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  await harness.session().checkAuthSession({ force: true });
  assert.equal(harness.memberRequests().length, 0);
  harness.unmountHooks();
});

for (const pathname of ['/auth/callback', '/signup']) {
  test(`${pathname} force-check shares the login or signup member lookup`, async () => {
    const pending = deferred();
    const harness = createHarness(() => pending.promise);
    harness.window.location.pathname = pathname;
    harness.localStorage.setItem('accessToken', 'signed-in-token');
    harness.state().beginAuthSession();
    harness.mountHooks(3);
    const first = harness.session().checkAuthSession({ force: true });
    const second = harness.session().checkAuthSession({ force: true });
    assert.equal(first, second);
    await flush();
    assert.equal(harness.memberRequests().length, 1);
    pending.resolve({ status: 200, data: member() });
    assert.equal((await first).memberId, 1);
    assert.equal((await second).memberId, 1);
    assert.equal(harness.hookSubscriptions.every(({ getSnapshot }) => getSnapshot() === true), true);
    harness.unmountHooks();
  });
}

test('logout ignores a pending member response and immediately updates every subscriber', async () => {
  const pending = deferred();
  const harness = createHarness(() => pending.promise);
  harness.localStorage.setItem('accessToken', 'old');
  harness.localStorage.setItem('userCode', 'old-user');
  harness.mountHooks(4);
  await flush();
  const generation = harness.state().getAuthSessionGeneration();
  harness.session().clearAuthSession();
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  assert.equal(harness.state().isAuthSessionCurrent(generation), false);
  assert.equal(harness.localStorage.getItem('accessToken'), null);
  assert.equal(harness.localStorage.getItem('userCode'), null);
  assert.equal(harness.hookSubscriptions.every(({ getSnapshot }) => getSnapshot() === false), true);
  pending.resolve({ status: 200, data: member(1, 'old') });
  await flush();
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  harness.unmountHooks();
});

test('a new account has an independent in-flight check and ignores the old response', async () => {
  const old = deferred();
  const current = deferred();
  let count = 0;
  const harness = createHarness(() => (++count === 1 ? old.promise : current.promise));
  const first = harness.session().checkAuthSession({ force: true });
  await flush();
  harness.localStorage.setItem('accessToken', 'new-account');
  harness.state().beginAuthSession();
  const second = harness.session().checkAuthSession({ force: true });
  await flush();
  assert.equal(harness.memberRequests().length, 2);
  current.resolve({ status: 200, data: member(2, 'new') });
  assert.equal((await second).memberId, 2);
  old.resolve({ status: 200, data: member(1, 'old') });
  assert.equal(await first, null);
  assert.equal(harness.state().getAuthSessionSnapshot(), true);
  assert.equal(harness.localStorage.getItem('accessToken'), 'new-account');
});

test('other-tab token changes update all subscribers with one shared check', async () => {
  let count = 0;
  const harness = createHarness(() => ({ status: 200, data: member(++count) }));
  harness.mountHooks(30);
  await flush();
  harness.localStorage.setItem('accessToken', 'another-account');
  harness.emit(harness.window, 'storage', {
    key: 'accessToken', storageArea: harness.sessionStorage,
  });
  harness.emit(harness.window, 'storage', {
    key: 'unrelated-key', storageArea: harness.localStorage,
  });
  await flush();
  assert.equal(harness.memberRequests().length, 1, 'unrelated storage changes are ignored');
  const previousGeneration = harness.state().getAuthSessionGeneration();
  harness.emit(harness.window, 'storage', {
    key: 'accessToken', storageArea: harness.localStorage,
  });
  harness.emit(harness.window, 'storage', {
    key: 'accessToken', storageArea: harness.localStorage,
  });
  await flush();
  assert.equal(harness.memberRequests().length, 2);
  assert.equal(harness.state().getAuthSessionGeneration(), previousGeneration + 1);
  assert.equal(harness.hookSubscriptions.every(({ getSnapshot }) => getSnapshot() === true), true);
  harness.localStorage.clear();
  harness.emit(harness.window, 'storage', {
    key: null, storageArea: harness.localStorage,
  });
  assert.equal(harness.hookSubscriptions.every(({ getSnapshot }) => getSnapshot() === false), true);
  await flush();
  assert.equal(harness.memberRequests().length, 2, 'remote logout does not fetch member data');
  harness.unmountHooks();
});

test('remote logout invalidates a pending recheck even when cached auth state is already false', async () => {
  const pending = deferred();
  let count = 0;
  const harness = createHarness(() => (++count === 1
    ? { status: 503, data: {} }
    : pending.promise));
  harness.localStorage.setItem('accessToken', 'old-session');
  harness.mountHooks(1);
  await flush();
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  harness.advance(60_000);
  harness.emit(harness.window, 'focus');
  await flush();
  assert.equal(harness.memberRequests().length, 2);
  const generation = harness.state().getAuthSessionGeneration();
  harness.localStorage.removeItem('accessToken');
  harness.emit(harness.window, 'storage', {
    key: 'accessToken', storageArea: harness.localStorage,
  });
  assert.equal(harness.state().isAuthSessionCurrent(generation), false);
  pending.resolve({ status: 200, data: member() });
  await flush();
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  harness.unmountHooks();
});

for (const retryStatus of [200, 401]) {
  test(`401 refresh retries only the original request; retry ${retryStatus} cannot loop`, async () => {
    let memberCount = 0;
    const harness = createHarness(({ url }) => {
      if (url === 'access-token') return { status: 200, data: { accessToken: 'fresh' } };
      memberCount += 1;
      return memberCount === 1
        ? { status: 401, data: {} }
        : { status: retryStatus, data: member() };
    });
    harness.localStorage.setItem('accessToken', 'expired');
    harness.mountHooks(30);
    await flush();
    await flush();
    assert.equal(harness.refreshRequests().length, 1);
    assert.equal(harness.memberRequests().length, 2);
    assert.equal(harness.state().getAuthSessionSnapshot(), retryStatus === 200);
    assert.equal(harness.memberRequests()[1].authorization, 'Bearer fresh');
    harness.advance(10_000);
    await flush();
    assert.equal(harness.memberRequests().length, 2);
    assert.equal(harness.refreshRequests().length, 1);
    harness.unmountHooks();
  });
}

for (const oldRefreshStatus of [200, 401]) {
  test(`old refresh ${oldRefreshStatus} cannot overwrite a new session or its refresh queue`, async () => {
    const oldRefresh = deferred();
    const newRefresh = deferred();
    let refreshCount = 0;
    const attempts = new Map();
    const harness = createHarness(({ url, authorization }) => {
      if (url === 'access-token') {
        refreshCount += 1;
        return refreshCount === 1 ? oldRefresh.promise : newRefresh.promise;
      }
      attempts.set(url, (attempts.get(url) || 0) + 1);
      return authorization === 'Bearer new-fresh'
        ? { status: 200, data: { url } }
        : { status: 401, data: {} };
    });
    const { api } = harness.load('src/app/API.ts');
    harness.localStorage.setItem('accessToken', 'old-expired');
    const oldFirst = api.get('old-first').then(() => 'fulfilled', () => 'rejected');
    const oldQueued = api.get('old-queued').then(() => 'fulfilled', () => 'rejected');
    await flush();
    assert.equal(harness.refreshRequests().length, 1);

    harness.localStorage.setItem('accessToken', 'new-expired');
    harness.state().beginAuthSession();
    const generation = harness.state().getAuthSessionGeneration();
    harness.state().completeAuthSessionCheck(generation, true);
    const newFirst = api.get('new-first');
    const newQueued = api.get('new-queued');
    await flush();
    assert.equal(harness.refreshRequests().length, 2);

    oldRefresh.resolve({ status: oldRefreshStatus, data: { accessToken: 'stale-token' } });
    assert.equal(await oldFirst, 'rejected');
    assert.equal(await oldQueued, 'rejected');
    assert.equal(harness.localStorage.getItem('accessToken'), 'new-expired');
    assert.equal(harness.state().getAuthSessionSnapshot(), true);
    assert.equal(attempts.get('new-queued'), 1, 'old queue draining cannot retry the new queue');

    newRefresh.resolve({ status: 200, data: { accessToken: 'new-fresh' } });
    await Promise.all([newFirst, newQueued]);
    assert.equal(harness.localStorage.getItem('accessToken'), 'new-fresh');
    assert.equal(attempts.get('new-first'), 2);
    assert.equal(attempts.get('new-queued'), 2);
    assert.equal(harness.state().getAuthSessionSnapshot(), true);
  });
}

test('refresh failure updates shared state and removes only current-session credentials', async () => {
  const harness = createHarness(({ url }) => ({
    status: 401,
    data: url === 'access-token' ? {} : member(),
  }));
  harness.localStorage.setItem('accessToken', 'expired');
  harness.localStorage.setItem('userCode', 'user');
  harness.mountHooks(3);
  await flush();
  await flush();
  assert.equal(harness.memberRequests().length, 1);
  assert.equal(harness.refreshRequests().length, 1);
  assert.equal(harness.state().getAuthSessionSnapshot(), false);
  assert.equal(harness.localStorage.getItem('accessToken'), null);
  assert.equal(harness.localStorage.getItem('userCode'), null);
  const failedGeneration = harness.state().getAuthSessionGeneration();
  harness.advance(59_999);
  harness.emit(harness.window, 'focus');
  await flush();
  assert.equal(harness.memberRequests().length, 1, 'refresh failure preserves the failed-check TTL');
  assert.equal(harness.state().getAuthSessionGeneration(), failedGeneration);
  harness.unmountHooks();
});

test('ordinary member profile requests remain uncached and return the latest nickname', async () => {
  let count = 0;
  const harness = createHarness(() => ({ status: 200, data: member(1, `nickname-${++count}`) }));
  await harness.session().checkAuthSession({ force: true });
  const { getMemberInfoAPI } = harness.load('src/features/auth/api/memberAPI.ts');
  const first = await getMemberInfoAPI();
  const second = await getMemberInfoAPI();
  assert.equal(first.nickname, 'nickname-2');
  assert.equal(second.nickname, 'nickname-3');
  assert.equal(harness.memberRequests().length, 3);
});

test('requests capture the session generation synchronously before an immediate account change', async () => {
  const pending = deferred();
  const harness = createHarness(() => pending.promise);
  harness.localStorage.setItem('accessToken', 'old-account-token');
  const { api } = harness.load('src/app/API.ts');
  const generation = harness.state().getAuthSessionGeneration();
  const request = api.get('protected-call').then(() => null, (error) => error);
  assert.equal(harness.requests.length, 1, 'the request interceptor executes before api.get returns');
  assert.equal(harness.requests[0].config.__authSessionGeneration, generation);

  harness.localStorage.setItem('accessToken', 'new-account-token');
  harness.state().beginAuthSession();
  pending.resolve({ status: 401, data: {} });
  const error = await request;
  assert.equal(axios.isCancel(error), true);
  assert.equal(harness.refreshRequests().length, 0, 'the stale 401 cannot refresh the new account');
  assert.equal(harness.localStorage.getItem('accessToken'), 'new-account-token');
});

for (const component of ['Header', 'HeaderProfileModal']) {
  test(`${component} ignores a late logout completion after a new login`, async () => {
    const harness = createHarness();
    harness.localStorage.setItem('accessToken', 'old-account-token');
    harness.localStorage.setItem('userCode', 'old-account-code');
    const state = harness.state();
    const session = harness.session();
    state.completeAuthSessionCheck(state.getAuthSessionGeneration(), true);
    let pendingLogout = deferred();
    let logoutCalls = 0;
    let clearedAnalytics = 0;
    const alerts = [];
    const redirects = [];
    harness.window.location.replace = (location) => redirects.push(location);
    const handleLogout = loadComponentHandler(`src/shared/components/${component}.jsx`, 'handleLogout', {
      ...state,
      clearAuthSession: session.clearAuthSession,
      postLogoutAPI: () => {
        logoutCalls += 1;
        return pendingLogout.promise;
      },
      clearTrackedUserId: () => { clearedAnalytics += 1; },
      alert: (message) => alerts.push(message),
      window: harness.window,
      console: { error() {} },
    });
    const oldGeneration = state.getAuthSessionGeneration();
    const logout = handleLogout();
    assert.equal(logoutCalls, 1);
    assert.equal(state.isAuthSessionCurrent(oldGeneration), false, 'logout invalidates pending auth checks immediately');
    assert.equal(state.getAuthSessionSnapshot(), false);

    harness.localStorage.setItem('accessToken', 'new-account-token');
    harness.localStorage.setItem('userCode', 'new-account-code');
    const newGeneration = state.beginAuthSession();
    state.completeAuthSessionCheck(newGeneration, true);
    pendingLogout.resolve('logout completed');
    await logout;
    assert.equal(harness.localStorage.getItem('accessToken'), 'new-account-token');
    assert.equal(harness.localStorage.getItem('userCode'), 'new-account-code');
    assert.equal(state.getAuthSessionSnapshot(), true);
    assert.equal(clearedAnalytics, 0);
    assert.equal(alerts.length, 0);
    assert.equal(redirects.length, 0);

    pendingLogout = deferred();
    const currentLogout = handleLogout();
    pendingLogout.resolve('logout completed');
    await currentLogout;
    assert.equal(harness.localStorage.getItem('accessToken'), null, 'a current-session logout still clears credentials');
    assert.equal(harness.localStorage.getItem('userCode'), null);
    assert.equal(state.getAuthSessionSnapshot(), false);
    assert.equal(clearedAnalytics, 1);
    assert.equal(alerts.length, 1);
    assert.deepEqual(redirects, ['/login']);
  });
}

function createAuthFlow(harness, flow) {
  const redirects = [];
  const cleanedUrls = [];
  const alerts = [];
  const signupSections = [];
  const signupPayloads = [];
  harness.window.location.pathname = flow === 'callback' ? '/auth/callback' : '/signup';
  harness.window.history = {
    replaceState: (state, title, pathname) => cleanedUrls.push(pathname),
  };
  harness.document.title = 'Test application';
  const bindings = {
    ...harness.state(),
    checkAuthSession: harness.session().checkAuthSession,
    userCode: null,
    accessToken: 'authenticated-token',
    localStorage: harness.localStorage,
    window: harness.window,
    document: harness.document,
    navigate: (destination) => redirects.push(destination),
    console: { error() {}, log() {} },
    nicknameBackup: 'new-member',
    agreeTerms: true,
    agreePrivacy: true,
    agreeMarketing: false,
    postSignupAPI: async (payload) => {
      signupPayloads.push(payload);
      return { accessToken: 'authenticated-token' };
    },
    setSignupSection: (section) => signupSections.push(section),
    alert: (message) => alerts.push(message),
  };
  const handler = flow === 'callback'
    ? loadComponentHandler('src/features/auth/ui/AuthCallback.jsx', 'handleAuthCallback', bindings)
    : loadComponentHandler('src/features/auth/ui/AgreeSection.jsx', 'onSubmit', bindings);
  return { handler, redirects, cleanedUrls, alerts, signupSections, signupPayloads };
}

for (const flow of ['callback', 'signup']) {
  test(`${flow} preserves its existing failure flow when member lookup and refresh fail`, async () => {
    const harness = createHarness(() => ({ status: 401, data: {} }));
    const ui = createAuthFlow(harness, flow);
    await ui.handler();
    assert.equal(harness.memberRequests().length, 1);
    assert.equal(harness.refreshRequests().length, 1);
    assert.equal(harness.state().getAuthSessionSnapshot(), false);
    assert.equal(harness.localStorage.getItem('accessToken'), null);
    if (flow === 'callback') {
      assert.deepEqual(ui.cleanedUrls, ['/auth/callback']);
      assert.deepEqual(ui.redirects, ['/home']);
    } else {
      assert.equal(ui.signupPayloads.length, 1, 'signup uses a local mock rather than a real POST');
      assert.deepEqual(ui.signupSections, []);
      assert.deepEqual(ui.alerts, ['회원가입 중 문제가 발생했습니다. 다시 시도해 주세요.']);
    }
  });

  test(`${flow} silently ignores stale member lookup results after an account change`, async () => {
    const pending = deferred();
    const harness = createHarness(() => pending.promise);
    const ui = createAuthFlow(harness, flow);
    const operation = ui.handler();
    await flush();
    assert.equal(harness.memberRequests().length, 1);
    const state = harness.state();
    harness.localStorage.setItem('accessToken', 'different-account-token');
    const newGeneration = state.beginAuthSession();
    state.completeAuthSessionCheck(newGeneration, true);
    pending.resolve({ status: 401, data: {} });
    await operation;
    assert.equal(harness.refreshRequests().length, 0);
    assert.equal(harness.localStorage.getItem('accessToken'), 'different-account-token');
    assert.equal(state.getAuthSessionSnapshot(), true);
    assert.deepEqual(ui.cleanedUrls, []);
    assert.deepEqual(ui.redirects, []);
    assert.deepEqual(ui.alerts, []);
    assert.deepEqual(ui.signupSections, []);
  });
}

test('token writes from another tab invalidate an old member response before its storage event arrives', async () => {
  const oldMember = deferred();
  let count = 0;
  const harness = createHarness(() => (++count === 1
    ? oldMember.promise
    : { status: 200, data: member(2, 'new-account') }));
  harness.localStorage.setItem('accessToken', 'old-account-token');
  harness.mountHooks(3);
  await flush();
  assert.equal(harness.memberRequests().length, 1);
  harness.localStorage.setItem('accessToken', 'new-account-token');
  oldMember.resolve({ status: 200, data: member(1, 'old-account') });
  await flush();
  await flush();
  harness.emit(harness.window, 'storage', {
    key: 'accessToken', storageArea: harness.localStorage,
  });
  await flush();
  assert.equal(harness.memberRequests().length, 2, 'the new account receives its own member lookup');
  assert.equal(harness.memberRequests()[1].authorization, 'Bearer new-account-token');
  assert.equal(harness.state().getAuthSessionSnapshot(), true);
  assert.deepEqual(
    Array.from(harness.window.dataLayer, ({ user_id }) => user_id),
    ['2'],
    'the old account must never be reported as the new login',
  );
  harness.unmountHooks();
});
