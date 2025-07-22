import { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import LeftArrow from "../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import ProficiencySection from "../../features/mypage/ui/preferences/ProficiencySection";
import GenreSection from "../../features/mypage/ui/preferences/GenreSection";
import HeadcountSection from "../../features/mypage/ui/preferences/HeadcountSection";
import PreferenceSection from "../../features/mypage/ui/preferences/PreferenceSection";
import PositionSection from "../../features/mypage/ui/preferences/PositionSection";
import InfoSection from "../../features/mypage/ui/preferences/InfoSection";
import { getPreferencesAPI, patchPreferencesAPI } from "../../features/mypage/api/surveyAPI";
import { surveyState } from "../../features/mypage/model/surveyAtom";
import { useRecoilState } from 'recoil';

function PreferencesPage() {
  const [survey, setSurvey ] = useRecoilState(surveyState);
  const navigate = useNavigate();

  // 성향조회 호출 (초기값 설정)
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const data = await getPreferencesAPI();
        setSurvey({
          proficiency: data.proficiency,
          preferredGenreList: data.preferredGenreList,
          preferredHeadcount: data.preferredHeadcount,
          preferredElementList: data.preferredElementList,
          preferredActivity: data.preferredActivity,
          preferredDevice: data.preferredDevice,
          horrorPos: data.horrorPos,
          preference: data.preference,
        });
      } catch (error) {
        console.error("성향조사 데이터 로딩 실패:", error);
      }
    };

    fetchPreferences();
  }, [setSurvey]);

  // 성향조사 저장 핸들러
  const handleSubmitSurvey = async () => {
    try {
      const payload = {
        proficiency: survey.proficiency,
        preferredGenreList: survey.preferredGenreList,
        preferredHeadcount: survey.preferredHeadcount,
        preferredElementList: survey.preferredElementList,
        preferredActivity: survey.preferredActivity,
        preferredDevice: survey.preferredDevice,
        horrorPos: survey.horrorPos,
        preference: survey.preference,
      };

      console.log("성향조사 제출 결과: ", payload);
      const response = await patchPreferencesAPI(payload);
      console.log("성향조사 제출 결과: ", response);
      alert("성향조사 결과가 저장되었습니다.")
    } catch (error) {
      console.error("성향조사 제출 중 오류 발생:", error);
    }
  };

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

        {/* 저장 버튼 */}
        <StyledButton onClick={handleSubmitSurvey}>
          <ButtonText>성향조사 결과 저장하기</ButtonText>
        </StyledButton>
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

const StyledButton = styled.button`
  all: unset;
  border: none;
  display: flex;
  height: 3.125rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  border-radius: 2.5rem;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    opacity: 0;
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0.5;
  }
`;

const ButtonText = styled.div`
  color: #F9F9FB;
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
  transition: all 0.2s ease-in-out;
`;
