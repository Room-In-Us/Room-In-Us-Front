import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from 'recoil';
import { surveySectionState, surveyState, modalState } from "../model/surveyAtom";
import RightArrow from "../../../shared/assets/icons/common/arrow/rightArrow.svg?react";
import LeftArrow from "../../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import SurveyImage from "../../../shared/assets/images/survey/surveyImage4.png";
import { preferredElementList, preferredDeviceList, preferredActivityList } from "../model/surveyPreferenceList";
import SurveyTag from "./SurveyTag";

function SurveyPreferenceSection() {
  // state 관리
  const [survey, setSurvey] = useRecoilState(surveyState);
  const [, setSurveySection] = useRecoilState(surveySectionState);
  const setModal = useSetRecoilState(modalState);

  // 요소 선택 상태
  const selectedElements = survey.preferredElementList;
  const selectedDevice = survey.preferredDevice;
  const selectedActivity = survey.preferredActivity;
  const isSelected = selectedElements.length > 0 || selectedDevice !== null || selectedActivity !== null;
  
  // 요소 태그 선택 핸들러
  const handleElementClick = (enumValue) => {
    const isSelected = selectedElements.includes(enumValue);
    if (isSelected) {
      setSurvey(prev => ({
        ...prev,
        preferredElementList: selectedElements.filter(e => e !== enumValue),
      }));
    } else if (selectedElements.length < 3) {
      setSurvey(prev => ({
        ...prev,
        preferredElementList: [...selectedElements, enumValue],
      }));
    }
  };

  // 장치 태그 선택 핸들러
  const handleDeviceClick = (enumValue) => {
    setSurvey(prev => ({
      ...prev,
      preferredDevice: selectedDevice === enumValue ? null : enumValue,
    }));
  };

  // 활동성 태그 선택 핸들러
  const handleActivityClick = (enumValue) => {
    setSurvey(prev => ({
      ...prev,
      preferredActivity: selectedActivity === enumValue ? null : enumValue,
    }));
  };

  return (
    <SectionWrapper>
      <ContentWrapper>
        <ArrowWrapper>
          <StyledLeftArrow onClick={() => setSurveySection("headcount")}/>
          <PageNumber>
            4/6
          </PageNumber>
          <StyledRightArrow onClick={() => setSurveySection("position")}/>
        </ArrowWrapper>
        <StyeldSurveyImage src={SurveyImage}/>
        <TitleWrapper>
          <Title>
            나의 방탈출 취향은?
          </Title>
          <Description>
            <div>방탈출에서 가장 중요하게 보는 요소는?</div>
            <div>스토리? 연출? 문제?</div>
          </Description>
        </TitleWrapper>

        {/* 선택 영역 */}
        <CheckWrapper>
          <ListWrapper>
            <ListTitleWrapper>
              <ListTitle>
                중요하게 보는 요소
              </ListTitle>
              <ListDescription>
                최대 3개까지 선택 가능합니다
              </ListDescription>
            </ListTitleWrapper>
            <ElementList>
              {preferredElementList.map((item) => (
                <SurveyTag
                  key={item.id}
                  item={item.value}
                  selected={selectedElements.includes(item.enum)}
                  onClick={() => handleElementClick(item.enum)}
                  disabled={!selectedElements.includes(item.enum) && selectedElements.length >= 3}
                />
              ))}
            </ElementList>
          </ListWrapper>
          <ListWrapper>
            <ListTitle>
              장치 vs 자물쇠
            </ListTitle>
            <List>
              {preferredDeviceList.map((item) => (
                <SurveyTag
                  key={item.id}
                  item={item.value}
                  selected={selectedDevice === item.enum}
                  onClick={() => handleDeviceClick(item.enum)}
                />
              ))}
            </List>
          </ListWrapper>
          <ListWrapper>
            <ListTitle>
              활동성
            </ListTitle>
            <List>
              {preferredActivityList.map((item) => (
                <SurveyTag
                  key={item.id}
                  item={item.value}
                  selected={selectedActivity === item.enum}
                  onClick={() => handleActivityClick(item.enum)}
                />
              ))}
            </List>
          </ListWrapper>
        </CheckWrapper>
      </ContentWrapper>

      <ButtonWrapper>
        <StyledButton onClick={() => setSurveySection("position")} isPass={!isSelected}>
          <ButtonText isPass={!isSelected}>{isSelected ? '다음으로' : '질문 넘기기'}</ButtonText>
        </StyledButton>
        <MainButton onClick={() => setModal(true)}>
          루미너스 메인으로 이동하기
        </MainButton>
      </ButtonWrapper>
    </SectionWrapper>
  )
}

export default SurveyPreferenceSection;

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

const CheckWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
  align-self: stretch;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.625em;
  align-self: stretch;
`;

const ListTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ListTitle = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 0.875em;
  font-style: normK;
  line-height: 1.25em;
  letter-spacing: -0.02188em;

  @media (max-width: 768px) {
    font-size: 0.7143em;
  }
`;

const ListDescription =styled.div`
  color: var(--RIU_Monochrome-70, #B3B6C3);
  font-family: 'Pretendard-Medium';
  font-size: 0.75em;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.7143em;
  }
`;

const ElementList = styled.div`
  width: 100%;
  display: flex;
  flex-flow: wrap;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    gap: 0.8125em 0.625em;
  }
`;

const List = styled.div`
  display: flex;
  width: 27.5em;
  align-items: center;
  gap: 0.625em;

  @media (max-width: 768px) {
    gap: 0.625em;
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
