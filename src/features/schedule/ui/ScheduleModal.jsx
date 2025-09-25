import styled from 'styled-components'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { scheduleModalState } from '../modal/scheduleAtom';
import CloseIcon from "../../../shared/assets/icons/reviewWrite/closeicon.svg?react";
import Pen from '../../../shared/assets/icons/myPage/pen.svg?react';
import ScheduleItemSection from './ScheduleItemSection';
import { useCallback, useState } from 'react';
import { addReservationsAPI } from '../api/addReservationAPI';

export default function ScheduleModal() {

  const isModalOpen = useRecoilValue(scheduleModalState);
  const setScheduleModalOpen = useSetRecoilState(scheduleModalState);

  // 모달 닫기 핸들러
  const handleClose = () => {
    setScheduleModalOpen(false);
  };

  const [submitState, setSubmitState] = useState({
      selectedThemeId: null,
      visitDate: null,
      selectedTime: null,
      isSubmitEnabled: false,
      reservedAt: null,
  });

  const handleStateChange = useCallback((newState) => {
    setSubmitState(newState);
  }, []);

  const handleAddReservation = async () => {
    const { selectedThemeId, reservedAt, isSubmitEnabled } = submitState;

    if (!isSubmitEnabled) {
      return;
    }

    console.log('--- API 요청 데이터 확인 ---');
    console.log('Theme ID:', selectedThemeId);
    console.log('Reserved At:', reservedAt);
    console.log('---------------------------');

    try {
      if (!selectedThemeId || !reservedAt) {
        alert('예약 정보를 다시 확인해주세요.');
        return;
      }
      
      await addReservationsAPI(selectedThemeId, reservedAt);
      alert('예약이 성공적으로 추가되었습니다.');
      handleClose();
    } catch (error) {
      console.error("예약 추가 실패:", error);
      alert('예약 추가에 실패했습니다.');
    }
  };

  return (
    <ModalWrapper>
      <ModalHeader>
        <Wrap>
          <Btn />
          <ModalTitle>일정 관리하기</ModalTitle>
        </Wrap>
        <CloseBtn onClick={handleClose} />
      </ModalHeader>
      <IndexWrapper>

        <ScheduleItemSection isModal={isModalOpen} onStateChange={handleStateChange} />

        <SubmitBtn $isEnabled={submitState.isSubmitEnabled} onClick={handleAddReservation}>
          <SubmitBtnText $isEnabled={submitState.isSubmitEnabled}>방탈출 예약 일정 추가하기</SubmitBtnText>
        </SubmitBtn>
      </IndexWrapper>
    </ModalWrapper>
  )
}

// CSS
const ModalWrapper = styled.div`
font-size: 0.8rem; // 임의로 지정
  border-radius: 0.625em;
  width: 40em;
  height: 47.8125em;
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
  align-items: flex-start;
  gap: 1.875em;
  box-sizing: border-box;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    padding: 1.25em 0.875em;
    gap: 1.25em;
  }
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