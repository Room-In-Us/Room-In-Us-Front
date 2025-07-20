import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../shared/assets/icons/myPage/leftArrow.svg?react";
import ReviewDropDown from "../../features/mypage/ui/reviews/ReviewDropDown";
import ReviewCardSection from "../../features/mypage/ui/reviews/ReviewCardSection";
import useDevice from "../../shared/hooks/useDevice";

function ReviewsPage() {
  const navigate = useNavigate();
  
  const { isMobile } = useDevice();

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
          <Title>내가 작성한 후기</Title>
          <SubText>방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 {':)'}</SubText>
        </TitleWrapper>

        {/* 드롭다운 영역 */}
        <ReviewDropDown />

        {/* 후기 조회 영역 */}
        <ReviewCardSection />

      </ContentWrapper>
    </PageWrapper>
  )
}

export default ReviewsPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 1.875em;
`;

const ContentWrapper = styled.div`
  width: 36.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;

  @media (max-width: 768px) {
    padding: 0em 0.875em;
    gap: 1.25em;
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