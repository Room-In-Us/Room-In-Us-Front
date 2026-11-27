import { track } from '../../../shared/utils/analytics';
import styled from 'styled-components'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { scheduleModalState } from '../modal/scheduleAtom';
import CloseIcon from "../../../shared/assets/icons/reviewWrite/closeicon.svg?react";
import Pen from '../../../shared/assets/icons/myPage/pen.svg?react';
import ScheduleItemSection from './ScheduleItemSection';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { calendarMonthState, reservationListState } from '../../mypage/model/reservationAtom';
import { addReservationsAPI, deleteReservationAPI, getMyReservationsAPI, patchReservationAPI } from '../../mypage/api/reservationAPI';
import PopUpModal from '../../../shared/components/PopUpModal';
import type { ThemeIdPathParam } from '../../themeDetail/api/types';
import type { ScheduleSubmitState } from '../model/types';

type ScheduleModalProps = { themeId?: ThemeIdPathParam };
type ReservationOperation = { generation: number };
type SavedReservation = { kind: 'add' | 'edit' | 'delete'; year: string; month: string };

export default function ScheduleModal({themeId}: ScheduleModalProps) {

  const modalState = useRecoilValue(scheduleModalState);
  const { mode, reservation } = modalState;
  const setScheduleModalState = useSetRecoilState(scheduleModalState);
  const currentMonth = useRecoilValue(calendarMonthState);
  const setReservationList = useSetRecoilState(reservationListState);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRefreshFailed, setIsRefreshFailed] = useState(false);

  const [submitState, setSubmitState] = useState<ScheduleSubmitState>({
      selectedThemeId: null,
      visitDate: null,
      selectedTime: null,
      isSubmitEnabled: false,
      reservedAt: null,
  });
  const mounted = useRef(false);
  const context = useRef({ modalState, themeId });
  const generation = useRef(0);
  const pendingOperation = useRef<ReservationOperation | null>(null);
  const selectedThemeIdRef = useRef<number | null>(null);
  const savedReservation = useRef<SavedReservation | null>(null);

  const invalidateOperation = useCallback(() => {
    // 같은 ID로 재진입해도 이전 모달의 요청과 세대를 공유하지 않는다.
    generation.current += 1;
    pendingOperation.current = null;
  }, []);

  useLayoutEffect(() => {
    context.current = { modalState, themeId };
    mounted.current = true;
    selectedThemeIdRef.current = null;
    savedReservation.current = null;
    setIsRefreshFailed(false);
    invalidateOperation();
    return () => {
      mounted.current = false;
      savedReservation.current = null;
      invalidateOperation();
    };
  }, [modalState, themeId, invalidateOperation]);

  const isCurrentContext = () => mounted.current && modalState.isOpen
    && context.current.modalState === modalState && context.current.themeId === themeId;

  const beginOperation = (): ReservationOperation | null => {
    if (!isCurrentContext() || pendingOperation.current) return null;
    // React state 반영 전의 연속 클릭도 동기적으로 잠근다.
    const operation = { generation: generation.current };
    pendingOperation.current = operation;
    return operation;
  };

  const isCurrentOperation = (operation: ReservationOperation) => isCurrentContext()
    && operation.generation === generation.current && pendingOperation.current === operation;

  // 모달 닫기 핸들러
  const handleClose = () => {
    if (!isCurrentContext()) return;
    mounted.current = false;
    invalidateOperation();
    setScheduleModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleStateChange = useCallback((newState: ScheduleSubmitState) => {
    if (!mounted.current || !modalState.isOpen
      || context.current.modalState !== modalState || context.current.themeId !== themeId) return;
    if (selectedThemeIdRef.current !== newState.selectedThemeId) invalidateOperation();
    selectedThemeIdRef.current = newState.selectedThemeId;
    setSubmitState(newState);
  }, [modalState, themeId, invalidateOperation]);

  // 예약 목록 새로고침 공통 함수
  const refreshReservations = async (operation: ReservationOperation, saved: SavedReservation) => {
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
  };

  // 저장 성공은 유지하고, 실패한 목록 조회만 다시 실행한다.
  const finishSavedReservation = async (operation: ReservationOperation, saved: SavedReservation) => {
    try {
      await refreshReservations(operation, saved);
      if (!isCurrentOperation(operation)) return;
      if (saved.kind === 'delete') alert("예약이 삭제되었습니다.");
      handleClose();
    } catch (error) {
      if (!isCurrentOperation(operation)) return;
      console.error("예약 목록 갱신 실패:", error);
      setIsDeleteModalOpen(false);
      setIsRefreshFailed(true);
    }
  };

  const handleRetryRefresh = async () => {
    const saved = savedReservation.current;
    if (!saved) return;
    const operation = beginOperation();
    if (!operation) return;
    try {
      await finishSavedReservation(operation, saved);
    } finally {
      if (pendingOperation.current === operation) pendingOperation.current = null;
    }
  };

  const handleSubmit = async () => {
    if (savedReservation.current) return handleRetryRefresh();
    const { selectedThemeId, reservedAt, isSubmitEnabled } = submitState;

    if (!isSubmitEnabled || selectedThemeIdRef.current !== selectedThemeId) return;
    if (mode === "edit" && !reservation) return;
    const operation = beginOperation();
    if (!operation) return;
    const saved: SavedReservation = { kind: mode, year: format(currentMonth, "yyyy"), month: format(currentMonth, "MM") };

    console.log('--- API 요청 데이터 확인 ---');
    console.log('Theme ID:', selectedThemeId);
    console.log('Reserved At:', reservedAt);
    console.log('---------------------------');

    try {
      if (mode === "edit") {
        if (!reservation) return;
        await patchReservationAPI(reservation.themeId, reservation.themeReservationId, reservedAt, selectedThemeId);
      } else {
        await addReservationsAPI(selectedThemeId, reservedAt).then(
          () => track('add_to_schedule', { theme_id: selectedThemeId, result: 'success' }),
          (error: unknown) => {
            track('add_to_schedule', { theme_id: selectedThemeId, result: 'fail' });
            throw error;
          },
        );
      }
      if (!isCurrentOperation(operation)) return;
      savedReservation.current = saved;
      alert(mode === "edit" ? "예약이 수정되었습니다." : "예약이 추가되었습니다.");

      await finishSavedReservation(operation, saved);
    } catch (error) {
      if (!isCurrentOperation(operation)) return;
      console.error("예약 처리 실패:", error);
      alert(mode === "edit" ? "예약 수정에 실패했습니다." : "예약 추가에 실패했습니다.");
    } finally {
      if (pendingOperation.current === operation) pendingOperation.current = null;
    }
  };

  // 삭제 처리
  const handleDeleteReservation = async () => {
    if (savedReservation.current) return handleRetryRefresh();
    if (!reservation) return;
    const operation = beginOperation();
    if (!operation) return;

    try {
      await deleteReservationAPI(reservation.themeId, reservation.themeReservationId);
      if (!isCurrentOperation(operation)) return;
      const saved: SavedReservation = { kind: 'delete', year: format(currentMonth, "yyyy"), month: format(currentMonth, "MM") };
      savedReservation.current = saved;
      await finishSavedReservation(operation, saved);
    } catch (error) {
      if (!isCurrentOperation(operation)) return;
      console.error("예약 삭제 실패:", error);
      alert("예약 삭제에 실패했습니다.");
    } finally {
      if (pendingOperation.current === operation) pendingOperation.current = null;
    }
  };

  return (
    <ModalWrapper $isEdit={mode === "edit"}>
      <ModalHeader>
        <Wrap>
          <Btn />
          <ModalTitle>일정 관리하기</ModalTitle>
        </Wrap>
        <CloseBtn onClick={handleClose} />
      </ModalHeader>
      <IndexWrapper>

        <ScheduleItemSection
          themeId={themeId}
          isModal={modalState.isOpen}
          onStateChange={handleStateChange}
        />

        <BtnWrapper>
          <SubmitBtn $isEnabled={submitState.isSubmitEnabled} onClick={handleSubmit}>
            <SubmitBtnText $isEnabled={submitState.isSubmitEnabled}>
              {mode === "edit" ? "수정 완료하기" : "방탈출 예약 일정 추가하기"}
            </SubmitBtnText>
          </SubmitBtn>

          
        {mode === "edit" ? (
          <DeleteDiv onClick={() => setIsDeleteModalOpen(true)}>
            <DeleteText>예약 내역 삭제하기</DeleteText>
          </DeleteDiv>
        ) : ""}
      </BtnWrapper>
      </IndexWrapper>

      <PopUpModal
        isOpen={isDeleteModalOpen}
        title="예약 삭제"
        message="정말 이 예약을 삭제하시겠습니까?"
        subMessage="삭제한 예약 정보는 일정 캘린더에서도 사라집니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleDeleteReservation}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <PopUpModal
        isOpen={isRefreshFailed}
        title="예약 목록 갱신 실패"
        message="예약 처리는 완료되었지만 목록을 불러오지 못했습니다."
        subMessage="다시 시도하면 목록만 조회합니다. 예약 처리는 반복되지 않습니다."
        confirmText="목록 다시 불러오기"
        cancelText="닫기"
        onConfirm={handleRetryRefresh}
        onCancel={handleClose}
      />
    </ModalWrapper>
  )
}

