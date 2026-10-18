import type { ThemeGenre } from '../../../shared/types/theme';

export interface FavoriteThemesQuery {
  headcount: number;
  page: number;
  size: number;
}

export interface PatchNicknameRequest {
  nickname: string;
}

export type PatchNicknameResponse = string;

export type ReservationPathParam = number | string;

export type ReservationYearMonthValue = number | string;

export type ReservationRequestDateTime = string;

export type ReservationRequestDateTimeInput = ReservationRequestDateTime | null;

export type ReservationListDateTime = string;

export interface GetMyReservationsQuery {
  year: ReservationYearMonthValue;
  month: ReservationYearMonthValue;
}

export interface ThemeReservationResponse {
  themeReservationId: number;
  reservedAt: ReservationListDateTime;
  themeId: number;
  themeName?: string | null;
  themeImg?: string | null;
  storeId?: number | null;
  storeName?: string | null;
  locationName?: string | null;
  awardsYear?: number | null;
  satisfactionLevel?: number | null;
  level?: number | null;
  playTime?: number | null;
  genreList?: ThemeGenre[] | null;
}

export interface GetThemeReservationListResponse {
  themeReservationList?: Record<string, ThemeReservationResponse[]>;
}

export interface PostThemeReservationRequest {
  reservedAt: ReservationRequestDateTime;
}

export interface PostThemeReservationInput {
  reservedAt: ReservationRequestDateTimeInput;
}

export interface PostThemeReservationResponse {
  reservationId?: number;
}

export interface DeleteReservationParams {
  themeId: ReservationPathParam;
  reservationId: ReservationPathParam;
}

export interface PatchThemeReservationRequest {
  themeId: number;
  reservedAt: ReservationRequestDateTime;
}

export interface PatchThemeReservationInput {
  themeId: PatchThemeReservationRequest['themeId'];
  reservedAt: ReservationRequestDateTimeInput;
}

export type ReservationMutationResponse = string;
