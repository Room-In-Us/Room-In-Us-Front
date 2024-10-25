import { useState } from 'react';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDrag } from 'react-use-gesture';
import LocationCard from '../assets/images/mainPage/locationCard.png';
import GenreCard from '../assets/images/mainPage/genreCard.png';
import LevelCard from '../assets/images/mainPage/levelCard.png';
import CenterLine from '../assets/images/mainPage/cardCenterLine.png';
import SearchIcon from "../assets/icons/mainPage/searchIcon.svg?react";
import EnterIcon from "../assets/icons/mainPage/enterIcon.svg?react";

function MainPage() {
    // state 관리
    const [positions, setPositions] = useState(['left', 'center', 'right']);

    // 카드 드래깅 함수
    const bind = useDrag(({ direction: [dx], down, distance }) => {
        if (!down && distance > 10) {
            if (dx > 0) {
                // 오른쪽으로 드래깅
                setPositions(([left, center, right]) => [center, right, left]);
            } else {
                // 왼쪽으로 드래깅
                setPositions(([left, center, right]) => [right, left, center]);
            }
        }
    });

    // navigate
    const navigate = useNavigate();

    return (
        <PageWrapper>
            {/* 검색 영역 */}
            <InputWrapper>
                <StyledSearchIcon/>
                <StyledInput placeholder='검색어를 입력하세요.'/>
                <StyledEnterIcon/>
            </InputWrapper>

            {/* 카드 영역 */}
            <CardWrapper {...bind()}>
                <Card className={positions[0]} onClick={() => navigate("/Level")}>
                    <StyledImg src={LevelCard} alt="숙련도"/>
                </Card>
                <Card  className={positions[1]} onClick={() => navigate("/location")}>
                    <StyledImg src={LocationCard} alt="위치"/>
                </Card>
                <Card  className={positions[2]} onClick={() => navigate("/Genre")}>
                    <StyledImg src={GenreCard} alt="장르"/>
                </Card>
            </CardWrapper>

            {/* 하단 라인 영역 */}
            <CardLineWrapper>
                <StyledCenterLine className={positions[0]} src={CenterLine} alt="하단라인"/>
                <StyledCenterLine className={positions[1]} src={CenterLine} alt="하단라인"/>
                <StyledCenterLine className={positions[2]} src={CenterLine} alt="하단라인"/>
            </CardLineWrapper>
        </PageWrapper>
    );
};

export default MainPage;

// CSS
const PageWrapper = styled.div`
    font-size: 0.95em;  // 크기 조정
    padding-top: 2em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const InputWrapper = styled.div`
    margin-bottom: 5em;
    border: 3px solid rgba(148,0,0.8);
    border-radius: 1em;
    width: 70vw;
    height: 3em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(148,0,0,0.15);
    box-shadow: 0 0.3em 1em 0.1em #111111;
`;

const StyledSearchIcon = styled(SearchIcon)`
    margin: 0 1em;
    width: 1.2em;
`;

const StyledInput = styled.input`
    flex: 1;
    border: none;
    height: 1.67em;
    background-color: transparent;
    color: #FBE8E9;
    font-size: 1.2em;
    outline: none;
`;

const StyledEnterIcon = styled(EnterIcon)`
    margin: 0 1em;
    width: 1em;
    cursor: pointer;
`;

const CardWrapper = styled.div`
    position: relative;
    margin: 0 10%;
    width: 80%;
    height: 25em;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 1500px;
`;

const Card = styled.div`
    position: absolute;
    border-radius: 2em;
    width: 28.40574em;
    height: 26.22818em;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease;
    will-change: transform;
    backface-visibility: hidden;
    cursor: pointer;

    &.left {
        transform: translateX(-23em) scale(0.7) rotateY(70deg);
        z-index: 1;
        filter: brightness(70%);
    }

    &.center {
        transform: translateX(0) scale(1) rotateY(0deg);
        z-index: 2;
    }

    &.right {
        transform: translateX(23em) scale(0.7) rotateY(-70deg);
        z-index: 1;
        filter: brightness(70%);
    }
`;

const StyledImg = styled.img`
    border-radius: 2em;
    width: 100%;
    height: 100%;
`;

const CardLineWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    perspective: 1500px;
`;

const StyledCenterLine = styled.img`
    position: absolute;
    margin: 3em 3em 0 3em;
    width: 42.024em;
    height: 2.228em;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease;
    will-change: transform;
    backface-visibility: hidden;
    cursor: pointer;

    &.left {
        transform: translateX(-28em) scale(0.2) rotate(20deg);
        z-index: 1;
    }

    &.center {
        transform: translateY(3em) scale(1) rotateY(0deg);
        z-index: 2;
    }

    &.right {
        transform: translateX(28em) scale(0.2) rotate(-20deg);
        z-index: 1;
    }
`;
