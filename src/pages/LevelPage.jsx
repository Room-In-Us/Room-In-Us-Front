import React from 'react';
import styled from 'styled-components';
import PokerTable from '../assets/images/levelPage/pokertable.png';
import TableLine from '../assets/images/levelPage/tableline.png';
import Joker1 from '../assets/images/levelPage/joker1.png';
import Joker2 from '../assets/images/levelPage/joker2.png';
import Joker3 from '../assets/images/levelPage/joker3.png';
import Joker4 from '../assets/images/levelPage/joker4.png';
import JokerBack1 from '../assets/images/levelPage/jokerback1.png';
import JokerBack2 from '../assets/images/levelPage/jokerback2.png';
import JokerBack3 from '../assets/images/levelPage/jokerback3.png';
import JokerBack4 from '../assets/images/levelPage/jokerback4.png';
import { useNavigate } from 'react-router-dom';

export default function ProficiencyPage() {
  const navigate = useNavigate();

  const handleLevelInfo = () => {
    navigate('/levelInfo');
  }

  return (
    <PageWrapper>
      <PokerTableImg src={PokerTable} alt="배경이미지" />
      <TableLineImg src={TableLine} alt="배경도형" />
      <LayOut>
        <MainTitle>숙련도</MainTitle>
        <LevelWrapper>
          <LevelBox>
            <CardBoxHover>
              <CardInner>
                <CardFront src={Joker1} alt="카드앞면1" />
                <CardBack $backgroundImage={JokerBack1}>
                  <TextWrapper>
                    <LevelTextTop>STEP 1</LevelTextTop>
                    <LevelText>방린이</LevelText>
                    <LevelTextBottom>
                      한번도 방탈출
                      <br />
                      해보지 않았어요.
                      <br />
                    </LevelTextBottom>
                  </TextWrapper>
                  <ButtonWrapper>
                    <PlayButton onClick={handleLevelInfo}>Play</PlayButton>
                  </ButtonWrapper>
                </CardBack>
              </CardInner>
            </CardBoxHover>
          </LevelBox>
          <LevelBox>
            <CardBoxHover>
              <CardInner>
                <CardFront src={Joker2} alt="카드앞면2" />
                <CardBack $backgroundImage={JokerBack2}>
                  <TextWrapper>
                    <LevelTextTop>STEP 2</LevelTextTop>
                    <LevelText>방초보</LevelText>
                    <LevelTextBottom>
                      0-10 방 정도 경험이
                      <br />
                      있어 어떤 느낌인지
                      <br />
                      알아요!
                    </LevelTextBottom>
                  </TextWrapper>
                  <ButtonWrapper>
                    <PlayButton onClick={handleLevelInfo}>Play</PlayButton>
                  </ButtonWrapper>
                </CardBack>
              </CardInner>
            </CardBoxHover>
          </LevelBox>
          <LevelBox>
            <CardBoxHover>
              <CardInner>
                <CardFront src={Joker3} alt="카드앞면3" />
                <CardBack $backgroundImage={JokerBack3}>
                  <TextWrapper>
                    <LevelTextTop>STEP 3</LevelTextTop>
                    <LevelText>방중수</LevelText>
                    <LevelTextBottom>
                      10-50 방 정도의
                      <br />
                      경험이 있어 무난하게
                      <br />
                      할 수 있어요!
                    </LevelTextBottom>
                  </TextWrapper>
                  <ButtonWrapper>
                    <PlayButton onClick={handleLevelInfo}>Play</PlayButton>
                  </ButtonWrapper>
                </CardBack>
              </CardInner>
            </CardBoxHover>
          </LevelBox>
          <LevelBox>
            <CardBoxHover>
              <CardInner>
                <CardFront src={Joker4} alt="카드앞면4" />
                <CardBack $backgroundImage={JokerBack4}>
                  <TextWrapper>
                    <LevelTextTop>STEP 4</LevelTextTop>
                    <LevelText>방고인물</LevelText>
                    <LevelTextBottom>
                      100+ 방 정도 경험이
                      <br />
                      있어 난이도가 상관
                      <br />
                      없어요!
                    </LevelTextBottom>
                  </TextWrapper>
                  <ButtonWrapper>
                    <PlayButton onClick={handleLevelInfo}>Play</PlayButton>
                  </ButtonWrapper>
                </CardBack>
              </CardInner>
            </CardBoxHover>
          </LevelBox>
        </LevelWrapper>
      </LayOut>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const LayOut = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6em;
`;

const MainTitle = styled.div`
  color: #fff;
  font-size: 4em;
  font-family: 'Vitro-Core';
  margin-top: 1em;
  z-index: 1000;
`;

const PokerTableImg = styled.img`
  position: absolute;
  top: 4em;
  width: 100%;
  z-index: -2;
`;

const TableLineImg = styled.img`
  position: absolute;
  top: 14em;
  width: 100%;
  z-index: -1;
`;

const LevelWrapper = styled.div`
  display: flex;
  gap: 2em;
`;

const LevelBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CardBox = styled.div`
  width: 19.049375em;
  height: 24.9375em;
  position: relative;
  perspective: 62.5em;
`;

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.6s;
  transform-style: preserve-3d;
`;

const CardFront = styled.img`
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  position: absolute;
`;

const CardBack = styled.div`
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(${props => props.$backgroundImage});
  background-size: cover;
  background-position: center;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 85%;
  width: 85%;
  backface-visibility: hidden;
  opacity: 0;
  transition: opacity 0.4s ease-in-out;
`;

const LevelTextTop = styled.div`
  font-family: 'Vitro-Core';
  font-size: 2em;
  text-align: center;
  position: absolute;
  width: 10em;
  top: 2.2em;
`;

const LevelText = styled.div`
  font-family: 'Vitro-Core';
  font-size: 3.5em;
  text-align: center;
  position: absolute;
  top: 2.5em;
  text-shadow: 0 0.08em 0.08em rgba(0, 0, 0, 0.3);
`;

const LevelTextBottom = styled.div`
  font-family: 'Vitro-Inspire';
  font-size: 1.5em;
  text-align: center;
  position: absolute;
  top: 10.3em;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  width: 15.0625em;
  height: 3.9375em;
  opacity: 0;
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  position: absolute;
  bottom: -4em;
  backface-visibility: hidden;
`;

const PlayButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 0.375em;
  border: none;
  background-color: #B01814;
  color: #fff;
  font-size: 2.5em;
  font-family: 'Vitro-Core';
  box-shadow: 0 0.1em 0.1em 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
`;

const CardBoxHover = styled(CardBox)`
  &:hover ${CardInner} {
    transform: rotateY(180deg);
  }

  &:hover ${TextWrapper}, &:hover ${ButtonWrapper} {
    opacity: 1;
  }
`;