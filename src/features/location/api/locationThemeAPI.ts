import { api } from '../../../app/API';
import type { PageResponse } from '../../../shared/types/api';
import type { ThemeResponse, ThemeSortOption } from '../../../shared/types/theme';
import type { LocationThemeListQuery } from './types';

// 지역 기반 방탈출 카페 테마 목록 조회
export const getLocationListAPI = async (
  storeId: number,
  headcount: number,
  page: number,
  size: number,
  sortOption?: ThemeSortOption
): Promise<PageResponse<ThemeResponse>> => {
  try {
    const params: LocationThemeListQuery = {
      storeId, // 매장 아이디
      headcount, // 가격 기준 인원
      page, // 페이지 번호
      size, // 페이지별 테마 개수
    };
    if (sortOption) {
      params.sortOption = sortOption; // 정렬 기준
    }

    const response = await api.get<PageResponse<ThemeResponse>>('themes/location', { params });
    console.log('지역 기반 방탈출 카페 테마 목록 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('지역 기반 방탈출 카페 테마 목록 조회 api 요청 실패:', error);
    throw error;
  }
};
