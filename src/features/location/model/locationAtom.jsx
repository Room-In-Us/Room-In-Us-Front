import { atom } from 'recoil';

// 구글 맵
export const mapsLoadedState = atom({
  key: 'mapsLoadedState',
  default: false,
});

// 역 상태
export const stationCardVisible = atom({
  key: 'stationCardVisible',
  default: false,
});

// 매장 상태
export const storeCardVisible = atom({
  key: 'storeCardVisible',
  default: false,
});

// 역 아이디
export const zoneId = atom({
  key: 'zoneId',
  default: null,
});

// 매장 목록 페이지 넘버
export const storePageNumber = atom({
  key: 'storePageNumber',
  default: 1,
});

// 매장 아이디
export const locationStoreId = atom({
  key: 'locationStoreId',
  default: null,
});

// 지역 아이디
export const locationRegionId = atom({
  key: 'locationRegionId',
  default: 1,
});

// 구역 이름
export const zoneName = atom({
  key: 'zoneName',
  default: null,
});

// 구역별 매장 개수
export const storeCount = atom({
  key: 'storeCount',
  default: null,
});

// 구역별 테마 개수
export const themeCount = atom({
  key: 'themeCount',
  default: null,
});

// 매장 정보 리스트
export const storeInfoList = atom({
  key: 'storeInfoList',
  default: [],
});

// 역 중앙 좌표
export const centerLatAndLng = atom({
  key: 'centerLatAndLng',
  default: {
    lat: 37.5642135,
    lng: 127.0016985,
  },
});

// 줌 레벨
export const zoomLevel = atom({
  key: 'zoomLevel',
  default: 12,
});
