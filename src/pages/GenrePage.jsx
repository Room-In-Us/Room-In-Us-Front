import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ComicGenre from '../shared/assets/images/genre/comic.png';
import MisteryGenre from '../shared/assets/images/genre/mistery.png';
import ReasoningGenre from '../shared/assets/images/genre/reasoning.png';
import ThrillerGenre from '../shared/assets/images/genre/thriller.png';
import Comic2Genre from '../shared/assets/images/genre/comic2.png';
import FantasyGenre from '../shared/assets/images/genre/fantasy.png';
import AdventureGenre from '../shared/assets/images/genre/adventure.png';
import Others from '../shared/assets/images/genre/others.png';
import { useNavigate } from 'react-router-dom';
import { getGenresListAPI } from '../features/genre/api/genreAPI';

export default function GenrePage() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);

  const genreImages = {
    SENTIMENTAL: ComicGenre,
    HORROR: MisteryGenre,
    DETECTIVE: ReasoningGenre,
    COMIC: Comic2Genre,
    MYSTERY: ThrillerGenre,
    FANTASY: FantasyGenre,
    ADVENTURE: AdventureGenre,
    ETC: Others,
  };

  const handleGenreInfo = (selectedGenre) => {
    navigate('/genreInfo', { state: { genre: selectedGenre } });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGenresListAPI();
        console.log('받은 데이터: ', response);
        setGenres(response);
      } catch (error) {
        console.error('장르 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Wrapper>
      {genres.map((genreItem, index) => (
        <GenreBox key={index} onClick={() => handleGenreInfo(genreItem.genreEnum)}>
          <GenreIcon src={genreImages[genreItem.genreEnum]} />
          <GenreText>{genreItem.genre}</GenreText>
        </GenreBox>
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const GenreBox = styled.div`
  width: 17.8125em;
  height: 20.5625em;
  background: linear-gradient(to bottom, #910000 30%, #251e1e 90%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.9375em;
  margin: 2em;
  box-shadow: 0 1em 2em 0 rgba(255, 121, 121, 0.15);
  gap: 2em;
  cursor: pointer;
`;

const GenreIcon = styled.img`
  width: 10.875em;
  height: 10.875em;
`;

const GenreText = styled.div`
  font-family: 'esamanru-Bold';
  color: #fff;
  font-size: 2.5em;
`;
