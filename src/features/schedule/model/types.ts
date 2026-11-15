import type { ThemeReservationResponse, ReservationRequestDateTimeInput } from '../../mypage/api/types';
import type { Dayjs } from 'dayjs';

// 검색·상세·예약 복원에서 선택한 테마의 표시용 필드. 예약 ID와 확정 일시는 없다.
export type ScheduleThemeSelection = Omit<ThemeReservationResponse, 'themeReservationId' | 'reservedAt'>;

// 일정 편집 중의 날짜는 미선택(null)일 수 있어 목록 응답 DTO와 구분한다.
export type ScheduleReservationPreview = ScheduleThemeSelection & {
  reservedAt: ReservationRequestDateTimeInput;
};

export type ScheduleSubmitState = {
  visitDate: Date | Dayjs | null;
  reservedAt: ReservationRequestDateTimeInput;
  // 모달 초기값에만 있으며 자식의 첫 상태 알림에서 제거되는 기존 필드.
  selectedTime?: null;
} & ({
  isSubmitEnabled: true;
  selectedThemeId: number;
} | {
  isSubmitEnabled: false;
  selectedThemeId: number | null;
});
