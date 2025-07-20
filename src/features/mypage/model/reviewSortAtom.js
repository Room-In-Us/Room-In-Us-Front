import { atom } from 'recoil';

// 후기 정렬 상태
export const reviewSortAtom = atom({
  key: 'reviewSortAtom',
  default: 'PLAYED_AT_DESC', // 기본 정렬 조건
});