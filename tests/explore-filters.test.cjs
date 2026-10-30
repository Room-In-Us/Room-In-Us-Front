const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const flush = () => new Promise(resolve => setImmediate(resolve));
const regions = [
  { regionId: 1, regionName: '서울', storeCount: 2 },
  { regionId: 2, regionName: '경기/인천', storeCount: 1 },
];
const zones = {
  1: [
    { zoneId: 11, zoneName: '강남', storeCount: 1, themeCount: 1 },
    { zoneId: 12, zoneName: '홍대', storeCount: 1, themeCount: 1 },
  ],
  2: [{ zoneId: 21, zoneName: '수원', storeCount: 1, themeCount: 1 }],
};
const theme = themeId => ({
  themeId, locationName: '강남', awardsYear: null, img: '', satisfactionLevel: null,
  level: 2, playTime: 60, storeName: '테스트 매장', themeName: `테마 ${themeId}`,
  isLiked: false, genreList: [], price: themeId === 2 ? null : 10000, maxHeadcount: 6,
});

// All API modules use this local transport. No HTTP, browser or credentials are used.
function mount(relative, { mobile = false, props = {}, ref = null, themes = Array.from({ length: 18 }, (_, i) => theme(i + 1)) } = {}) {
  let cursor = 0, pending = [], tree, changed = true;
  const slots = [], requests = [], navigation = [], recoilWrites = [];
  const cache = new Map();
  let result = themes, failure = false;
  const jsx = (type, props, key) => ({ type, props: props || {}, key });
  const styled = new Proxy(() => () => 'styled', { get: () => () => 'styled' });
  const dependenciesEqual = (a, b) => a && b && a.length === b.length && a.every((value, i) => Object.is(value, b[i]));
  const react = {
    useState(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [slots[i], value => {
        const next = typeof value === 'function' ? value(slots[i]) : value;
        if (!Object.is(slots[i], next)) changed = true;
        slots[i] = next;
      }];
    },
    useRef(initial) {
      const i = cursor++;
      if (!(i in slots)) slots[i] = { current: initial };
      return slots[i];
    },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!dependenciesEqual(slots[i]?.deps, deps)) {
        const previous = slots[i];
        slots[i] = { deps };
        pending.push(() => { previous?.cleanup?.(); slots[i].cleanup = fn(); });
      }
    },
    useImperativeHandle(target, factory) {
      if (typeof target === 'function') target(factory());
      else if (target) target.current = factory();
    },
    forwardRef: fn => (props, ref) => fn(props, ref),
    memo: fn => fn,
  };
  const api = {
    async get(url, options = {}) {
      requests.push({ url, params: options.params });
      if (failure && url.startsWith('themes/')) throw Error('mock API failure');
      if (url.startsWith('themes/')) return { data: { contents: result } };
      if (url === 'location/regions') return { data: regions };
      const match = url.match(/^location\/regions\/(\d+)\/zones$/);
      if (match) return { data: zones[match[1]] };
      throw Error(`Unexpected API request: ${url}`);
    },
  };
  const navigate = (...args) => navigation.push(args);
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename);
    const module = { exports: {} };
    const requireModule = id => {
      if (id === 'react') return react;
      if (id === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' };
      if (id === 'styled-components') return { __esModule: true, default: styled };
      if (id === 'prop-types') return require('prop-types');
      if (id === 'react-router-dom') return { useNavigate: () => navigate };
      if (id === 'recoil') return {
        useRecoilValue: atom => atom === 'level' ? 'BEGINNER' : 'SENTIMENTAL',
        useSetRecoilState: () => value => recoilWrites.push(value),
      };
      if (id.includes('app/API')) return { api };
      if (id.includes('useDevice')) return { __esModule: true, default: () => ({ isMobile: mobile }) };
      if (id.includes('useAuthSession')) return { __esModule: true, default: () => false };
      if (id.includes('useDropDown')) return { __esModule: true, default: () => ({
        isOpen: true, toggleDropdown() {}, position: { top: 0, left: 0 },
        triggerRef: { current: null }, dropdownRef: { current: null }, reset() {},
      }) };
      if (id.includes('genreAtom')) return { activeGenreState: 'genre' };
      if (id.includes('levelAtom')) return { activeLevelState: 'level' };
      if (id.includes('scheduleAtom')) return { scheduleModalState: 'schedule' };
      if (id.includes('/styles/')) return new Proxy({}, { get: (_, key) => String(key) });
      if (id.includes('/utils/')) return {
        formatNumberWithCommas: String, levelTextConversion: String,
        genreListConversion: () => [], satisfactionConversion: String,
      };
      if (id.includes('themeLikeAPI')) return {
        postThemeLikeAPI() { throw Error('Mutation API must not be invoked'); },
        deleteThemeLikeAPI() { throw Error('Mutation API must not be invoked'); },
      };
      if (/API$|Data$|OptionList$/.test(id)) {
        return load(path.resolve(path.dirname(filename), id + '.ts'));
      }
      return { __esModule: true, default: id };
    };
    const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      fileName: filename,
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    vm.runInNewContext(output, {
      require: requireModule, module, exports: module.exports,
      document: { body: { style: {} } }, console: { log() {}, error() {} },
    }, { filename });
    cache.set(filename, module.exports);
    return module.exports;
  }
  const component = load(path.join(root, relative)).default;
  const render = () => {
    cursor = 0; pending = []; changed = false;
    tree = component(props, ref); pending.forEach(fn => fn()); return tree;
  };
  const find = predicate => {
    const matches = [];
    const visit = node => {
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (!node || typeof node !== 'object') return;
      if (predicate(node)) matches.push(node);
      visit(node.props?.children);
    };
    visit(tree); return matches;
  };
  return {
    render, find, requests, navigation, recoilWrites,
    updateProps(values) { props = { ...props, ...values }; changed = true; },
    child: name => find(node => String(node.type).endsWith('/' + name))[0],
    async settle() {
      render();
      for (let i = 0; i < 12; i++) {
        await flush();
        if (!changed) return;
        render();
      }
      throw Error('Component failed to settle');
    },
    setThemes(value) { result = value; }, setFailure(value) { failure = value; },
    unmount() { slots.forEach(value => value?.cleanup?.()); },
  };
}

