import type {
  ThemeReviewEvaluation,
  ThemeReviewFailReason,
  ThemeReviewParticipantDto,
  ThemeReviewRecommendedCloth,
  ThemeReviewTag,
} from '../../../shared/types/review';

export type ThemeReviewDetailPathParam = number | string;

export interface ThemeReviewDetailResponse {
  reviewId: number;
  memberId: number;
  themeId: number;
  satisfactionLevel: number;
  review: ThemeReviewEvaluation;
  reviewComment: string;
  playedAt: string | null;
  participantList: ThemeReviewParticipantDto[];
  isEscaped: boolean | null;
  remainingTime: string | null;
  failReason: ThemeReviewFailReason | null;
  hasViewedEnding: boolean | null;
  usedHint: number | null;
  minRecommendedHeadcount: number | null;
  maxRecommendedHeadcount: number | null;
  reviewTagList: ThemeReviewTag[] | null;
  lockRatio: number | null;
  level: number;
  levelComment: string;
  horrorLevel: number;
  horrorComment: string;
  activityLevel: number;
  activityComment: string;
  recommendedCloth: ThemeReviewRecommendedCloth | null;
  storyLevel: number;
  storyComment: string;
  interiorLevel: number;
  interiorComment: string;
  createdAt: string;
}
