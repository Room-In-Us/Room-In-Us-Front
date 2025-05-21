import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveyState } from "../../model/surveyAtom";
import { preferredElementList, preferredDeviceList, preferredActivityList } from "../../model/surveyPreferenceList";
import SurveyTag from "./SurveyTag";

function PreferenceSection() {
  // state 관리
  const [survey, setSurvey] = useRecoilState(surveyState);

  // 요소 선택 상태
  const selectedElements = survey.preferredElementList;
  const selectedDevice = survey.preferredDevice;
  const selectedActivity = survey.preferredActivity;
  
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
        {/* 타이틀 */}
        <Title>
          숙련도
        </Title>

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
    </SectionWrapper>
  )
}

export default PreferenceSection;

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
