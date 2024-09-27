import React from 'react';
import styled from 'styled-components';
import Joker1 from '../assets/images/levelPage/joker1.png';
import Joker2 from '../assets/images/levelPage/joker2.png';
import Joker3 from '../assets/images/levelPage/joker3.png';
import Joker4 from '../assets/images/levelPage/joker4.png';
import JokerBack1 from '../assets/images/levelPage/jokerback1.png';
import JokerBack2 from '../assets/images/levelPage/jokerback2.png';
import JokerBack3 from '../assets/images/levelPage/jokerback3.png';
import JokerBack4 from '../assets/images/levelPage/jokerback4.png';
import noiseImage from '../assets/images/levelPage/noise.png';
import { useNavigate } from 'react-router-dom';

export default function LevelPage() {
  const navigate = useNavigate();

  const handleLevelInfo = (levelInfo) => {
    navigate('/levelInfo', {state: levelInfo});
  };

  return (
    <PageWrapper>
      <OvalBackground>
        <HalfOval />
      </OvalBackground>
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
                    <PlayButton onClick={() => handleLevelInfo({
                      level: '방린이',
                      description: '방탈출을 한 번도 해보지 않은 여러분들을 위해 대부분 가볍게 즐길 수 있는 테마로 준비했으며, 거의 모두가 쉽게 탈출할 수 있는 테마로 준비하였습니다!'
                    })}>Play</PlayButton>
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
                    <PlayButton onClick={() => handleLevelInfo({
                      level: '방초보',
                      description: '방초보 레벨에 대한 설명'
                    })}>Play</PlayButton>
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
                    <PlayButton onClick={() => handleLevelInfo({
                      level: '방중수',
                      description: '방중수 레벨에 대한 설명'
                    })}>Play</PlayButton>
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
                    <PlayButton onClick={() => handleLevelInfo({
                      level: '방고인물',
                      description: '방고인물 레벨에 대한 설명'
                    })}>Play</PlayButton>
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

const OvalBackground = styled.div`
  position: absolute;
  top: 7em;
  width: 114em;
  height: 66.125em;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -3;
  overflow: hidden;
  clip-path: ellipse(57em 33.0625em at 50% 50%);

  &:before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    z-index: -2;

    background: url(${noiseImage}), #940000;
    box-shadow: 0em 0.25em 1.875em 1.875em rgba(0, 0, 0, 0.25), inset 0em 0.25em 6.25em 3.75em rgba(0, 0, 0, 0.5);
    filter: blur(0.125em);
  }

  &:after {
    content: '';
    position: absolute;
    top: 6em;
    left: calc(50% - 114em/2);
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 0.3125em solid #C4C4C4;
    box-sizing: border-box;
    box-shadow: inset 0 0.25em 0.25em rgba(0, 0, 0, 0.25);
    z-index: -2;
  }
`;

const HalfOval = styled.div`
  position: absolute;
  top: 52em;
  width: 114em;
  height: 66.125em;
  border-radius: 50%;
  border: 0.3125em solid #C4C4C4;
  z-index: -2;
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
  margin-top: 0.8em;
  z-index: 1000;
`;

const LevelWrapper = styled.div`
  gap: 2em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 2em;
  width: 100%;
  height: 100%;

  scroll-behavior: smooth;

  &::-webkit-scrollbar {
      width: 0.5em;
      height: 0.5em;
      background: none;
  }

  &:hover::-webkit-scrollbar-thumb {
    border-radius: 1.875em;
    background-color: #B01814;
  }

  @media (max-width: 90em) {
    width: 70em;
    height: 31em;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  @media (max-width: 65em) {
    width: 50em;
    height: 31em;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  @media (max-width: 45em) {
    width: 20em;
    height: 31em;
    overflow-y: scroll;
    overflow-x: hidden;
  }
`;

const LevelBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 30em;
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