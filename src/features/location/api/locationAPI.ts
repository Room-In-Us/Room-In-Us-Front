import { api } from '../../../app/API';
import type {
  LocationStoreInfoResponse,
  RegionId,
  RegionListResult,
  SeoulZoneInfoResponse,
  SeoulZoneStoreListResponse,
  StoreId,
  StoreListQuery,
  StoreSortOption,
  ZoneId,
  ZoneListResult,
  ZoneResponse,
  ZoneStoreListResponse,
} from './types';

// 구역 목록 조회
export const getLocationZonesAPI = async (regionId: RegionId): Promise<ZoneResponse[]> => {
  try {
    const response = await api.get<ZoneResponse[]>(`location/regions/${regionId}/zones`);
    console.log('구역 목록 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('구역 목록 조회 api 요청 실패:', error);
    throw error;
  }
};

// 서울 구역 상세 정보 조회
export const getSeoulZonesInfoAPI = async (zoneId: ZoneId): Promise<SeoulZoneInfoResponse> => {
  try {
    const response = await api.get<SeoulZoneInfoResponse>(`location/regions/1/zones/${zoneId}/zone-info`);
    console.log('서울 구역 상세 정보 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('서울 구역 상세 정보 조회 api 요청 실패:', error);
    throw error;
  }
};

// 수도권(+서울기타) 구역 매장 목록 조회
export const getZoneStoreListAPI = async (
  regionId: RegionId,
  zoneId: ZoneId,
  page: number,
  size: number,
  sortOption?: StoreSortOption
): Promise<ZoneStoreListResponse> => {
  try {
    const params: StoreListQuery = {
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };
    if (sortOption) {
      params.sortOption = sortOption; // 정렬 기준
    }

    const response = await api.get<ZoneStoreListResponse>(`stores/regions/${regionId}/zones/${zoneId}/stores`, {params});
    console.log('수도권 구역 매장 목록 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('수도권 구역 매장 목록 조회 api 요청 실패:', error);
    throw error;
  }
};

// 서울 구역 매장 목록 조회
export const getSeoulZoneStoreListAPI = async (
  zoneId: ZoneId,
  page: number,
  size: number,
  sortOption?: StoreSortOption
): Promise<SeoulZoneStoreListResponse> => {
  try {
    const params: StoreListQuery = {
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };
    if (sortOption) {
      params.sortOption = sortOption; // 정렬 기준
    }

    const response = await api.get<SeoulZoneStoreListResponse>(`stores/regions/1/zones/${zoneId}`, {params});
    console.log('서울 구역 매장 목록 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('서울 구역 매장 목록 조회 api 요청 실패:', error);
    throw error;
  }
};

// 매장 상세 정보 조회
export const getLocationStoreInfoAPI = async (storeId: StoreId): Promise<LocationStoreInfoResponse> => {
  try {
    const response = await api.get<LocationStoreInfoResponse>(`stores/${storeId}/store-info`);
    console.log('매장 상세 정보 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('매장 상세 정보 조회 api 요청 실패:', error);
    throw error;
  }
};

// 지역 목록 조회 api
export const getRegionAPI = async (): Promise<RegionListResult> => {
  try {
      const response = await api.get<RegionListResult['contents']>(`location/regions`);
      console.log('지역 목록 조회 api 요청 성공: ', response);
      return {
        contents: response.data,
      };
    } catch (error) {
      console.error('지역 목록 조회 api 요청 실패: ', error);
      throw error;
    }
}

// 구역 목록 조회 api
export const getZoneAPI = async (regionId: RegionId): Promise<ZoneListResult> => {
  try {
    const response = await api.get<ZoneListResult['data']>(`location/regions/${regionId}/zones`);
    console.log('구역 목록 조회 api 요청 성공: ', response);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('구역 목록 조회 api 요청 실패: ', error);
    throw error;
  }
};
