import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import useDevice from "../../shared/hooks/useDevice";
import CalendarSection from "../../features/mypage/ui/reservations/CalendarSection";
import ScheduleSection from "../../features/mypage/ui/reservations/ScheduleSection";
import { useRecoilValue } from "recoil";
import { reviewModalState, selectedThemeDataState } from "../../features/themeDetail/model/reviewAtom";
import ReviewWriteModal from "../../features/review/ui/ReviewWriteModal";

function ReservationsPage() {
  const navigate = useNavigate();

  const { isMobile } = useDevice();

  const isModalOpen = useRecoilValue(reviewModalState);
  const selectedThemeData = useRecoilValue(selectedThemeDataState);

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 뒤로가기 버튼 */}
        {!isMobile && (
        <BackButtonWrapper onClick={() => navigate('/mypage')}>
          <StyledLeftArrow/>
          <BackButtonText>
            마이페이지로 돌아가기
          </BackButtonText>
        </BackButtonWrapper>
        )}

        {/* 타이틀 영역 */}
        <TitleWrapper>
          <Title>예약한 방탈출 관리</Title>
          <SubText>방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 {':)'}</SubText>
        </TitleWrapper>

        {/* 캘린더 영역 */}
        <CalendarSection />

        {/* 일정 관리 영역 */}
        <ScheduleSection />

        {/* 모달 전역 렌더링 */}
        {isModalOpen && selectedThemeData && (
          <ModalBackdrop>
            <ReviewWriteModal themeData={{...selectedThemeData.data, img: selectedThemeData.img,}} />
          </ModalBackdrop>
        )}

      </ContentWrapper>
    </PageWrapper>
  )
}

export default ReservationsPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.875em;
`;

const ContentWrapper = styled.div`
  width: 36.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;

  @media (max-width: 768px) {
    width: 21.6875em;
    padding: 0em 0.875em;
    gap: 1.875em;
  }
`;

const BackButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
`;

const StyledLeftArrow = styled(LeftArrow)`
  width: 1.25rem;
  height: 1.25rem;

  path {
    fill: var(--RIU_Monochrome-200, #717486);
  }
`;

const BackButtonText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-Medium';
  line-height: normal;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 1.5em;
  
  @media (max-width: 768px) {
    font-size: 1.125em;
  }
`;

const SubText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3500;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;