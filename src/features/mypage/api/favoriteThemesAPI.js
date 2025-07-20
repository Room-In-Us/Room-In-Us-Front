import { api } from '../../../app/API';

// 좋아요한 방탈출 테마 목록 조회 api
export const getFavoriteThemesAPI = async (headcount, page, size) => {
  try {
    const params = {
      headcount, // 가격 기준 인원
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };

    const response = await api.get('members/liked-themes', { params });
    console.log('좋아요한 테마 목록 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('좋아요한 테마 목록 api 요청 실패: ', error);
    throw error;
  }
};
