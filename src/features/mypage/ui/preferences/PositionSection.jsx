import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveyState } from "../../model/surveyAtom";

function PositionSection() {
  // state 관리
  const [survey, setSurvey] = useRecoilState(surveyState);

  // 포지션 선택 상태
  const selected = survey.horrorPos;

  // 포지션 선택 함수
  const handleSelect = (value) => {
    setSurvey(prev => ({
      ...prev,
      horrorPos: prev.horrorPos === value ? null : value
    }));
  };

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        공포 테마 포지션
      </Title>

      {/* 선택 영역 */}
      <ListWrapper>
        {[
          { label: '탱', value: 'FEARLESS', description: '공포 구간도 주저 없이! 웬만한 공포 연출엔 안 놀라요.' },
          { label: '쫄탱', value: 'FEARFUL_TANK', description: '떨면서도 탱 역할을 수행할 순 있어요.' },
          { label: '마지모탱', value: 'RELUCTANT_TANK', description: '나서기는 무섭지만 떠밀려서 어쩔 수 없이 가요.' },
          { label: '변쫄', value: 'NERVOUS', description: '공포 테마가 무섭지만 계속 하고 싶어요.' },
          { label: '쫄', value: 'SCARED', description: '공포 테마는 무서워서 잘 못해요.' },
          { label: '극쫄', value: 'EXTREME_SCARED', description: '공포가 아니어도 웬만한 테마는 무서워요.' },
        ].map((item) => (
          <List key={item.value}>
            <RadioButton
              selected={selected === item.value}
              onClick={() => handleSelect(item.value)}
            />
            {item.label} : {item.description}
          </List>
        ))}
      </ListWrapper>
    </SectionWrapper>
  )
}

export default PositionSection;

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

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  align-self: stretch;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
`;

const RadioButton = styled.button`
  all: unset;
  border: 1.5px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 1.875rem;
  margin: 0.125rem;
  width: 1rem;
  height: 1rem;
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5rem;
    height: 0.5rem;
    background-color: var(--RIU_Primary-100, #718FF2);
    border-radius: 1.875rem;
    transform: translate(-50%, -50%);
    opacity: ${props => (props.selected ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;
`;
