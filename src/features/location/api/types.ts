import type { ThemeSortOption } from '../../../shared/types/theme';
import type { PageResponse } from '../../../shared/types/api';

export interface LocationThemeListQuery {
  storeId: number;
  headcount: number;
  page: number;
  size: number;
  sortOption?: ThemeSortOption;
}

export type RegionId = number;
export type ZoneId = number;
export type StoreId = number;

export type StoreSortOption = 'RECOMMEND' | 'MANY_THEME' | 'NAME';

export interface StoreListQuery {
  page: number;
  size: number;
  sortOption?: StoreSortOption;
}

export interface RegionResponse {
  regionId: RegionId;
  regionName: string;
  storeCount: number;
}

export interface ZoneResponse {
  zoneId: ZoneId;
  zoneName: string;
  storeCount: number;
  themeCount: number;
}

export interface RegionListResult {
  contents: RegionResponse[];
}

export interface ZoneListResult {
  data: ZoneResponse[];
}

export interface StationResponse {
  stationId: number;
  stationName: string;
  stationLineList: number[];
}

export interface SeoulZoneInfoResponse {
  zoneName: string;
  storeCount: number;
  themeCount: number;
  stationList: StationResponse[];
}

export interface SeoulZoneStoreResponse {
  storeId: StoreId;
  storeName: string;
  isAwarded: boolean;
  themeCount: number;
  latitude: number;
  longitude: number;
}

export interface ZoneStoreResponse {
  storeId: StoreId;
  storeName: string;
  isAwarded: boolean;
  themeCount: number;
  latitude: number;
  longitude: number;
  stationId: number;
  stationName: string;
  stationLineList: number[];
}

export interface SeoulZoneStoreListResponse {
  storeData: PageResponse<SeoulZoneStoreResponse>;
  latitudeAvg: number;
  longitudeAvg: number;
}

export interface ZoneStoreListResponse {
  storeData: PageResponse<ZoneStoreResponse>;
  latitudeAvg: number;
  longitudeAvg: number;
}

export interface LocationStoreInfoResponse {
  storeId: StoreId;
  storeName: string;
  storeAddress: string;
  storeWebsiteUrl: string;
  storeContact: string;
}