const plain = value => JSON.parse(JSON.stringify(value));
const lastQuery = m => plain(m.requests.filter(request => request.url.startsWith('themes/')).at(-1).params);
const sheetProps = overrides => ({
  isOpen: true, isLocationPage: false, onClose() {}, onApply() {}, onReset() {},
  selectedPeople: 2, selectedSort: 'HIGH_SATISFACTION_LEVEL',
  selectedRegion: '서울 전체', selectedZones: [], zoneList: [], activeRegionId: 1,
  regions, zones: zones[1], isAllZoneSelected: true,
  onTabClick() {}, onRegionSelect() {}, onRegionAllClick() {}, onTabAllClick() {}, onZoneSelect() {},
  setHeadCount() {}, setSelectedSort() {}, setSelectedRegion() {},
  loadZones: async regionId => zones[regionId].map(zone => ({ ...zone, regionId })),
  ...overrides,
});

for (const [feature, title] of [['genre', 'Genre'], ['level', 'Level']]) {
  const relative = `src/features/${feature}/ui/${title}ContentSection.tsx`;
  test(`${feature}: desktop and mobile lists preserve prices, themeId keys and pagination`, async () => {
    for (const mobile of [false, true]) {
      const m = mount(relative, { mobile }); await m.settle();
      const cards = () => m.find(node => String(node.type).endsWith('/ContentCard'));
      assert.equal(cards().length, mobile ? 4 : 16);
      assert.deepEqual(cards().map(node => node.key), Array.from({ length: mobile ? 4 : 16 }, (_, i) => i + 1));
      assert.equal(cards()[0].props.data.price, 20000);
      assert.equal(cards()[1].props.data.price, null);
      const pagination = () => m.child('CustomPagination').props;
      pagination().onPageChange(0); await m.settle(); assert.equal(pagination().currentPage, 1);
      pagination().onPageChange(2); await m.settle(); assert.equal(cards()[0].key, mobile ? 5 : 17);
      if (!mobile) {
        assert.equal(typeof m.child('RegionFilter').props.isAllZoneSelected, 'boolean');
        m.child('PeopleFilter').props.onSelect(4); await m.settle();
        assert.equal(lastQuery(m).headcount, 4); assert.equal(pagination().currentPage, 1);
        assert.equal(cards()[0].props.data.price, 40000);
        m.child('SortFilter').props.onSelect('LOW_PRICE'); await m.settle();
        assert.equal(lastQuery(m).sortOption, 'LOW_PRICE');
      }
      m.unmount();
    }
  });

  test(`${feature}: region all, per-region all and zone toggling keep API IDs consistent`, async () => {
    const m = mount(relative); await m.settle();
    const region = () => m.child('RegionFilter').props;
    await region().onZoneSelect('강남'); await m.settle();
    assert.equal(lastQuery(m).regionId, 1); assert.equal(lastQuery(m).zoneIdList, '11');
    await region().onZoneSelect('홍대'); await m.settle();
    assert.equal(lastQuery(m).zoneIdList, '11,12');
    await region().onZoneSelect('강남'); await m.settle();
    assert.equal(lastQuery(m).zoneIdList, '12');
    await region().onZoneSelect('홍대'); await m.settle();
    assert.equal(Object.hasOwn(lastQuery(m), 'zoneIdList'), false);
    assert.equal(Object.hasOwn(lastQuery(m), 'regionId'), false);
    assert.equal(region().selectedRegion, '지역 전체');
    assert.equal(region().isAllZoneSelected, false);
    region().onTabClick(2); await m.settle();
    await region().onTabAllClick(2, '경기/인천 전체'); await m.settle();
    assert.equal(lastQuery(m).regionId, 2); assert.equal(Object.hasOwn(lastQuery(m), 'zoneIdList'), false);
    assert.equal(region().isAllZoneSelected, true);
    await region().onZoneSelect('수원'); await m.settle();
    await region().onZoneSelect('수원'); await m.settle();
    assert.equal(region().selectedRegion, '지역 전체');
    assert.equal(region().isAllZoneSelected, false);
    assert.equal(Object.hasOwn(lastQuery(m), 'regionId'), false);
    assert.equal(Object.hasOwn(lastQuery(m), 'zoneIdList'), false);
    region().onRegionAllClick(); await m.settle();
    assert.equal(Object.hasOwn(lastQuery(m), 'regionId'), false);
    assert.equal(Object.hasOwn(lastQuery(m), 'zoneIdList'), false);
    await region().onZoneSelect('강남'); await m.settle();
    m.unmount();
  });

  test(`${feature}: mobile changes and reset reach the list API only on apply`, async () => {
    const m = mount(relative, { mobile: true }); await m.settle();
    const listCount = () => m.requests.filter(request => request.url.startsWith('themes/')).length;
    const open = async () => { m.find(node => typeof node.props.onClick === 'function')[0].props.onClick(); await m.settle(); };
    await open();
    const sheet = mount('src/shared/components/BottomSheet.tsx', { mobile: true, props: m.child('BottomSheet').props });
    await sheet.settle();
    const initialCount = listCount();
    sheet.child('PeopleFilter').props.onSelect(3); await sheet.settle();
    sheet.find(node => node.props.children === '정렬')[0].props.onClick(); await sheet.settle();
    sheet.child('SortFilter').props.onSelect('LOW_PRICE'); await sheet.settle();
    sheet.find(node => node.props.children === '지역')[0].props.onClick(); await sheet.settle();
    sheet.child('RegionFilter').props.onZoneSelect('강남'); await sheet.settle(); await m.settle();
    assert.equal(listCount(), initialCount);
    assert.equal(m.child('BottomSheet').props.selectedRegion, '지역 전체');
    sheet.find(node => node.props.children === '필터 적용하기')[0].props.onClick(); await m.settle();
    assert.equal(lastQuery(m).headcount, 3); assert.equal(lastQuery(m).sortOption, 'LOW_PRICE');
    assert.equal(lastQuery(m).zoneIdList, '11');
    assert.equal(listCount(), initialCount + 1);
    sheet.updateProps(m.child('BottomSheet').props); await sheet.settle();
    await open(); sheet.updateProps(m.child('BottomSheet').props); await sheet.settle();
    sheet.find(node => String(node.props.src).includes('reset.svg'))[0].props.onClick(); await sheet.settle(); await m.settle();
    assert.equal(listCount(), initialCount + 1);
    assert.equal(m.child('BottomSheet').props.selectedRegion, '강남');
    sheet.find(node => node.props.children === '필터 적용하기')[0].props.onClick(); await m.settle();
    assert.equal(m.child('BottomSheet').props.selectedRegion, '지역 전체');
    assert.deepEqual(plain(m.child('BottomSheet').props.selectedZones), []);
    assert.equal(m.child('BottomSheet').props.isAllZoneSelected, false);
    assert.equal(lastQuery(m).headcount, 2); assert.equal(lastQuery(m).sortOption, 'HIGH_SATISFACTION_LEVEL');
    assert.equal(Object.hasOwn(lastQuery(m), 'regionId'), false);
    assert.equal(Object.hasOwn(lastQuery(m), 'zoneIdList'), false);
    assert.equal(listCount(), initialCount + 2);
    sheet.updateProps(m.child('BottomSheet').props); await sheet.settle();
    await open(); sheet.updateProps(m.child('BottomSheet').props); await sheet.settle();
    sheet.child('RegionFilter').props.onTabClick(2); await sheet.settle();
    sheet.child('RegionFilter').props.onZoneSelect('수원'); await sheet.settle(); await m.settle();
    assert.equal(listCount(), initialCount + 2);
    sheet.find(node => node.props.children === '필터 적용하기')[0].props.onClick(); await m.settle();
    assert.equal(lastQuery(m).regionId, 2); assert.equal(lastQuery(m).zoneIdList, '21');
    sheet.updateProps(m.child('BottomSheet').props); await sheet.settle();
    await open(); sheet.updateProps(m.child('BottomSheet').props); await sheet.settle();
    sheet.child('RegionFilter').props.onZoneSelect('수원'); await sheet.settle(); await m.settle();
    assert.equal(listCount(), initialCount + 3);
    sheet.find(node => node.props.children === '필터 적용하기')[0].props.onClick(); await m.settle();
    assert.equal(m.child('BottomSheet').props.selectedRegion, '지역 전체');
    assert.equal(m.child('BottomSheet').props.isAllZoneSelected, false);
    assert.equal(Object.hasOwn(lastQuery(m), 'regionId'), false);
    assert.equal(Object.hasOwn(lastQuery(m), 'zoneIdList'), false);
    assert.equal(listCount(), initialCount + 4);
    sheet.unmount(); m.unmount();
  });

  test(`${feature}: empty API response preserves the no-data branch`, async () => {
    const m = mount(relative, { themes: [] }); await m.settle();
    assert.equal(m.find(node => node.props.alt === '데이터 없음').length, 1);
    assert.equal(m.child('CustomPagination'), undefined); m.unmount();
  });
}

