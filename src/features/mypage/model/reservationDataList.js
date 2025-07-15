import Write from '../../../shared/assets/icons/myPage/write.svg?react';
import Thumb from '../../../shared/assets/icons/myPage/thumbsup.svg?react';
import Trash from '../../../shared/assets/icons/myPage/trash.svg?react';

export const reservationSortOption = [
  {icon: Write, label: '후기 작성', value: 'REVIEW_WRITE' },
  {icon: Thumb, label: '예약 일정 변경', value: 'RESERVATION_CHANGE' },
  {icon: Trash, label: '예약 내역 삭제', value: 'RESERVATION_DELETE' },
];