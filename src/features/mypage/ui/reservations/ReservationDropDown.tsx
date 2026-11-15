import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import More from '../../../../shared/assets/icons/common/more.svg?react';
import Write from '../../../../shared/assets/icons/myPage/write.svg?react';
import Thumb from '../../../../shared/assets/icons/myPage/thumbsup.svg?react';
import Trash from '../../../../shared/assets/icons/myPage/trash.svg?react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { calendarMonthState, reservationListState } from '../../model/reservationAtom';
import { deleteReservationAPI, getMyReservationsAPI } from '../../api/reservationAPI';
import { format } from 'date-fns';
import PopUpModal from '../../../../shared/components/PopUpModal';
import { scheduleModalState } from '../../../schedule/modal/scheduleAtom';
import type { ThemeReservationResponse } from '../../api/types';

type ReservationDropDownProps = { onReviewClick: () => void; reservation: ThemeReservationResponse };
type SavedDeletion = { year: string; month: string };
type DeleteOperation = { generation: number };

export default function ReservationDropDown({onReviewClick, reservation}: ReservationDropDownProps) {

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefreshFailed, setIsRefreshFailed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentMonth = useRecoilValue(calendarMonthState);
  const setReservationList = useSetRecoilState(reservationListState);
  const setScheduleModal = useSetRecoilState(scheduleModalState);
  const mounted = useRef(false);
  const generation = useRef(0);
  const pendingOperation = useRef<DeleteOperation | null>(null);
  const savedDeletion = useRef<SavedDeletion | null>(null);
  const currentReservation = useRef({ themeId: reservation.themeId, id: reservation.themeReservationId });

  useLayoutEffect(() => {
    mounted.current = true;
    currentReservation.current = { themeId: reservation.themeId, id: reservation.themeReservationId };
    savedDeletion.current = null;
    setIsRefreshFailed(false);
    return () => {
      mounted.current = false;
      generation.current += 1;
      pendingOperation.current = null;
      savedDeletion.current = null;
    };
  }, [reservation.themeId, reservation.themeReservationId]);

  const beginOperation = (): DeleteOperation | null => {
    if (!mounted.current || pendingOperation.current
      || currentReservation.current.themeId !== reservation.themeId
      || currentReservation.current.id !== reservation.themeReservationId) return null;
    const operation = { generation: generation.current };
    pendingOperation.current = operation;
    return operation;
  };

  const isCurrentOperation = (operation: DeleteOperation) => mounted.current
    && generation.current === operation.generation && pendingOperation.current === operation;

  const closeDeleteModal = () => {
    generation.current += 1;
    pendingOperation.current = null;
    setIsDeleteModalOpen(false);
    setIsRefreshFailed(false);
  };

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // document의 mousedown target은 DOM Node 또는 null이다.
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node | null)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const finishSavedDeletion = async (operation: DeleteOperation, saved: SavedDeletion) => {
    try {
      if (!isCurrentOperation(operation)) return;
      const { year, month } = saved;
      const data = await getMyReservationsAPI(year, month);
      if (!isCurrentOperation(operation)) return;

      const allDates = data?.themeReservationList || {};
      const allReservations = Object.values(allDates).flat();

      setReservationList(prev => isCurrentOperation(operation) ? ({
        ...prev,
        [`${year}-${month}`]: allReservations,
      }) : prev);

      alert("예약이 삭제되었습니다.");
      setIsDeleteModalOpen(false);
      setIsRefreshFailed(false);
    } catch (error) {
      if (!isCurrentOperation(operation)) return;
      console.error("예약 목록 갱신 실패:", error);
      setIsDeleteModalOpen(false);
      setIsRefreshFailed(true);
    }
  };

  const handleRetryRefresh = async () => {
    const saved = savedDeletion.current;
    if (!saved) return;
    const operation = beginOperation();
    if (!operation) return;
    try {
      await finishSavedDeletion(operation, saved);
    } finally {
      if (pendingOperation.current === operation) pendingOperation.current = null;
    }
  };

  const handleDelete = async () => {
    if (savedDeletion.current) return handleRetryRefresh();
    const operation = beginOperation();
    if (!operation) return;
    try {
      await deleteReservationAPI(reservation.themeId, reservation.themeReservationId);
      if (!isCurrentOperation(operation)) return;
      const saved = { year: format(currentMonth, "yyyy"), month: format(currentMonth, "MM") };
      savedDeletion.current = saved;
      await finishSavedDeletion(operation, saved);
    } catch (error) {
      if (!isCurrentOperation(operation)) return;
      alert("예약 삭제에 실패했습니다.");
      console.error(error);
    } finally {
      if (pendingOperation.current === operation) pendingOperation.current = null;
    }
  };

  return (
    <Wrapper ref={dropdownRef}>
      <MoreIcon
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
      />

       {isOpen && (
        <DropDownMenu>
          <DropDownItem
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onReviewClick();
            }}
          >
            <ThumbIcon/>
            <DropDownText>후기 작성</DropDownText>
          </DropDownItem>

          <DropDownItem
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setScheduleModal({isOpen: true, mode: 'edit', reservation});
            }}
          >
            <WriteIcon/>
            <DropDownText>예약 일정 변경</DropDownText>
          </DropDownItem>

          <DropDownItem
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              generation.current += 1;
              pendingOperation.current = null;
              if (savedDeletion.current) setIsRefreshFailed(true);
              else setIsDeleteModalOpen(true);
            }}
          >
            <TrashIcon/>
            <DropDownText>예약 내역 삭제</DropDownText>
          </DropDownItem>
        </DropDownMenu>
      )}
      

      <PopUpModal
        isOpen={isDeleteModalOpen}
        title="예약 삭제"
        message="정말 이 예약을 삭제하시겠습니까?"
        subMessage="삭제한 예약 정보는 일정 캘린더에서도 삭제됩니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
      />
      <PopUpModal
        isOpen={isRefreshFailed}
        title="예약 목록 갱신 실패"
        message="예약은 삭제되었지만 목록을 불러오지 못했습니다."
        subMessage="다시 시도하면 목록만 조회합니다. 삭제 요청은 반복되지 않습니다."
        confirmText="목록 다시 불러오기"
        cancelText="닫기"
        onConfirm={handleRetryRefresh}
        onCancel={closeDeleteModal}
      />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const MoreIcon = styled(More)`
  display: flex;
  width: 1.3125em;
  height: 1.3125em;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: #717486;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 1em;
    height: 1em;
  }
`;

const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(100% + 0.5em); 
  right: 0;
  z-index: 1000;
  cursor: pointer;
`;

const DropDownItem = styled.div`
  display: flex;
  width: 11.875em;
  height: 2.5em;
  padding: 0em 1.25em;
  align-items: center;
  gap: 0.625em;
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  background: var(--RIU_Monochrome-20, #F0F0F4);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 9.375em;
    height: 2.25em;
  }
`;

const DropDownText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const WriteIcon = styled(Write)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;

const ThumbIcon = styled(Thumb)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;

const TrashIcon = styled(Trash)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;
