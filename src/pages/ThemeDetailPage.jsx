import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrowIcon from "../shared/assets/icons/themeDetail/leftArrow.svg?react";
import ThemeOverviewCard from "../features/themeDetail/ui/ThemeOverviewCard";
import ThemeInfoSection from "../features/themeDetail/ui/ThemeInfoSection";

function ThemeDetailPage() {
  const navigate = useNavigate();
  
  return (
    <PageWrapper>
      {/* 돌아가기 버튼 */}
      <BackButtonWrapper>
        <StyledLeftArrowIcon onClick={() => navigate(-1)}/>
        <BackButtonText onClick={() => navigate(-1)}>
          테마 선택으로 돌아가기
        </BackButtonText>
      </BackButtonWrapper>

      {/* 콘텐츠 영역 */}
      <ContentWrapper>
        {/* 테마 카드 */}
        <ThemeOverviewCard />

        {/* 테마 상세 정보 */}
        <ThemeInfoSection />
      </ContentWrapper>
    </PageWrapper>
  )
}

export default ThemeDetailPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
`;

const BackButtonWrapper = styled.div`
  width: 70rem;
  display: flex;
  align-items: center;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const BackButtonText = styled.div`
  padding-left: 0.625rem;
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 1rem;
  line-height: normal;
  cursor: pointer;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 70rem;
  justify-content: space-between;
  align-items: flex-start;
`;