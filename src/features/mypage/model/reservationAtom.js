import { atom } from 'recoil';

// 캘린더 월 상태
export const calendarMonthState = atom({
  key: 'calendarMonthState',
  default: new Date(), 
});

// 예약한 테마 목록 상태
export const reservationListState = atom({
  key: 'reservationListState',
  default: {},
});

// 예약 필터 상태
export const reservationSortAtom = atom({
  key: 'reservationSortAtom',
  default: 'REVIEW_WRITE',
});