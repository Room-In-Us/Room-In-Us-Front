import styled from "styled-components";

function ProficiencySection({userInfo}) {
  // 숙련도 선택 상태
  const selected = userInfo ?? "";

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        숙련도
      </Title>

      {/* 선택 영역 */}
      <ListWrapper>
        <List>
          <RadioButton
            selected={selected === 'BEGINNER'}
          />
          방세포 : 0~5방 정도로 아직 방탈출에 대한 느낌을 잘 몰라요!
        </List>
        <List>
          <RadioButton
            selected={selected === 'JUNIOR'}
          />
          방초보 : 5~20방 정도 경험이 있어 어떤 느낌인지는 알아요!
        </List>
        <List>
          <RadioButton
            selected={selected === 'SENIOR'}
          />
          방중수 : 20~50방 정도의 경험이 있어 무난하게 할 수 있어요!
        </List>
        <List>
          <RadioButton
            selected={selected === 'MASTER'}
          />
          방고수 : 50+ 방 정도 경험이 있어 난이도가 상관이 없어요!
        </List>
      </ListWrapper>
    </SectionWrapper>
  )
}

export default ProficiencySection;

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

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  align-self: stretch;

  @media (max-width: 768px) {
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

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const RadioButton = styled.button`
  all: unset;
  border: 1.5px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 1.875em;
  margin: 0.125em;
  width: 1em;
  height: 1em;
  position: relative;

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

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;