test('RegionFilter: omitted, object and callback refs all select zones through the callback only', () => {
  for (const mobile of [false, true]) for (const ref of [null, { current: null }, () => {}]) {
    const selected = [];
    const props = sheetProps({ onZoneSelect: value => selected.push(value) });
    const m = mount('src/shared/components/filter/RegionFilter.tsx', { mobile, props, ref });
    m.render(); m.find(node => node.props.children === '강남')[0].props.onClick();
    assert.deepEqual(selected, ['강남']);
    if (ref && typeof ref !== 'function') {
      assert.deepEqual(Object.keys(ref), ['current']); assert.equal(typeof ref.current.reset, 'function');
    }
  }
});

test('BottomSheet: regional scope and selected zone names are committed before close', () => {
  for (const [activeRegionId, selectedRegion, selectedZones] of [
    [1, '서울 전체', []],
    [2, '경기/인천 전체', []],
    [1, '강남', ['강남']],
    [1, '지역 전체', []],
  ]) {
    const trace = [];
    const props = sheetProps({ activeRegionId, selectedRegion, selectedZones, zones: zones[activeRegionId],
      onApply: value => trace.push(plain(value)), onClose: () => trace.push('close'),
    });
    const m = mount('src/shared/components/BottomSheet.tsx', { mobile: true, props });
    m.render(); m.find(node => node.props.children === '필터 적용하기')[0].props.onClick();
    assert.deepEqual(trace[0].zones, selectedZones);
    assert.equal(trace[0].region, selectedZones.length ? '지역 선택됨' : selectedRegion);
    assert.equal(trace[0].regionSelection.activeRegionId, activeRegionId);
    assert.deepEqual(trace[0].regionSelection.selectedZones, selectedZones);
    assert.equal(trace[1], 'close');
    m.unmount();
  }
});

