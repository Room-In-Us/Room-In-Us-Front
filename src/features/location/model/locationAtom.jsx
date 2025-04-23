import { atom } from 'recoil';

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

/* ------------- [구버전] ------------- */

// 지역 상태
export const locationState = atom({
  key: 'locationState',
  default: '',
});
export const locationVisible = atom({
  key: 'locationVisible',
  default: false,
});

// 배경
export const backgroundVisible = atom({
  key: 'backgroundVisible',
  default: false,
});

// 역 상태
export const stationState = atom({
  key: 'stationState',
  default: '',
});
export const stationVisible = atom({
  key: 'stationVisible',
  default: false,
});
export const stationNameState = atom({
  key: 'stationNameState',
  default: '',
});

// 카페 상태
export const cafeState = atom({
  key: 'cafeState',
  default: '',
});
export const cafeVisible = atom({
  key: 'cafeVisible',
  default: false,
});
export const cafeNameState = atom({
  key: 'cafeNameState',
  default: '',
});

// 테마 상태
export const themeState = atom({
  key: 'themeState',
  default: '',
});
export const themeVisible = atom({
  key: 'themeVisible',
  default: false,
});

// 구글 맵
export const mapsLoadedState = atom({
  key: 'mapsLoadedState',
  default: false,
});

// 위치별 위도, 경도 리스트 (역)
export const stationLatAndLngList = atom({
  key: 'stationLatAndLngList',
  default: [],
});
// 위치별 위도, 경도 리스트 (카페)
export const cafeLatAndLngList = atom({
  key: 'cafeLatAndLngList',
  default: [],
});
// 위치별 위도, 경도 리스트 저장 (테마로 이동 시 리셋 되는 경우 방지)
export const backupCafeLatAndLngList = atom({
  key: 'backupCafeLatAndLngList',
  default: [],
});

// 위치별 중앙 좌표
export const locationCenterState = atom({
  key: 'locationCenterState',
  default: {},
});
// 역 중앙 좌표
export const stationCenterState = atom({
  key: 'stationCenterState',
  default: {},
});
