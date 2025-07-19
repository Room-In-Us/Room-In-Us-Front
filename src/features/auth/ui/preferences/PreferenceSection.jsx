import styled from "styled-components";
import { preferredElementList, preferredDeviceList, preferredActivityList } from "../../../mypage/model/surveyPreferenceList";
import SurveyTag from "./SurveyTag";

function PreferenceSection({elementInfo, deviceInfo, activityInfo}) {
  // 요소 선택 상태
  const selectedElements = elementInfo ?? [];
  const selectedDevice = deviceInfo ?? "";
  const selectedActivity = activityInfo ?? "";

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        나의 방탈출 취향
      </Title>

      {/* 선택 영역 */}
      <CheckWrapper>
        <ListWrapper>
          <ListTitleWrapper>
            <ListTitle>
              중요하게 보는 요소
            </ListTitle>
          </ListTitleWrapper>
          <ElementList>
            {preferredElementList.map((item) => (
              <SurveyTag
                key={item.id}
                item={item.value}
                selected={selectedElements.includes(item.enum)}
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
  gap: 1.25em;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 1em;
  }
`;

const Title = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.875em;
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
  line-height: 130%;
  letter-spacing: -0.02188em;

  @media (max-width: 768px) {
    font-size: 0.625em;
    letter-spacing: -0.01563em;
  }
`;

const ElementList = styled.div`
  display: flex;
  width: 27.5em;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    width: 90%;
    justify-content: start;
    gap: 0.8125em 0.625em;
    flex-wrap: wrap;
  }
`;

const List = styled.div`
  width: 27.5em;
  display: flex;
  align-items: center;
  gap: 0.625em;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
