import { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveySectionState, surveyState } from "../model/surveyAtom";
import { useNavigate } from "react-router-dom";
import RightArrow from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrow from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";
import SurveyImage from "../../../shared/assets/images/survey/surveyImage.png";
import { patchPreferencesAPI } from "../api/surveyAPI";

function SurveyInfoSection() {
  // state 관리
  const [, setSurveySection] = useRecoilState(surveySectionState);
  const [survey] = useRecoilState(surveyState);
  const [text, setText] = useState("");

  // navigate
  const navigate = useNavigate();

  // 성향조사 제출 핸들러
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
        preference: text.trim() || null,
      };

      console.log("성향조사 제출 결과: ", payload);
      const response = await patchPreferencesAPI(payload);
      console.log("성향조사 제출 결과: ", response);
      setSurveySection("complete");
    } catch (error) {
      console.error("성향조사 제출 중 오류 발생:", error);
    }
  };

  return (
    <SectionWrapper>
      <ContentWrapper>
        <ArrowWrapper>
          <StyledLeftArrow onClick={() => setSurveySection("position")}/>
          <PageNumber>
            6/6
          </PageNumber>
          <StyledRightArrow/>
        </ArrowWrapper>
        <StyeldSurveyImage src={SurveyImage}/>
        <TitleWrapper>
          <Title>
            그 외 설명하고픈 내 취향은?
          </Title>
          <Description>
            <div>이왕 하는 방탈출, 이런 건 꼭 있었으면 좋겠다!</div>
            <div>나만의 방탈출 취향 TMI를 공유해 주세요.</div>
          </Description>
        </TitleWrapper>

        {/* 선택 영역 */}
        <StyledTextarea
          placeholder="선호, 기피하는 문제 유형 등 자유로운 취향 정보를 적어주세요"
          maxLength={500}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </ContentWrapper>

      <ButtonWrapper>
        <StyledButton onClick={handleSubmitSurvey}>
          <ButtonText>제출하기</ButtonText>
        </StyledButton>
        <MainButton onClick={() => navigate('/')}>
          루미너스 메인으로 이동하기
        </MainButton>
      </ButtonWrapper>
    </SectionWrapper>
  )
}

export default SurveyInfoSection;

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

const ArrowWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const StyledLeftArrow = styled(LeftArrow)`
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
`;
const StyledRightArrow = styled(RightArrow)`
  width: 1.25em;
  height: 1.25em;
  fill: #C4C6D1;
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

const StyledTextarea = styled.textarea`
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  padding: 1.25em;
  box-sizing: border-box;
  width: 100%;
  height: 12.5em;
  resize: none;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Regular';
  font-size: 1em;
  line-height: 1.25em;
  color: var(--RIU_Monochrome-500, #515467);
  vertical-align: top;
  outline: none;

  &::placeholder {
    color: var(--RIU_Monochrome-80, #A1A4B5);
    font-family: 'Pretendard-Medium';
    font-size: 0.875em;
    line-height: 130%;
  }

  @media (max-width: 768px) {
    padding: 1.5em;
    height: 17em;
    font-size: 0.7143em;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25em;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 0.625em;
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

const MainButton = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;
