import { api } from '../../../app/API';

// 숙련도 기반 방탈출 카페 테마 목록 조회
export const getLevelListAPI = async (proficiency, headcount, page, size, sortOption, keyword, regionId, zoneIdList) => {
  try {
    const params = {
      proficiency, // 숙련도
      headcount, // 가격 기준 인원
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };

    if (sortOption) params.sortOption = sortOption;
    if (keyword) params.keyword = keyword;
    if (regionId) params.regionId = regionId;

    if (Array.isArray(zoneIdList)) {
      params.zoneIdList = zoneIdList.join(',');
    } else if (typeof zoneIdList === 'number') {
      params.zoneIdList = zoneIdList.toString();
    }
    
    const response = await api.get(`themes/proficiency`, { params });
    console.log('숙련도 기반 방탈출 카페 테마 목록 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('숙련도 기반 방탈출 카페 테마 목록 조회 api 요청 실패:', error);
    throw error;
  }
};
