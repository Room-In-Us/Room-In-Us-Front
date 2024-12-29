import styled from 'styled-components';
import Joker1 from '../shared/assets/images/level/joker1.png';
import Joker2 from '../shared/assets/images/level/joker2.png';
import Joker3 from '../shared/assets/images/level/joker3.png';
import Joker4 from '../shared/assets/images/level/joker4.png';
import JokerBack1 from '../shared/assets/images/level/jokerback1.png';
import JokerBack2 from '../shared/assets/images/level/jokerback2.png';
import JokerBack3 from '../shared/assets/images/level/jokerback3.png';
import JokerBack4 from '../shared/assets/images/level/jokerback4.png';
import Pokertable from '../shared/assets/images/level/pokertable.png';
import { useNavigate } from 'react-router-dom';

export default function LevelPage() {
  const navigate = useNavigate();

  const handleLevelInfo = (levelInfo) => {
    navigate('/levelInfo', {state: levelInfo});
  };

  return (
    <PageWrapper>
      {/* <OvalBackground/>
      <HalfOval />
      <HalfOval2 />
      <BlurOverlay /> */}
      <ImgWrapper>
        <GroupImg src={Pokertable} />
      
        
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
                      level: 'BEGINNER'
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
                      level: 'JUNIOR'
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
                      level: 'SENIOR'
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
                      level: 'MASTER'
                    })}>Play</PlayButton>
                  </ButtonWrapper>
                </CardBack>
              </CardInner>
            </CardBoxHover>
          </LevelBox>
        </LevelWrapper>
      </LayOut>
      </ImgWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - 6em);
`;

const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  width: 100%;
  height: 100%;
`;

const GroupImg = styled.img`
  width: 100%;
  height: 90vh;
  position: absolute;
  bottom: 0em;
`;

const LayOut = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const MainTitle = styled.div`
  color: #fff;
  position: absolute;
  top: 2.8em;
  font-size: 4em;
  font-family: 'Vitro-Core';
  z-index: 1000;
`;

const LevelWrapper = styled.div`
  gap: 4em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 11em;
  padding-left: 1em;
  padding-right:1em;
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
    width: 60em;
    height: 25em;
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;
    justify-content: flex-start;
  }

  @media (max-width: 65em) {
    width: 38em;
    height: 25em;
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;
    justify-content: flex-start;
    padding-left: 3em;
  }

  @media (max-width: 45em) {
    width: 16em;
    height: 25em;
    overflow-y: hidden;
    overflow-x: scroll;
    white-space: nowrap;
    justify-content: flex-start;
    padding-left: 3em;
  }
`;

const LevelBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 23em;
`;

const CardBox = styled.div`
  width: 13.049375em;
  height: 17.9375em;
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
  font-size: 1.5em;
  text-align: center;
  position: absolute;
  width: 6em;
  top: 2.2em;
`;

const LevelText = styled.div`
  font-family: 'Vitro-Core';
  font-size: 2.5em;
  text-align: center;
  position: absolute;
  top: 2.5em;
  text-shadow: 0 0.08em 0.08em rgba(0, 0, 0, 0.3);
`;

const LevelTextBottom = styled.div`
  font-family: 'Vitro-Inspire';
  font-size: 1.14em;
  text-align: center;
  position: absolute;
  top: 9.5em;
  width: 100%;
`;

const ButtonWrapper = styled.div`
  width: 10.85em;
  height: 3em;
  opacity: 0;
  transition: opacity 0.4s ease-in-out, transform 0.4s ease-in-out;
  position: absolute;
  bottom: -2.5em;
  backface-visibility: hidden;
`;

const PlayButton = styled.button`
  width: 100%;
  height: 100%;
  border-radius: 0.375em;
  border: none;
  background-color: #B01814;
  color: #fff;
  font-size: 2em;
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