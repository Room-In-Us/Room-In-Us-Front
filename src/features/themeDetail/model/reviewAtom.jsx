import { atom } from "recoil";

// 모달 상태
export const reviewModalState = atom({
  key: 'reviewModalState',
  default: false,
});

// 후기 작성 섹션 상태
export const reviewSectionState = atom({
  key: 'reviewSectionState',
  default: 'first',
});