import { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveySectionState, surveyState } from "../../model/surveyAtom";
import { patchPreferencesAPI } from "../../api/surveyAPI";

function InfoSection() {
  // state 관리
  const [, setSurveySection] = useRecoilState(surveySectionState);
  const [survey, setSurvey] = useRecoilState(surveyState);
  const [text, setText] = useState(survey.preference || "");

  // 입력 핸들러
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    setSurvey(prev => ({
      ...prev,
      preference: newText.trim(),
    }));
  };

  // 성향조사 제출 핸들러
  const handleSubmitSurvey = async () => {
    // try {
    //   const payload = {
    //     proficiency: survey.proficiency,
    //     preferredGenreList: survey.preferredGenreList,
    //     preferredHeadcount: survey.preferredHeadcount,
    //     preferredElementList: survey.preferredElementList,
    //     preferredActivity: survey.preferredActivity,
    //     preferredDevice: survey.preferredDevice,
    //     horrorPos: survey.horrorPos,
    //     preference: text.trim() || null,
    //   };

    //   console.log("성향조사 제출 결과: ", payload);
    //   const response = await patchPreferencesAPI(payload);
    //   console.log("성향조사 제출 결과: ", response);
    //   setSurveySection("complete");
    // } catch (error) {
    //   console.error("성향조사 제출 중 오류 발생:", error);
    // }
  };

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        그 외 설명하고 싶은 나의 취향
      </Title>

      <ContentWrapper>
        {/* 선택 영역 */}
        <StyledTextarea
          placeholder="선호, 기피하는 문제 유형 등 자유로운 취향 정보를 적어주세요"
          maxLength={500}
          value={text}
          onChange={handleTextChange}
        />
      </ContentWrapper>

      <ButtonWrapper>
        <StyledButton onClick={handleSubmitSurvey}>
          <ButtonText>성향조사 결과 저장하기</ButtonText>
        </StyledButton>
      </ButtonWrapper>
    </SectionWrapper>
  )
}

export default InfoSection;

// CSS
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  align-self: stretch;
`;

const Title = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.125rem;
  line-height: normal;
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
