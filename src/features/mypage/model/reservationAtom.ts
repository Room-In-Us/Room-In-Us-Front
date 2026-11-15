import { atom } from 'recoil';
import type { ThemeReservationResponse } from '../api/types';

// API의 날짜별 목록을 펼쳐 yyyy-MM 키로 보관하는 월별 UI 캐시.
export type ReservationList = Record<string, ThemeReservationResponse[]>;

export type ReservationSortOption = 'REVIEW_WRITE' | 'RESERVATION_CHANGE' | 'RESERVATION_DELETE';

// 캘린더 월 상태
export const calendarMonthState = atom<Date>({
  key: 'calendarMonthState',
  default: new Date(),
});

// 예약한 테마 목록 상태
export const reservationListState = atom<ReservationList>({
  key: 'reservationListState',
  default: {},
});

// 예약 필터 상태
export const reservationSortAtom = atom<ReservationSortOption>({
  key: 'reservationSortAtom',
  default: 'REVIEW_WRITE',
});
