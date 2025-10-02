import styled from 'styled-components'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { scheduleModalState } from '../modal/scheduleAtom';
import CloseIcon from "../../../shared/assets/icons/reviewWrite/closeicon.svg?react";
import Pen from '../../../shared/assets/icons/myPage/pen.svg?react';
import ScheduleItemSection from './ScheduleItemSection';
import { useCallback, useState } from 'react';
import { addReservationsAPI } from '../api/addReservationAPI';
import { format } from 'date-fns';
import { calendarMonthState, reservationListState } from '../../mypage/model/reservationAtom';
import { deleteReservationAPI, getMyReservationsAPI, patchReservationAPI } from '../../mypage/api/reservationAPI';
import PopUpModal from '../../../shared/components/PopUpModal';

export default function ScheduleModal() {

  const modalState = useRecoilValue(scheduleModalState);
  const { mode, reservation } = modalState;
  const setScheduleModalState = useSetRecoilState(scheduleModalState);
  const currentMonth = useRecoilValue(calendarMonthState);
  const setReservationList = useSetRecoilState(reservationListState);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [submitState, setSubmitState] = useState({
      selectedThemeId: null,
      visitDate: null,
      selectedTime: null,
      isSubmitEnabled: false,
      reservedAt: null,
  });

  // 모달 닫기 핸들러
  const handleClose = () => {
    setScheduleModalState(prev => ({ ...prev, isOpen: false }));
  };

  const handleStateChange = useCallback((newState) => {
    setSubmitState(newState);
  }, []);

  // 예약 목록 새로고침 공통 함수
  const refreshReservations = async () => {
    const year = format(currentMonth, "yyyy");
    const month = format(currentMonth, "MM");
    const data = await getMyReservationsAPI(year, month);
    const allDates = data?.themeReservationList || {};
    const allReservations = Object.values(allDates).flat();

    setReservationList(prev => ({
      ...prev,
      [`${year}-${month}`]: allReservations,
    }));
  };

  const handleSubmit = async () => {
    const { selectedThemeId, reservedAt, isSubmitEnabled } = submitState;

    if (!isSubmitEnabled) return;

    console.log('--- API 요청 데이터 확인 ---');
    console.log('Theme ID:', selectedThemeId);
    console.log('Reserved At:', reservedAt);
    console.log('---------------------------');

    try {
      if (mode === "edit") {
        if (!reservation) return;
        await patchReservationAPI(reservation.themeId, reservation.themeReservationId, reservedAt);
        alert("예약이 수정되었습니다.");
      } else {
        await addReservationsAPI(selectedThemeId, reservedAt);
        alert("예약이 추가되었습니다.");
      }

      await refreshReservations();
      handleClose();
    } catch (error) {
      console.error("예약 처리 실패:", error);
      alert(mode === "edit" ? "예약 수정에 실패했습니다." : "예약 추가에 실패했습니다.");
    }
  };

  // 삭제 처리
  const handleDeleteReservation = async () => {
    if (!reservation) return;
    if (!window.confirm("정말 예약을 삭제하시겠습니까?")) return;

    try {
      await deleteReservationAPI(reservation.themeId, reservation.themeReservationId);
      await refreshReservations();
      alert("예약이 삭제되었습니다.");
      handleClose();
    } catch (error) {
      console.error("예약 삭제 실패:", error);
      alert("예약 삭제에 실패했습니다.");
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

        <ScheduleItemSection isModal={modalState.isOpen} onStateChange={handleStateChange} />

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
    </ModalWrapper>
  )
}

// CSS
const ModalWrapper = styled.div`
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

const SubmitBtn = styled.div`
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

const SubmitBtnText = styled.div`
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