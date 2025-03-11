import { api } from '../../../app/API';

// 숙련도 기반 방탈출 테마 목록 조회
export const getLevelListAPI = async (proficiency, sortOption, headcount, page, size) => {
  try {
    const response = await api.get(`themes/proficiency`, {
      params: {
        proficiency, // 숙련도
        sortOption, // 정렬 기준
        headcount, // 가격 기준 인원
        page, // 페이지 번호
        size, // 페이지별 테마 개수
      },
    });
    console.log('숙련도 기반 방탈출 테마 목록 조회 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
