import { api } from '../../../app/API';
import type { PageResponse } from '../../../shared/types/api';
import type { ThemeReviewMutationInput } from '../../../shared/types/review';
import type {
  GetMyReviewQuery,
  MyReviewListItem,
  MyReviewPathParam,
  MyReviewSortOption,
  ReviewMutationResponse,
} from './types';

export const getMyReviewAPI = async (
  page: GetMyReviewQuery['page'],
  size: GetMyReviewQuery['size'],
  sortOption?: MyReviewSortOption,
): Promise<MyReviewListItem[]> => {
  try {
    const params: GetMyReviewQuery = {
      page,
      size,
    };

    if (sortOption) {
      params.sortOption = sortOption;
    }

    const response = await api.get<PageResponse<MyReviewListItem>>('members/reviews', { params });
    console.log('작성한 후기 목록 api 요청 성공: ', response);

    return response.data.contents;
  } catch (error) {
    console.error('작성한 후기 목록 api 요청 실패: ', error);
    throw error;
  }
};

export const deleteMyReviewAPI = async (
  themeId: MyReviewPathParam,
  reviewId: MyReviewPathParam,
): Promise<ReviewMutationResponse> => {
  try {
    const response = await api.delete<ReviewMutationResponse>(`themes/${themeId}/reviews/${reviewId}`);
    console.log('후기 삭제 성공:', response);
    return response.data;
  } catch (error) {
    console.error('후기 삭제 실패:', error);
    throw error;
  }
};

export const putMyReviewAPI = async (
  themeId: MyReviewPathParam,
  reviewId: MyReviewPathParam,
  data: ThemeReviewMutationInput,
): Promise<ReviewMutationResponse> => {
  try {
    const response = await api.put<ReviewMutationResponse>(`themes/${themeId}/reviews/${reviewId}`, data);
    console.log('후기 수정 성공:', response);
    return response.data;
  } catch (error) {
    console.error('후기 수정 실패:', error);
    throw error;
  }
};
