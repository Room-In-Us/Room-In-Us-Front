import { useState } from "react";
import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveySectionState } from "../model/surveyAtom";
import { useNavigate } from "react-router-dom";
import RightArrow from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrow from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";
import SurveyImage from "../../../shared/assets/images/survey/surveyImage.png";

function SurveyHeadcountSection() {
  // state 관리
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [, setSurveySection] = useRecoilState(surveySectionState);

  // navigate
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      <ContentWrapper>
        <ArrowWrapper>
          <StyledLeftArrow onClick={() => setSurveySection("genre")}/>
          <PageNumber>
            3/6
          </PageNumber>
          <StyledRightArrow onClick={() => setSurveySection("preference")}/>
        </ArrowWrapper>
        <StyeldSurveyImage src={SurveyImage}/>
        <TitleWrapper>
          <Title>
            주로 플레이하는 인원은?
          </Title>
          <Description>
            방탈출을 몇 명이서 하는 게 가장 재미있을까요?
          </Description>
        </TitleWrapper>

        {/* 선택 영역 */}
        <ListWrapper>
          <List>
            <RadioButton
              selected={selectedLevel === 1}
              onClick={() =>
                setSelectedLevel(selectedLevel === 1 ? null : 1)
              }
            />
            1인
          </List>
          <List>
            <RadioButton
              selected={selectedLevel === 2}
              onClick={() =>
                setSelectedLevel(selectedLevel === 2 ? null : 2)
              }
            />
            2인
          </List>
          <List>
            <RadioButton
              selected={selectedLevel === 3}
              onClick={() =>
                setSelectedLevel(selectedLevel === 3 ? null : 3)
              }
            />
            3인
          </List>
          <List>
            <RadioButton
              selected={selectedLevel === 4}
              onClick={() =>
                setSelectedLevel(selectedLevel === 4 ? null : 4)
              }
            />
            4인
          </List>
          <List>
            <RadioButton
              selected={selectedLevel === 5}
              onClick={() =>
                setSelectedLevel(selectedLevel === 5 ? null : 5)
              }
            />
            5인
          </List>
          <List>
            <RadioButton
              selected={selectedLevel === 6}
              onClick={() =>
                setSelectedLevel(selectedLevel === 6 ? null : 6)
              }
            />
            6인 이상
          </List>
        </ListWrapper>
      </ContentWrapper>

      <ButtonWrapper>
        <StyledButton onClick={() => setSurveySection("preference")} isPass={!selectedLevel}>
          <ButtonText isPass={!selectedLevel}>{selectedLevel ? '다음으로' : '질문 넘기기'}</ButtonText>
        </StyledButton>
        <MainButton onClick={() => navigate('/')}>
          루미너스 메인으로 이동하기
        </MainButton>
      </ButtonWrapper>
    </SectionWrapper>
  )
}

export default SurveyHeadcountSection;

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
    height: 40.625em;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5625em;
  align-self: stretch;
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
  cursor: pointer;
`;

const PageNumber = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Bold';
  line-height: 130%;
`;

const StyeldSurveyImage = styled.img`
  height: 15em;
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
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  align-self: stretch;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
`;

const RadioButton = styled.button`
  all: unset;
  border: 1.5px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 1.875em;
  width: 1em;
  height: 1em;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5em;
    height: 0.5em;
    background-color: var(--RIU_Primary-100, #718FF2);
    border-radius: 1.875em;
    transform: translate(-50%, -50%);
    opacity: ${props => (props.selected ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25em;
  align-self: stretch;
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
  background: ${(props) =>
  (props.isPass)
      ? "var(--RIU_Monochrome-40, #DFDFE6)"
      : "var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%))"};
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
    opacity: ${(props) => (props.isPass ? "0" : "0.5")};
  }

  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const ButtonText = styled.div`
  color: ${(props) => (props.isPass ? "var(--RIU_Monochrome-100, #818496)" : "#FFF")};
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
`;
