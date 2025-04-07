import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveySectionState, surveyState } from "../model/surveyAtom";
import { useNavigate } from "react-router-dom";
import RightArrow from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrow from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";
import SurveyImage from "../../../shared/assets/images/survey/surveyImage.png";

function SurveyProficiencySection() {
  // state 관리
  const [, setSurveySection] = useRecoilState(surveySectionState);
  const [survey, setSurvey] = useRecoilState(surveyState);

  // navigate
  const navigate = useNavigate();

  // 숙련도 선택 상태
  const selected = survey.proficiency;

  // 숙련도 저장 함수
  const handleSelect = (value) => {
    setSurvey(prev => ({
      ...prev,
      proficiency: prev.proficiency === value ? null : value,
    }));
  };

  // 섹션 이동 함수
  const goNext = () => {
    setSurveySection("genre");
  };

  return (
    <SectionWrapper>
      <ContentWrapper>
        <ArrowWrapper>
          <StyledLeftArrow/>
          <PageNumber>
            1/6
          </PageNumber>
          <StyledRightArrow onClick={() => setSurveySection("genre")}/>
        </ArrowWrapper>
        <StyeldSurveyImage src={SurveyImage}/>
        <TitleWrapper>
          <Title>
            나의 방탈출 숙련도는?
          </Title>
          <Description>
            초보부터 고수까지! 경험치에 맞는 테마를 추천해 드릴게요.
          </Description>
        </TitleWrapper>

        {/* 선택 영역 */}
        <ListWrapper>
          <List>
            <RadioButton
              selected={selected === 'BEGINNER'}
              onClick={() => handleSelect('BEGINNER')}
            />
            방세포 : 0~5방 정도로 아직 방탈출에 대한 느낌을 잘 몰라요!
          </List>
          <List>
            <RadioButton
              selected={selected === 'JUNIOR'}
              onClick={() => handleSelect('JUNIOR')}
            />
            방초보 : 5~20방 정도 경험이 있어 어떤 느낌인지는 알아요!
          </List>
          <List>
            <RadioButton
              selected={selected === 'SENIOR'}
              onClick={() => handleSelect('SENIOR')}
            />
            방중수 : 20~50방 정도의 경험이 있어 무난하게 할 수 있어요!
          </List>
          <List>
            <RadioButton
              selected={selected === 'MASTER'}
              onClick={() => handleSelect('MASTER')}
            />
            방고수 : 50+ 방 정도 경험이 있어 난이도가 상관이 없어요!
          </List>
        </ListWrapper>
      </ContentWrapper>

      <ButtonWrapper>
        <StyledButton onClick={goNext} isPass={!selected}>
          <ButtonText isPass={!selected}>{selected ? '다음으로' : '질문 넘기기'}</ButtonText>
        </StyledButton>
        <MainButton onClick={() => navigate('/')}>
          루미너스 메인으로 이동하기
        </MainButton>
      </ButtonWrapper>
    </SectionWrapper>
  )
}

export default SurveyProficiencySection;

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
  fill: #C4C6D1;
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
  gap: 0.625em;
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

  @media(max-width: 768px) {
    font-size: 0.75em;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  align-self: stretch;

  @media(max-width: 768px) {
    gap: 1em;
  }
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

  @media(max-width: 768px) {
    font-size: 0.65em;
    line-height: 100%;
  }
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

  @media(max-width: 768px) {
    border-width: 1px;
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
  color: ${(props) => (props.isPass ? "var(--RIU_Monochrome-100, #818496)" : "#F9F9FB")};
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
