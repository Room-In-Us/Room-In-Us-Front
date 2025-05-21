import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../shared/assets/icons/myPage/leftArrow.svg?react";
import ProficiencySection from "../../features/mypage/ui/preferences/ProficiencySection";
import GenreSection from "../../features/mypage/ui/preferences/GenreSection";
import HeadcountSection from "../../features/mypage/ui/preferences/HeadcountSection";
import PreferenceSection from "../../features/mypage/ui/preferences/PreferenceSection";
import PositionSection from "../../features/mypage/ui/preferences/PositionSection";
import InfoSection from "../../features/mypage/ui/preferences/InfoSection";

function PreferencesPage() {
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

        {/* 타이틀 영역 */}
        <TitleWrapper>
          <Title>
            내 성향조사 수정하기
          </Title>
          <Description>
            방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 :&#41;
          </Description>
        </TitleWrapper>

        {/* 숙련도 섹션 */}
        <ProficiencySection/>

        {/* 장르 섹션 */}
        <GenreSection/>

        {/* 인원 섹션 */}
        <HeadcountSection/>

        {/* 취향 섹션 */}
        <PreferenceSection/>

        {/* 포지션 섹션 */}
        <PositionSection/>

        {/* 추가정보 섹션 */}
        <InfoSection/>

      </ContentWrapper>
    </PageWrapper>
  )
}

export default PreferencesPage;

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

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1.5rem;
  line-height: 130%; /* 1.95rem */
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  line-height: 130%; /* 1.3rem */
`;