// CSS
const ModalWrapper = styled.div<{ $isEdit: boolean }>`
font-size: 0.8rem; // 임의로 지정
  border-radius: 0.625em;
  width: 40em;
  height: ${({ $isEdit }) => ($isEdit ? "auto" : "47.8125em")}; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 22.1875rem;
    height: auto;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625em;
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid var(--RIU_Monochrome-30, #E7E8ED);
`;

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.625em;
`;

const ModalTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;

const Btn = styled(Pen)`
  width: 1.25em;
  height: 1.25em;

  path {
    fill: var(--RIU_Primary-100, #718FF2);
  }
`;

const CloseBtn = styled(CloseIcon)`
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
`;

const IndexWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1.875em;
  flex-direction: column;
  align-items: center;
  gap: 1.875em;
  box-sizing: border-box;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    padding: 1.25em 0.875em;
    gap: 1.25em;
  }
`;

const BtnWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625em;
`;

const SubmitBtn = styled.div<{ $isEnabled: boolean }>`
  display: flex;
  width: 100%;
  height: 3.125em;
  padding: 0.875em 0em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  border-radius: 2.5em;
  background: ${({ $isEnabled }) => $isEnabled ? 'var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%))' : 'var(--RIU_Monochrome-70, #B3B6C3)'};
  box-sizing: border-box;
  cursor: ${({ $isEnabled }) => $isEnabled ? 'pointer' : ''};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const SubmitBtnText = styled.div<{ $isEnabled: boolean }>`
  color: ${({ $isEnabled }) => $isEnabled ? 'var(--RIU_Monochrome-10, #F9F9FB)' : 'var(--RIU_Monochrome-300, #696C7E)'};
  font-family: Pretendard-Bold;
  font-size: 1em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;

const DeleteDiv = styled.div`
  border-bottom: 1px solid #718FF2;
  cursor: pointer;
`;

const DeleteText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;
