import type {
  ThemeReviewEvaluation,
  ThemeReviewHorrorPosition as SharedThemeReviewHorrorPosition,
} from '../../../shared/types/review';
import type { ThemeGenre, ThemeProficiency } from '../../../shared/types/theme';

export type ThemeIdPathParam = number | string;

export interface StoreInfoResponse {
  storeId: number;
  storeName: string;
  locationName: string;
  storeWebsiteUrl: string;
  storeReservationUrl: string;
  storeAddress: string;
  storeContact: string;
}

export interface ThemeDetailResponse {
  themeId: number;
  themeName: string;
  img: string;
  playTime: number;
  minRecommendedHeadcount: number | null;
  maxRecommendedHeadcount: number | null;
  genreList: ThemeGenre[] | null;
  level: number;
  horrorLevel: number;
  synopsis: string;
  storeInfo: StoreInfoResponse;
  isLiked: boolean;
}

export interface ThemePriceResponse {
  headcount: number;
  price: number;
}

export type ThemeReviewHorrorPosition = SharedThemeReviewHorrorPosition;

export type ThemeReviewEnum = ThemeReviewEvaluation;

export interface ThemeReviewDto {
  reviewId?: number;
  memberId?: number;
  memberNickname?: string;
  memberProficiency?: ThemeProficiency | null;
  memberHorrorPos?: ThemeReviewHorrorPosition | null;
  satisfactionLevel?: number;
  reviewEnum?: ThemeReviewEnum;
  headcount?: number;
  isEscaped?: boolean;
  usedHint?: number | null;
  remainingTime?: string | null;
  reviewComment?: string | null;
  playedAt?: string;
  createdAt?: string;
}

export interface ThemeReviewListResponse {
  satisfactionAvg: number;
  reviewCnt: number;
  reviewList: ThemeReviewDto[];
}

export interface ThemeReviewListQuery {
  page: number;
  size: number;
}
