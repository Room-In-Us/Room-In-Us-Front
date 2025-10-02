import { atom } from "recoil";

// 모달 상태
export const scheduleModalState = atom({
  key: 'scheduleModalState',
  default: { isOpen: false, mode: 'add', reservation: null },
});

// 일정 관리 섹션 상태
export const scheduleSectionState = atom({
  key: 'scheduleSectionState',
  default: 'first',
});