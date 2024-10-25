import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ComicGenre from '../assets/images/genrePage/comic.png'
import MisteryGenre from '../assets/images/genrePage/mistery.png'
import ReasoningGenre from '../assets/images/genrePage/reasoning.png'
import ThrillerGenre from '../assets/images/genrePage/thriller.png'
import Comic2Genre from '../assets/images/genrePage/comic2.png'
import FantasyGenre from '../assets/images/genrePage/fantasy.png'
import AdventureGenre from '../assets/images/genrePage/adventure.png'
import Others from '../assets/images/genrePage/others.png'
import { useNavigate } from 'react-router-dom'
import { getGenresListAPI } from '../apis/theme/getGenresListAPI'

export default function GenrePage() {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);

    const handleGenreInfo = () => {
        navigate('/genreInfo');
    }

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
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={ComicGenre} />
            <GenreText>감성</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={MisteryGenre} />
            <GenreText>공포/스릴러</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={ReasoningGenre} />
            <GenreText>추리</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={ThrillerGenre} />
            <GenreText>미스터리</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={Comic2Genre} />
            <GenreText>코믹</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={FantasyGenre} />
            <GenreText>판타지</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={AdventureGenre} />
            <GenreText>어드벤처</GenreText>
        </GenreBox>
        <GenreBox onClick={handleGenreInfo}>
            <GenreIcon src={Others} />
            <GenreText>기타</GenreText>
        </GenreBox>
    </Wrapper>
  )
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
    background: linear-gradient(to bottom, #910000 30%, #251E1E 90%);
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