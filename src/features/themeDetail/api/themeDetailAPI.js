import { api } from '../../../app/API';

// 방탈출 테마 상세 조회 api
export const getThemeDetailAPI = async (themeId) => {
  try {
    const response = await api.get(`themes/${themeId}`);
    console.log('테마 상세 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('테마 상세 조회 API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 방탈출 테마 가격 정보 조회 api
export const getThemePriceAPI = async (themeId) => {
  try {
    const response = await api.get(`themes/${themeId}/price`);
    console.log('테마 가격 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('테마 가격 조회 API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 방탈출 테마 후기 목록 조회 api
export const getThemeReviewsListAPI = async (themeId, page, size) => {
  const params = {
    page,
    size,
  };
  try {
    const response = await api.get(`themes/${themeId}/reviews`, {params});
    console.log('테마 후기 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('테마 후기 목록 조회 API 요청 중 오류 발생:', error);
    throw error;
  }
};