test('BottomSheet: deselecting the final zone selects all regions in the draft only', async () => {
  for (const [regionId, zoneName] of [[1, '강남'], [2, '수원']]) {
    const applied = [];
    const m = mount('src/shared/components/BottomSheet.tsx', { mobile: true,
      props: sheetProps({ onApply: value => applied.push(plain(value)) }),
    });
    await m.settle();
    m.find(node => node.props.children === '지역')[0].props.onClick(); await m.settle();
    m.child('RegionFilter').props.onTabClick(regionId); await m.settle();
    m.child('RegionFilter').props.onZoneSelect(zoneName); await m.settle();
    m.child('RegionFilter').props.onZoneSelect(zoneName); await m.settle();
    assert.equal(m.child('RegionFilter').props.selectedRegion, '지역 전체');
    assert.equal(m.child('RegionFilter').props.isAllZoneSelected, false);
    assert.deepEqual(plain(m.child('RegionFilter').props.selectedZones), []);
    assert.equal(applied.length, 0);
    m.find(node => node.props.children === '필터 적용하기')[0].props.onClick();
    assert.equal(applied[0].region, '지역 전체'); assert.equal(applied[0].regionSelection.activeRegionId, regionId);
    m.unmount();
  }
});

test('BottomSheet: closing discards drafts, reopening restores applied values, and tabs retain all choices', async () => {
  const applied = [];
  const m = mount('src/shared/components/BottomSheet.tsx', { mobile: true,
    props: sheetProps({ isOpen: false, selectedRegion: '지역 전체', isAllZoneSelected: false,
      onApply: value => applied.push(plain(value)) }),
  });
  await m.settle(); m.updateProps({ isOpen: true }); await m.settle();
  m.child('PeopleFilter').props.onSelect(4); await m.settle();
  m.find(node => node.props.children === '정렬')[0].props.onClick(); await m.settle();
  m.child('SortFilter').props.onSelect('LOW_PRICE'); await m.settle();
  m.find(node => node.props.children === '지역')[0].props.onClick(); await m.settle();
  m.child('RegionFilter').props.onZoneSelect('강남'); await m.settle();
  // A parent rerender (for example, a completed list request) must not erase the draft.
  m.updateProps({ zones: [...zones[1]] }); await m.settle();
  assert.deepEqual(plain(m.child('RegionFilter').props.selectedZones), ['강남']);
  m.find(node => node.props.children === '가격')[0].props.onClick(); await m.settle();
  assert.equal(m.child('PeopleFilter').props.selected, 4);
  m.find(node => node.props.children === '정렬')[0].props.onClick(); await m.settle();
  assert.equal(m.child('SortFilter').props.selected, 'LOW_PRICE');
  m.updateProps({ isOpen: false }); await m.settle();
  assert.equal(applied.length, 0);
  m.updateProps({ isOpen: true }); await m.settle();
  assert.equal(m.child('SortFilter').props.selected, 'HIGH_SATISFACTION_LEVEL');
  m.find(node => node.props.children === '가격')[0].props.onClick(); await m.settle();
  assert.equal(m.child('PeopleFilter').props.selected, 2);
  m.find(node => node.props.children === '지역')[0].props.onClick(); await m.settle();
  assert.equal(m.child('RegionFilter').props.selectedRegion, '지역 전체');
  assert.deepEqual(plain(m.child('RegionFilter').props.selectedZones), []);
  m.unmount();
});

