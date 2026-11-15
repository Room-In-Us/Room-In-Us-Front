const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/features/location/ui/StationCard.tsx'), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
const plain = value => JSON.parse(JSON.stringify(value));
const store = (storeId = 10) => ({
  storeId, storeName: `매장 ${storeId}`, isAwarded: false, themeCount: 3,
  latitude: 37.5, longitude: 127.1,
});

function compile(text, fileName) {
  return ts.transpileModule(text, {
    fileName,
    compilerOptions: {
      target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;
}

// The real location API functions use deferred local responses. No HTTP is sent.
function mount({ region = 1, zone = 1, page = 1, mobile = false, previousStores = [] } = {}) {
  const atoms = {
    selectedLocationRegionId: region, zoneId: zone, storePageNumber: page,
    stationCardVisible: true, storeCardVisible: false, locationStoreId: null,
    zoneName: '잠실', storeCount: 2, themeCount: 3,
    centerLatAndLng: { lat: 37, lng: 127 }, storeInfoList: previousStores, zoomLevel: 12,
  };
  const setters = new Map(), slots = [], requests = [], writes = [], errors = [];
  let cursor = 0, pending = [], changed = false, tree;
  const setAtom = (key, value) => {
    const next = typeof value === 'function' ? value(atoms[key]) : value;
    if (!Object.is(atoms[key], next)) changed = true;
    atoms[key] = next;
    writes.push({ atom: key, value: next });
  };
  const react = {
    useState(initial) {
      const index = cursor++;
      if (!(index in slots)) slots[index] = initial;
      return [slots[index], value => {
        const next = typeof value === 'function' ? value(slots[index]) : value;
        if (!Object.is(slots[index], next)) changed = true;
        slots[index] = next;
        writes.push({ state: index, value: next });
      }];
    },
    useEffect(effect, deps) {
      const index = cursor++;
      if (!slots[index]?.deps || deps.some((value, i) => !Object.is(value, slots[index].deps[i]))) {
        const previous = slots[index];
        slots[index] = { deps };
        pending.push(() => { previous?.cleanup?.(); slots[index].cleanup = effect(); });
      }
    },
  };
  const api = {
    get(url, options) {
      let resolve, reject;
      const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
      requests.push({ url, options, resolve, reject });
      return promise;
    },
  };
  const apiModule = { exports: {} };
  vm.runInNewContext(compile(
    fs.readFileSync(path.join(root, 'src/features/location/api/locationAPI.ts'), 'utf8'),
    'locationAPI.ts',
  ), {
    module: apiModule, exports: apiModule.exports, require: () => ({ api }),
    console: { log() {}, error() {} },
  });
  const styled = new Proxy(() => () => 'styled', { get: () => () => 'styled' });
  const jsx = (type, props, key) => ({ type, props: props || {}, key });
  const module = { exports: {} };
  vm.runInNewContext(compile(source, 'StationCard.tsx'), {
    module, exports: module.exports,
    require(id) {
      if (id === 'react') return react;
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx };
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === 'recoil') return {
        useRecoilState(key) {
          if (!setters.has(key)) setters.set(key, value => setAtom(key, value));
          return [atoms[key], setters.get(key)];
        },
      };
      if (id.includes('locationAtom')) return new Proxy({}, { get: (_, key) => key });
      if (id.includes('locationAPI')) return apiModule.exports;
      if (id.includes('useDevice')) return { __esModule: true, default: () => ({ isMobile: mobile }) };
      if (id.includes('stationLineUtils')) return { stationLineConversion: () => () => null };
      return { __esModule: true, default: () => null };
    },
    console: { log() {}, error(...args) { errors.push(args[0]); } },
  });
  const render = () => {
    cursor = 0; pending = []; changed = false;
    tree = module.exports.default();
    pending.forEach(effect => effect());
    return tree;
  };
  const find = predicate => {
    const result = [];
    const visit = node => {
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (!node || typeof node !== 'object') return;
      if (predicate(node)) result.push(node);
      visit(node.props?.children);
    };
    visit(tree);
    return result;
  };
  const text = node => {
    if (Array.isArray(node)) return node.map(text).join('');
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    return typeof node === 'object' ? text(node.props?.children) : String(node);
  };
  const pages = () => find(node => typeof node.props.isActive === 'boolean' && node.key !== undefined);
  return {
    render, find, atoms, requests, writes, errors,
    pageNumbers: () => pages().map(node => node.key),
    arrows: () => find(node => typeof node.props.hasNextPage === 'boolean'),
    text: () => text(tree),
    listRequests: () => requests.filter(request => request.url.startsWith('stores/')),
    infoRequests: () => requests.filter(request => request.url.includes('zone-info')),
    updateAtoms(values) { Object.entries(values).forEach(([key, value]) => setAtom(key, value)); render(); },
    setMobile(value) { mobile = value; render(); },
    clickText(value) {
      const matches = find(node => typeof node.props.onClick === 'function' && text(node) === value);
      assert.equal(matches.length, 1, `Expected one clickable ${value}`);
      matches[0].props.onClick(); render();
    },
    clickPage(page) { pages().find(node => node.key === page).props.onClick(); render(); },
    async settle() {
      for (let i = 0; i < 12; i++) {
        await flush();
        if (!changed) return;
        render();
      }
      throw Error('Component did not settle');
    },
    unmount() { slots.forEach(value => value?.cleanup?.()); },
  };
}

function replyList(request, { pages = 3, stores = [store()], lat = 37.5, lng = 127.1 } = {}) {
  request.resolve({ data: { latitudeAvg: lat, longitudeAvg: lng, storeData: { totalPages: pages, contents: stores } } });
}

function replyInfo(request, stationName = '잠실역') {
  request.resolve({ data: { zoneName: '잠실', stationList: [{ stationId: 1, stationName, stationLineList: [2] }] } });
}

test('valid Seoul, Seoul-other and capital IDs preserve API URLs, parameters and zoom', async () => {
  for (const mobile of [false, true]) {
    for (const [region, zone, url, zoom] of [
      [1, 1, 'stores/regions/1/zones/1', 16],
      [null, 1, 'stores/regions/1/zones/1', 16],
      [1, 0, 'stores/regions/1/zones/0/stores', 14],
      [2, 17, 'stores/regions/2/zones/17/stores', 14],
    ]) {
      const m = mount({ region, zone, mobile }); m.render();
      assert.deepEqual(m.pageNumbers(), [1]);
      assert.equal(m.listRequests()[0].url, url);
      assert.deepEqual(plain(m.listRequests()[0].options.params), {
        page: 1, size: mobile ? 6 : 10, sortOption: 'RECOMMEND',
      });
      if (zone === 1) replyInfo(m.infoRequests()[0]);
      replyList(m.listRequests()[0]); await m.settle();
      assert.deepEqual(m.pageNumbers(), [1, 2, 3]);
      assert.equal(m.atoms.zoomLevel, zoom);
      assert.deepEqual(plain(m.atoms.centerLatAndLng), { lat: 37.5, lng: 127.1 });
      m.unmount();
    }
  }
});

test('missing required IDs send no request and clear old stores, page numbers and navigation', async () => {
  for (const mobile of [false, true]) {
    for (const [region, zone] of [[null, null], [2, null], [null, 0], [null, 17]]) {
      const m = mount({ region, zone, mobile, page: 3, previousStores: [store()] });
      m.render();
      assert.equal(m.text().includes('매장 10'), false);
      assert.deepEqual(m.pageNumbers(), []);
      assert.deepEqual(m.arrows().map(node => node.props.hasNextPage), [false, false]);
      await m.settle();
      assert.equal(m.requests.length, 0);
      assert.equal(m.atoms.storeInfoList.length, 0);
      assert.equal(m.atoms.storePageNumber, 1);
      assert.deepEqual(m.pageNumbers(), []);
      assert.deepEqual(m.arrows().map(node => node.props.hasNextPage), [false, false]);
      assert.equal(m.text().includes('매장 10'), false);
      m.unmount();
    }
  }
});

test('a loaded list is cleared when a required zone or region becomes null', async () => {
  for (const [region, zone, missing] of [[1, 1, { zoneId: null }], [2, 17, { selectedLocationRegionId: null }]]) {
    const m = mount({ region, zone, page: 2 }); m.render();
    replyList(m.listRequests()[0]); await m.settle();
    assert.equal(m.text().includes('매장 10'), true);
    m.updateAtoms(missing);
    assert.equal(m.text().includes('매장 10'), false);
    assert.deepEqual(m.pageNumbers(), []);
    await m.settle();
    assert.equal(m.listRequests().length, 1);
    assert.equal(m.atoms.storeInfoList.length, 0);
    assert.equal(m.atoms.storePageNumber, 1);
    assert.deepEqual(m.pageNumbers(), []);
    assert.deepEqual(m.arrows().map(node => node.props.hasNextPage), [false, false]);
    m.unmount();
  }
});

test('a response arriving after an ID becomes null cannot restore stores, pages, center or station info', async () => {
  for (const [region, zone, missing] of [[1, 1, { zoneId: null }], [2, 17, { selectedLocationRegionId: null }]]) {
    const m = mount({ region, zone }); m.render();
    const oldList = m.listRequests()[0], oldInfo = m.infoRequests()[0];
    m.updateAtoms(missing); await m.settle();
    const writeCount = m.writes.length;
    replyList(oldList, { pages: 9, stores: [store(99)], lat: 1, lng: 2 });
    if (oldInfo) replyInfo(oldInfo, '이전역');
    await m.settle();
    assert.equal(m.writes.length, writeCount);
    assert.equal(m.atoms.storeInfoList.length, 0);
    assert.deepEqual(m.pageNumbers(), []);
    assert.deepEqual(plain(m.atoms.centerLatAndLng), { lat: 37, lng: 127 });
    assert.equal(m.atoms.zoomLevel, 12);
    m.unmount();
  }
});

test('late responses cannot overwrite a newer Seoul/capital zone or region selection', async () => {
  for (const [regionA, zoneA, regionB, zoneB] of [[1, 1, 1, 2], [1, 1, 2, 17], [2, 17, 1, 1], [2, 17, 1, 0], [2, 17, 1, 17]]) {
    const m = mount({ region: regionA, zone: zoneA }); m.render();
    const oldList = m.listRequests()[0], oldInfo = m.infoRequests()[0];
    m.updateAtoms({ selectedLocationRegionId: regionB, zoneId: zoneB, zoneName: '현재 구역' });
    const currentList = m.listRequests().at(-1), currentInfo = m.infoRequests().at(-1);
    replyList(currentList, { pages: 2, stores: [store(20)], lat: 40, lng: 130 });
    if (currentInfo && currentInfo !== oldInfo) replyInfo(currentInfo, '현재역');
    await m.settle();
    const writeCount = m.writes.length;
    replyList(oldList, { pages: 9, stores: [store(99)], lat: 1, lng: 2 });
    if (oldInfo) replyInfo(oldInfo, '이전역');
    await m.settle();
    assert.equal(m.writes.length, writeCount);
    assert.equal(m.atoms.storeInfoList[0].storeId, 20);
    assert.deepEqual(m.pageNumbers(), [1, 2]);
    assert.deepEqual(plain(m.atoms.centerLatAndLng), { lat: 40, lng: 130 });
    assert.equal(m.atoms.zoomLevel, zoneB > 0 && zoneB < 17 ? 16 : 14);
    assert.equal(m.text().includes('이전역'), false);
    m.unmount();
  }
});

test('switching A to B to A rejects the first A response even though its IDs match again', async () => {
  const m = mount(); m.render();
  const first = m.listRequests()[0];
  m.updateAtoms({ zoneId: 2 }); const middle = m.listRequests().at(-1);
  m.updateAtoms({ zoneId: 1 });
  replyList(m.listRequests().at(-1), { pages: 2, stores: [store(20)] }); await m.settle();
  const writeCount = m.writes.length;
  replyList(first, { pages: 9, stores: [store(99)] }); replyList(middle, { stores: [store(30)] });
  await m.settle();
  assert.equal(m.writes.length, writeCount);
  assert.equal(m.atoms.storeInfoList[0].storeId, 20);
  assert.deepEqual(m.pageNumbers(), [1, 2]);
  m.unmount();
});

test('page, sort and viewport changes preserve arguments and ignore superseded responses', async () => {
  const m = mount(); m.render(); replyList(m.listRequests()[0]); await m.settle();
  m.clickPage(2); const oldPage = m.listRequests().at(-1);
  m.clickText('추천 순'); m.clickText('테마 많은 순'); const oldSort = m.listRequests().at(-1);
  m.setMobile(true);
  assert.deepEqual(plain(m.listRequests().at(-1).options.params), { page: 2, size: 6, sortOption: 'MANY_THEME' });
  replyList(m.listRequests().at(-1), { pages: 4, stores: [store(20)] }); await m.settle();
  const writeCount = m.writes.length;
  replyList(oldPage, { stores: [store(99)] }); replyList(oldSort, { stores: [store(30)] }); await m.settle();
  assert.equal(m.writes.length, writeCount);
  assert.equal(m.atoms.storeInfoList[0].storeId, 20);
  assert.equal(m.atoms.storePageNumber, 2);
  assert.deepEqual(m.pageNumbers(), [1, 2, 3, 4]);
  m.unmount();
});

test('unmount prevents pending list and station responses from writing state', async () => {
  const m = mount(); m.render(); m.unmount();
  const writeCount = m.writes.length;
  replyList(m.listRequests()[0]); replyInfo(m.infoRequests()[0]); await m.settle();
  assert.equal(m.writes.length, writeCount);
});

test('valid loading, failure, store click and mobile back preserve the existing UI contract', async () => {
  for (const mobile of [false, true]) {
    const m = mount({ page: 3, mobile, previousStores: [store()] }); m.render();
    assert.deepEqual(m.pageNumbers(), [1]);
    assert.deepEqual(m.arrows().map(node => node.props.hasNextPage), [true, false]);
    m.listRequests()[0].reject(Error('Local mock failure')); await m.settle();
    assert.deepEqual(m.pageNumbers(), [1]);
    assert.equal(m.atoms.storeInfoList[0].storeId, 10);
    assert.equal(m.errors.length, 1);
    if (mobile) {
      m.clickText('지역 선택으로 돌아가기');
      assert.equal(m.atoms.stationCardVisible, false);
      assert.equal(m.atoms.storeCardVisible, false);
      assert.equal(m.atoms.zoneId, 1);
    } else {
      m.clickText('매장 10(3)');
      assert.equal(m.atoms.locationStoreId, 10);
      assert.equal(m.atoms.storeCardVisible, true);
      assert.equal(m.atoms.stationCardVisible, false);
      assert.equal(m.atoms.zoomLevel, 18);
    }
    m.unmount();
  }
});

test('empty successful results preserve zero page numbers', async () => {
  const m = mount(); m.render(); replyList(m.listRequests()[0], { pages: 0, stores: [] }); await m.settle();
  assert.deepEqual(m.pageNumbers(), []);
  assert.equal(m.atoms.storeInfoList.length, 0);
  assert.deepEqual(m.arrows().map(node => node.props.hasNextPage), [false, false]);
  m.unmount();
});

test('invalid numeric totalPages retain the existing Array RangeError', async () => {
  for (const pages of [-1, 1.5, NaN, Infinity]) {
    const m = mount(); m.render(); replyList(m.listRequests()[0], { pages });
    await assert.rejects(m.settle(), error => error.name === 'RangeError');
    m.unmount();
  }
});
