import type { ThemeReviewDetailResponse } from '../../reviewDetail/api/types';
import type { ReviewDraftUiState } from '../../themeDetail/model/reviewAtom';
import type { MyReviewListItem } from '../api/types';

// 내 후기 수정 진입에서 상세 응답에 덧붙이는 화면 데이터.
export type EditableMyReview = ThemeReviewDetailResponse
  & Pick<MyReviewListItem, 'themeName' | 'storeName'>
  & { img: string; uiState: ReviewDraftUiState };
