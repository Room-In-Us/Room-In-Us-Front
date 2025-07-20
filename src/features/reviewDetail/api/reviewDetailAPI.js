import { api } from '../../../app/API';

// 후기 상세 조회 api
export const getReviewDetailAPI = async (themeId, reviewId) => {
  try {
    const response = await api.get(`themes/${themeId}/reviews/${reviewId}`);
    console.log('후기 상세 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('후기 상세 조회 api 요청 실패:', error);
    throw error;
  }
};