test('BottomSheet: a late region lookup cannot overwrite a newer tab or a reopened sheet', async () => {
  const pending = [];
  const m = mount('src/shared/components/BottomSheet.tsx', { mobile: true,
    props: sheetProps({ loadZones: regionId => new Promise(resolve => pending.push({ regionId, resolve })) }),
  });
  await m.settle();
  m.find(node => node.props.children === '지역')[0].props.onClick(); await m.settle();
  m.child('RegionFilter').props.onTabClick(2); await m.settle();
  m.child('RegionFilter').props.onTabClick(1); await m.settle();
  pending[1].resolve(zones[1]); await m.settle(); pending[0].resolve(zones[2]); await m.settle();
  assert.equal(m.child('RegionFilter').props.activeRegionId, 1);
  assert.deepEqual(plain(m.child('RegionFilter').props.zones), zones[1]);
  m.child('RegionFilter').props.onTabClick(2); await m.settle();
  m.updateProps({ isOpen: false }); await m.settle();
  m.updateProps({ isOpen: true }); await m.settle();
  pending[2].resolve(zones[2]); await m.settle();
  assert.equal(m.child('RegionFilter').props.activeRegionId, 1);
  assert.deepEqual(plain(m.child('RegionFilter').props.zones), zones[1]);
  m.unmount();
});

test('BottomSheet: location-only consumer needs no region props and reset keeps existing defaults', () => {
  const values = [];
  const props = { isOpen: true, isLocationPage: true, selectedPeople: 4, selectedSort: 'LOW_PRICE',
    onApply: value => values.push(plain(value)), onReset: value => values.push(plain(value)),
    onClose() {}, setHeadCount() {}, setSelectedSort() {},
  };
  const m = mount('src/shared/components/BottomSheet.tsx', { mobile: true, props });
  m.render(); assert.equal(m.find(node => node.props.children === '지역').length, 0);
  m.find(node => String(node.props.src).includes('reset.svg'))[0].props.onClick();
  assert.deepEqual(values[0], { people: 2, sort: 'HIGH_SATISFACTION_LEVEL', region: '지역 전체', zones: [] });
  m.unmount();
});

test('ContentCard: themeId is used for detail navigation and schedule preview reset', () => {
  const m = mount('src/shared/components/ContentCard.tsx', { props: { data: theme(92), headCount: 2 } });
  m.render().props.onClick();
  assert.equal(m.navigation[0][0], '/theme/92');
  assert.deepEqual(plain(m.recoilWrites[0]), { isOpen: false, mode: 'add', reservation: null });
  m.unmount();
});
