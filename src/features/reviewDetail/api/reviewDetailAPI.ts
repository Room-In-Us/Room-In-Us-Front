import { api } from '../../../app/API';
import type { ThemeReviewDetailPathParam, ThemeReviewDetailResponse } from './types';

// 후기 상세 조회 api
export const getReviewDetailAPI = async (
  themeId: ThemeReviewDetailPathParam,
  reviewId: ThemeReviewDetailPathParam,
): Promise<ThemeReviewDetailResponse> => {
  try {
    const response = await api.get<ThemeReviewDetailResponse>(`themes/${themeId}/reviews/${reviewId}`);
    console.log('후기 상세 조회 api 요청 성공:', response);
    return response.data;
  } catch (error) {
    console.error('후기 상세 조회 api 요청 실패:', error);
    throw error;
  }
};
