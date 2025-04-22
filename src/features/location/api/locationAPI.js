import { api } from '../../../app/API';

// 장르 기반 방탈출 카페 테마 목록 조회
export const getLocationListAPI = async (storeId, headcount, page, size, sortOption) => {
  try {
    const params = {
      storeId, // 매장 아이디
      headcount, // 가격 기준 인원
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };
    if (sortOption) {
      params.sortOption = sortOption; // 정렬 기준
    }

    const response = await api.get('themes/location', {params});
    console.log('장르 기반 방탈출 카페 테마 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 구역 목록 조회
export const getLocationZonesAPI = async (regionId) => {
  try {
    const response = await api.get(`location/regions/${regionId}/zones`);
    console.log('구역 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 서울 구역 상세 정보 조회
export const getSeoulZonesInfoAPI = async (zoneId) => {
  try {
    const response = await api.get(`location/regions/1/zones/${zoneId}/zone-info`);
    console.log('서울 구역 상세 정보 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 수도권(+서울기타) 구역 매장 목록 조회
export const getZoneStoreListAPI = async (regionId, zoneId) => {
  try {
    const response = await api.get(`stores/regions/${regionId}/zones/${zoneId}/stores`);
    console.log('수도권 구역 매장 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 서울 구역 매장 목록 조회
export const getSeoulZoneStoreListAPI = async (zoneId, page, size, sortOption) => {
  try {
    const params = {
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };
    if (sortOption) {
      params.sortOption = sortOption; // 정렬 기준
    }

    const response = await api.get(`stores/regions/1/zones/${zoneId}`, {params});
    console.log('서울 구역 매장 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 매장 상세 정보 조회
export const getLocationStoreInfoAPI = async (storeId) => {
  try {
    const response = await api.get(`stores/${storeId}/store-info`);
    console.log('매장 상세 정보 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
