import { atom } from 'recoil';

export const reviewSortAtom = atom({
  key: 'reviewSortAtom',
  default: 'PLAYED_AT_DESC', // 기본 정렬 조건
});