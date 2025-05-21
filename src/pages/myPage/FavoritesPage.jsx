import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../shared/assets/icons/myPage/leftArrow.svg?react";

function FavoritesPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <ContentWrapper>
        {/* 뒤로가기 버튼 */}
        <BackButtonWrapper onClick={() => navigate('/mypage')}>
          <StyledLeftArrow/>
          <BackButtonText>
            마이페이지로 돌아가기
          </BackButtonText>
        </BackButtonWrapper>

        {/* 콘텐츠 영역 */}

      </ContentWrapper>
    </PageWrapper>
  )
}

export default FavoritesPage;

// CSS
const PageWrapper = styled.div`
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  width: 36.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5rem;
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