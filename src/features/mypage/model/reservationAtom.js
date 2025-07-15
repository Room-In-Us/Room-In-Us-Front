import { atom } from 'recoil';

export const calendarMonthState = atom({
  key: 'calendarMonthState',
  default: new Date(), 
});

export const reservationListState = atom({
  key: 'reservationListState',
  default: {},
});

export const reservationSortAtom = atom({
  key: 'reservationSortAtom',
  default: 'REVIEW_WRITE',
});