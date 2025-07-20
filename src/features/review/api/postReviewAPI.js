import {api} from '../../../app/API';

// 후기 작성 api
export const postReviewAPI = async (themeId, reviewData) => {
  try {
    const response = await api.post(`themes/${themeId}/reviews`, reviewData);
    console.log('후기 작성 api 요청 성공:', response.data);
    return response.data;
  } catch (error) {
    console.error('후기 작성 api 요청 실패:', error);
    throw error;
  }
};