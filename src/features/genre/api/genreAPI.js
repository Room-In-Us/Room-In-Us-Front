import { api } from '../../../app/API';

// 장르 기반 방탈출 카페 테마 목록 조회
export const getGenreListAPI = async (genre, headcount, page, size, sortOption) => {
  try {
    const params = {
      genre, // 장르
      headcount, // 가격 기준 인원
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };

    if (sortOption) {
      params.sortOption = sortOption;
    }
      
    const response = await api.get(`themes/genre`, { params });
    console.log('장르 기반 방탈출 카페 테마 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};