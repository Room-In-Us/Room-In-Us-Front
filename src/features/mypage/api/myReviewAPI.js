import { api } from '../../../app/API';

export const getMyReviewAPI = async (page, size, sortOption) => {
  try {
    const params = {
      page,
      size,
    };

    if (sortOption) {
      params.sortOption = sortOption;
    }

    const response = await api.get('members/reviews', { params });
    console.log('작성한 후기 목록 api 요청 성공: ', response);

    return response.data.contents;
  } catch (error) {
    console.error('작성한 후기 목록 api 요청 실패: ', error);
    throw error;
  }
}

export const deleteMyReviewAPI = async (themeId, reviewId) => {
  try {
    const response = await api.delete(`themes/${themeId}/reviews/${reviewId}`);
    console.log('후기 삭제 성공:', response);
    return response.data;
  } catch (error) {
    console.error('후기 삭제 실패:', error);
    throw error;
  }
};