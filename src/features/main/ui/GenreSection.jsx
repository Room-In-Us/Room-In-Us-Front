import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { genreCard } from "../model/genreCard";
import GenreCard from "./GenreCard";
import { genreList } from "../model/GenreList";

function GenreSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <Title>장르 큐레이션</Title>

      {/* 장르 버튼 영역 */}
      <LevelWrapper>
        {genreList.map((items) => (
          <LevelButton key={items.id}>
            {items.name}
          </LevelButton>
        ))}
      </LevelWrapper>

      {/* 콘텐츠 카드 영역 */}
      <ListWrapper>
        {genreCard.map((items) => (
          <GenreCard
            key={items.id}
            name={items.name}
          />
        ))}
      </ListWrapper>

      {/* 더보기 영역 */}
      <SeeMoreButton onClick={() => navigate('/genre')}>
        더보기
      </SeeMoreButton>
    </SectionWrapper>
  )
}

export default GenreSection;

// CSS
const SectionWrapper = styled.div`
  margin-top: 2rem;
  width: 50rem;
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
  width: 5.5rem;
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
