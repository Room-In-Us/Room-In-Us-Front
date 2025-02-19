import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { levelCard } from "../model/levelCard";
import LevelCard from "./LevelCard";

function LevelSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <Title>숙련도 관련</Title>

      {/* 레벨 버튼 영역 */}
      <LevelWrapper>
        <LevelButton>초수</LevelButton>
        <LevelButton>중수</LevelButton>
        <LevelButton>고수</LevelButton>
        <LevelButton>초고수</LevelButton>
      </LevelWrapper>

      {/* 콘텐츠 카드 영역 */}
      <ListWrapper>
        {levelCard.map((items) => (
          <LevelCard
            key={items.id}
            name={items.name}
          />
        ))}
      </ListWrapper>

      {/* 더보기 영역 */}
      <SeeMoreButton onClick={() => navigate('/level')}>
        더보기
      </SeeMoreButton>
    </SectionWrapper>
  )
}

export default LevelSection;

// CSS
const SectionWrapper = styled.div`
  margin-top: 2rem;
  width: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h3`
  width: 100%;
  color: white;
`;

const LevelWrapper = styled.div`
  margin-bottom: 1rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const LevelButton = styled.button`
  border: none;
  border-radius: 50px;
  width: 10rem;
  height: 2.5rem;
  cursor: pointer;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
`;

const SeeMoreButton = styled.button`
  margin-top: 1rem;
  border: none;
  width: 100%;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: lightgray;
  cursor: pointer;
`;
