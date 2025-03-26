import { useEffect, useState } from 'react';
import styled from 'styled-components';
import GenreTabSection from '../features/genre/ui/GenreTabSection';
import GenreContentSection from '../features/genre/ui/GenreContentSection';

export default function GenrePage() {
  const [activeGenre, setActiveGenre] = useState('SENTIMENTAL');

      // 버튼 활성화 함수
      const handleGenreClick = (genre) => {
        setActiveGenre(genre);
      };
      
      useEffect(() => {
      }, [activeGenre]);

  return (
    <Wrapper>
      <GenreTabSection activeGenre={activeGenre} onGenreClick={handleGenreClick} />
      <GenreContentSection activeGenre={activeGenre} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5.625rem;
  gap: 2.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;