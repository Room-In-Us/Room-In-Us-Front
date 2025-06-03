import styled from "styled-components";
import { useRecoilState, useResetRecoilState } from 'recoil';
import { surveySectionState, surveyState } from "../model/surveyAtom";
import { useNavigate } from "react-router-dom";
import SurveyImage from "../../../shared/assets/images/survey/surveyImage7.png";

function SurveyCompleteSection() {
  // state 관리
    const [, setSurveySection] = useRecoilState(surveySectionState);
    const resetSurvey = useResetRecoilState(surveyState);

  // navigate
  const navigate = useNavigate();

  // 홈 이동 핸들러
  const handleNavigateMain = () => {
    setSurveySection("proficiency");
    resetSurvey();
    navigate('/');
  };

  return (
    <SectionWrapper>
      <ContentWrapper>
        <PageNumber>
          Finish
        </PageNumber>
        <StyeldSurveyImage src={SurveyImage}/>
        <TitleWrapper>
          <Title>
            성향조사가 완료되었습니다!
          </Title>
          <Description>
            루미너스에 가입해주셔서 감사합니다!
          </Description>
        </TitleWrapper>
      </ContentWrapper>

      <StyledButton onClick={handleNavigateMain}>
        <ButtonText>루미너스 메인으로</ButtonText>
      </StyledButton>
    </SectionWrapper>
  )
}

export default SurveyCompleteSection;

// CSS
const SectionWrapper = styled.div`
  border-radius: 1.875em;
  padding: 1.875em 2.5em;
  box-sizing: border-box;
  width: 32.5em;
  height: 50em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  background-color: #FFF;
  z-index: 1;

  @media (max-width: 768px) {
    border-radius: 0.9375em;
    padding: 1.25em;
    width: 20.9375em;
    height: 43.75em;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5625em;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 1.25em;
  }
`;

const PageNumber = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Bold';
  line-height: 130%;

  @media(max-width: 768px) {
    font-size: 0.75em;
  }
`;

const StyeldSurveyImage = styled.img`
  height: 15em;

  @media(max-width: 768px) {
    height: 11.875em;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.62em;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: 130%;
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media(max-width: 768px) {
    font-size: 0.75em;
  }
`;

const StyledButton = styled.button`
  all: unset;
  border: none;
  display: flex;
  height: 3.125em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  border-radius: 2.5em;
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

  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const ButtonText = styled.div`
  color: #F9F9FB;
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;
