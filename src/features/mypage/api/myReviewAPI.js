import { api } from '../../../app/API';

export const getMyReviewAPI = async (page, size, sort) => {
  try {
    const params = {
      page,
      size,
    };

    if (sort) {
      params.sort = Array.isArray(sort) ? sort : [sort];
    }

    const response = await api.get('members/reviews', { params });
    console.log('작성한 후기 목록 api 전체 응답: ', response);

    return response.data;
  } catch (error) {
    console.error('작성한 후기 목록 api 요청 중 오류 발생: ', error);
    throw error;
  }
}