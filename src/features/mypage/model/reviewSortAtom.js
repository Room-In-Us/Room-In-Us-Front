import { atom } from 'recoil';

export const reviewSortAtom = atom({
  key: 'reviewSortAtom',
  default: 'themeReview.playedAt,desc', // 기본 정렬 조건
});