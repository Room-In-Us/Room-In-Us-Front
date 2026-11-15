import { api } from '../../../app/API';
import type { PageResponse } from '../../../shared/types/api';
import type { ThemeProficiency, ThemeResponse, ThemeSortOption } from '../../../shared/types/theme';
import type { LevelThemeListQuery, ZoneIdListInput } from './types';

// 숙련도 기반 방탈출 카페 테마 목록 조회
export const getLevelListAPI = async (
  proficiency: ThemeProficiency,
  headcount: number,
  page: number,
  size: number,
  sortOption?: ThemeSortOption,
  keyword?: string,
  regionId?: number | null,
  zoneIdList?: ZoneIdListInput
): Promise<PageResponse<ThemeResponse>> => {
  try {
    const params: LevelThemeListQuery = {
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

    const response = await api.get<PageResponse<ThemeResponse>>(`themes/proficiency`, { params });
    console.log('숙련도 기반 방탈출 카페 테마 목록 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('숙련도 기반 방탈출 카페 테마 목록 조회 api 요청 실패:', error);
    throw error;
  }
};
