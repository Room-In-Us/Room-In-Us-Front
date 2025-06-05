import {api} from '../../../app/API';

// 후기 작성 api
export const postReviewAPI = async (themeId, reviewData) => {
  try {
    const response = await api.post(`themes/${themeId}/reviews`, reviewData);
    console.log('후기 작성 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('후기 작성 중 오류 발생:', error);
    throw error;
  }
};