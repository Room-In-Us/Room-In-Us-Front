import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveyState } from "../../model/surveyAtom";

function HeadcountSection() {
  // state 관리
  const [survey, setSurvey] = useRecoilState(surveyState);

  // 인원수 선택 상태
  const selected = survey.preferredHeadcount;

  // 인원수 선택 함수
  const handleSelect = (value) => {
    setSurvey(prev => ({
      ...prev,
      preferredHeadcount: prev.preferredHeadcount === value ? null : value
    }));
  };

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        선호 인원
      </Title>

      {/* 선택 영역 */}
      <ListWrapper>
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <List key={num}>
            <RadioButton
              selected={selected === num}
              onClick={() => handleSelect(num)}
            />
            {num === 6 ? '6인 이상' : `${num}인`}
          </List>
        ))}
      </ListWrapper>
    </SectionWrapper>
  )
}

export default HeadcountSection;

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

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const RadioButton = styled.button`
font-size: 1rem;
  all: unset;
  border: 1.5px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 1.875em;
  margin: 0.125em;
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

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
