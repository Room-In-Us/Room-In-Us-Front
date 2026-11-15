import { atom } from 'recoil';
import type { ThemeReservationResponse } from '../../mypage/api/types';

export type ScheduleMode = 'add' | 'edit';

export interface ScheduleModalState {
  isOpen: boolean;
  mode: ScheduleMode;
  reservation: ThemeReservationResponse | null;
}

// 모달 상태
export const scheduleModalState = atom<ScheduleModalState>({
  key: 'scheduleModalState',
  default: { isOpen: false, mode: 'add', reservation: null },
});

// 일정 관리 섹션 상태
export const scheduleSectionState = atom<string>({
  key: 'scheduleSectionState',
  default: 'first',
});
