import { api } from '../../../app/API';
import type { PageResponse } from '../../../shared/types/api';
import type { ThemeResponse } from '../../../shared/types/theme';
import type { GetThemesQuery } from './types';

export const getThemesAPI = async ({
  keyword,
  page,
  size,
}: GetThemesQuery): Promise<PageResponse<ThemeResponse>> => {
  try {
    const params: GetThemesQuery = {
      keyword,
      page,
      size,
    };

    if (keyword) params.keyword = keyword;

    const response = await api.get<PageResponse<ThemeResponse>>('themes', { params });
    console.log('전체 검색 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('전체 검색 api 요청 실패:', error);
    throw error;
  }
};
