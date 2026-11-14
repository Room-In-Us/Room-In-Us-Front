import type { ThemeDetailResponse } from '../api/types';

// API 응답과 조회 전의 기존 빈 객체만 허용하는 화면 표시 상태다.
export type ThemeDetailView = ThemeDetailResponse | {
  [Field in keyof ThemeDetailResponse]?: never;
};

export type DetailNavigationState = { backButtonText?: string };
