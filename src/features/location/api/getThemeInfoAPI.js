import { api } from '../../../app/API';

// 지역 목록 조회 api
export const getThemeInfoAPI = async (themeId) => {
  try {
    const response = await api.get(`themes/${themeId}/review-info`);
    console.log('전체 응답:', response);
    return {
      data: response.data, // (themeId, point, theme, themeImg, genreList, playTime, level, synopsis)
    };
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
