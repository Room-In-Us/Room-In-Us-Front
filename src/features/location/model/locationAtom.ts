import { atom } from 'recoil';
import type { RegionId, SeoulZoneStoreResponse, StoreId, ZoneId, ZoneStoreResponse } from '../api/types';

export interface LocationMapCenter {
  lat: number;
  lng: number;
}

// 서울 매장의 공통 정보와 수도권 매장에만 있는 역 정보를 함께 표시한다.
export type LocationStoreDisplay = SeoulZoneStoreResponse &
  Partial<Pick<ZoneStoreResponse, 'stationId' | 'stationName' | 'stationLineList'>>;

// 구글 맵
export const mapsLoadedState = atom<boolean>({
  key: 'mapsLoadedState',
  default: false,
});

// 선택된 지역 ID (서울: 1, 경기: 2)
export const selectedLocationRegionId = atom<RegionId | null>({
  key: 'selectedLocationRegionId',
  default: null,
});

// 역 상태
export const stationCardVisible = atom<boolean>({
  key: 'stationCardVisible',
  default: false,
});

// 매장 상태
export const storeCardVisible = atom<boolean>({
  key: 'storeCardVisible',
  default: false,
});

// 역 ID
export const zoneId = atom<ZoneId | null>({
  key: 'zoneId',
  default: null,
});

// 매장 목록 페이지 넘버
export const storePageNumber = atom<number>({
  key: 'storePageNumber',
  default: 1,
});

// 매장 ID
export const locationStoreId = atom<StoreId | null>({
  key: 'locationStoreId',
  default: null,
});

// 지역 ID
export const locationRegionId = atom<RegionId>({
  key: 'locationRegionId',
  default: 1,
});

// 구역 이름
export const zoneName = atom<string | null>({
  key: 'zoneName',
  default: null,
});

// 구역별 매장 개수
export const storeCount = atom<number | null>({
  key: 'storeCount',
  default: null,
});

// 구역별 테마 개수
export const themeCount = atom<number | null>({
  key: 'themeCount',
  default: null,
});

// 매장 정보 리스트
export const storeInfoList = atom<LocationStoreDisplay[]>({
  key: 'storeInfoList',
  default: [],
});

// 역 중앙 좌표
export const centerLatAndLng = atom<LocationMapCenter>({
  key: 'centerLatAndLng',
  default: {
    lat: 37.5642135,
    lng: 127.0016985,
  },
});

// 줌 레벨
export const zoomLevel = atom<number>({
  key: 'zoomLevel',
  default: 12,
});
