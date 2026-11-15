import type { PreferenceHorrorPosition } from './preference';
import type { ThemeProficiency } from './theme';

export type ThemeReviewEvaluation =
  | 'SOIL'
  | 'SOIL_GRASS'
  | 'GRASS'
  | 'GRASS_FLOWER'
  | 'FLOWER'
  | 'FLOWER_GARDEN'
  | 'FAVORITE';

export type ThemeReviewHorrorPosition = PreferenceHorrorPosition;

export type ThemeReviewFailReason = 'HINT' | 'TIME' | 'ETC';

export type ThemeReviewTag =
  | 'AGING'
  | 'DEVICE_ERROR'
  | 'ENTRY_DELAY'
  | 'SAME_DAY_BOOKING'
  | 'EARLY_EXIT';

export type ThemeReviewRecommendedCloth = 'PANTS' | 'LONG_SKIRT' | 'SHORT_SKIRT';

export interface ThemeReviewParticipantDto {
  proficiency?: ThemeProficiency | null;
  remark?: string | null;
}

export interface ThemeReviewParticipantRequest {
  proficiency?: ThemeProficiency;
  remark?: string;
}

export interface ThemeReviewMutationParticipant {
  proficiency: ThemeProficiency | '' | null;
  remark: string;
}

export interface PostThemeReviewRequest {
  satisfactionLevel: number;
  review: ThemeReviewEvaluation;
  participantList: ThemeReviewParticipantRequest[];
  level: number;
  horrorLevel: number;
  activityLevel: number;
  storyLevel: number;
  interiorLevel: number;
  reviewComment?: string;
  playedAt?: string;
  isEscaped?: boolean;
  remainingTime?: string;
  failReason?: ThemeReviewFailReason;
  hasViewedEnding?: boolean;
  usedHint?: number;
  minRecommendedHeadcount?: number;
  maxRecommendedHeadcount?: number;
  reviewTagList?: ThemeReviewTag[];
  lockRatio?: number;
  levelComment?: string;
  horrorComment?: string;
  activityComment?: string;
  recommendedCloth?: ThemeReviewRecommendedCloth;
  storyComment?: string;
  interiorComment?: string;
}

export type PatchThemeReviewRequest = PostThemeReviewRequest;

export interface ThemeReviewMutationInput {
  satisfactionLevel: number | null;
  review: ThemeReviewEvaluation | null;
  reviewComment: string;
  playedAt: string | null;
  participantList: ThemeReviewMutationParticipant[];
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
}
