import { atom } from 'recoil';

export type ReviewSortOption = 'PLAYED_AT_DESC' | 'CREATED_AT_DESC';

// 후기 정렬 상태
export const reviewSortAtom = atom<ReviewSortOption>({
  key: 'reviewSortAtom',
  default: 'PLAYED_AT_DESC', // 기본 정렬 조건
});
