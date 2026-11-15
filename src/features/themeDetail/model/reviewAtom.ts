import { atom, atomFamily } from 'recoil';
import type { ThemeReservationResponse } from '../../mypage/api/types';
import type {
  ThemeReviewEvaluation,
  ThemeReviewFailReason,
  ThemeReviewRecommendedCloth,
  ThemeReviewTag,
} from '../../../shared/types/review';
import type { ThemeProficiency } from '../../../shared/types/theme';

// 일정 화면의 VisitDatePicker는 themeId 없이도 family를 조회한다.
export type ReviewDraftParameter = number | string | undefined;

export type ReviewSection = 'first' | 'second' | 'third' | 'last';

export interface ReviewDraftParticipant {
  // 상세 응답 복원 시 누락/null이 가능하고, 인원 추가 시 빈 문자열을 사용한다.
  proficiency?: ThemeProficiency | '' | null;
  remark?: string | null;
  isOwner?: boolean;
}

export interface ReviewDraftUiState {
  checkedDate: boolean;
  checkedHint: boolean;
  checkedPeople: boolean;
}

// 작성 중의 빈 값, UI 전용 상태, 수정 시 복원되는 메타데이터를 함께 보관한다.
export interface ReviewDraftState {
  satisfactionLevel: number | null;
  review: ThemeReviewEvaluation | null;
  reviewComment: string;
  playedAt: string | null;
  participantList: ReviewDraftParticipant[];
  isEscaped: boolean | null;
  remainingTime: string | null;
  failReason: ThemeReviewFailReason | null;
  hasViewedEnding: boolean | null;
  usedHint: number | null;
  minRecommendedHeadcount: number | null;
  maxRecommendedHeadcount: number | null;
  reviewTagList: ThemeReviewTag[] | null;
  lockRatio: number | null;
  level: number | null;
  levelComment: string;
  horrorLevel: number | null;
  horrorComment: string;
  activityLevel: number | null;
  activityComment: string;
  recommendedCloth: ThemeReviewRecommendedCloth | null;
  storyLevel: number | null;
  storyComment: string;
  interiorLevel: number | null;
  interiorComment: string;
  uiState: ReviewDraftUiState;
  reviewId?: number;
  memberId?: number;
  themeId?: number;
  createdAt?: string;
  img?: string;
}

// 예약 카드에서 선택한 원본 데이터와 별도로 전달하는 이미지를 보존한다.
export interface SelectedThemeForReview {
  data: ThemeReservationResponse;
  img: ThemeReservationResponse['themeImg'];
}

// 모달 상태
export const reviewModalState = atom<boolean>({
  key: 'reviewModalState',
  default: false,
});

// 선택된 테마 정보 상태
export const selectedThemeDataState = atom<SelectedThemeForReview | null>({
  key: 'selectedThemeDataState',
  default: null,
});

// 후기 작성 섹션 상태
export const reviewSectionState = atom<ReviewSection>({
  key: 'reviewSectionState',
  default: 'first',
});

// 초기 후기 작성 데이터
const defaultReviewValue: ReviewDraftState = {
  satisfactionLevel: null,
  review: null,
  reviewComment: '',

  playedAt: null,
  participantList: [
    {
      proficiency: null,
      remark: '',
      isOwner: true,
    },
    {
      proficiency: null,
      remark: '',
      isOwner: false,
    },
  ],
  isEscaped: true,
  remainingTime: '00:00:00',
  failReason: null,
  hasViewedEnding: null,
  usedHint: null,
  minRecommendedHeadcount: null,
  maxRecommendedHeadcount: null,
  reviewTagList: [],

  lockRatio: 5,
  level: null,
  levelComment: '',
  horrorLevel: null,
  horrorComment: '',
  activityLevel: null,
  activityComment: '',
  recommendedCloth: null,
  storyLevel: null,
  storyComment: '',
  interiorLevel: null,
  interiorComment: '',

  uiState: {
    checkedDate: false,
    checkedHint: false,
    checkedPeople: false,
  },
};

// 후기 작성 데이터 상태
export const reviewStateFamily = atomFamily<ReviewDraftState, ReviewDraftParameter>({
  key: 'reviewStateFamily',
  default: defaultReviewValue,
});
