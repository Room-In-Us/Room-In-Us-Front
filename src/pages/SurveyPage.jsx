import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { surveySectionState } from '../features/survey/model/surveyAtom';
import NoiseFilter from '../shared/assets/icons/login/loginNoiseFilter.svg';
import TextLogo from '../shared/assets/icons/common/textLogo.svg?react';
import SurveyProficiencySection from '../features/survey/ui/SurveyProficiencySection';
import SurveyGenreSection from '../features/survey/ui/SurveyGenreSection';
import SurveyHeadcountSection from '../features/survey/ui/SurveyHeadcountSection';

function SignupPage() {
  const [surveySection,] = useRecoilState(surveySectionState);
  
  return (
    <PageWrapper>
      <StyledTextLogo/>

      {/* 숙련도 섹션 */}
      {(surveySection === "proficiency") && <SurveyProficiencySection />}

      {/* 장르 섹션 */}
      {(surveySection === "genre") && <SurveyGenreSection />}

      {/* 인원 섹션 */}
      {(surveySection === "headcount") && <SurveyHeadcountSection />}

      {/* 취향 섹션 */}
      {(surveySection === "preference") && <SurveyProficiencySection />}

      {/* 포지션 섹션 */}
      {(surveySection === "position") && <SurveyProficiencySection />}

      {/* 추가정보 섹션 */}
      {(surveySection === "info") && <SurveyProficiencySection />}

      {/* 완료 섹션 */}
      {(surveySection === "complete") && <SurveyProficiencySection />}

    </PageWrapper>
  );
}

export default SignupPage;

const PageWrapper = styled.div`
font-size: 0.75rem;
  width: 100vw;
  height: calc(100vh - 2.375rem);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6.25em;
  position: relative;
  z-index: 0;
  
  background-color:hsla(231,100%,89%,1);
  background-image:
    radial-gradient(at 0% 49%, hsla(212,19%,78%,1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(216,38%,77%,1) 0px, transparent 50%),
    radial-gradient(at 51% 100%, hsla(228,28%,65%,1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(232,33%,55%,1) 0px, transparent 50%),
    radial-gradient(at 100% 44%, hsla(239,57%,59%,1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(235,68%,66%,1) 0px, transparent 50%),
    radial-gradient(at 52% 0%, hsla(228,60%,81%,1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(213,20%,80%,1) 0px, transparent 50%);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${NoiseFilter});
    background-repeat: repeat;
    background-size: cover;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const StyledTextLogo = styled(TextLogo)`
  width: 35em;
  height: 15.125em;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;
