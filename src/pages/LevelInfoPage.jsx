import React from 'react'
import styled from 'styled-components'
import JokerHead from '../assets/images/levelPage/jokerhead.png';

export default function LevelInfoPage() {
  return (
    <Wrapper>
      <Container>
        <LevelInfoBox>
          <LevelIconWrapper>
            <LevelIcon src={JokerHead} alt='레벨아이콘' />
          </LevelIconWrapper>
          <Level>방린이</Level>
          <LevelDetail>
            방탈출을 한 번도 해보지 않은 여러분들을 위해 
            대부분 가볍게 즐길 수 있는 테마로 준비했으며, 
            거의 모두가 쉽게 탈출할 수 있는 테마로 준비하였습니다!
          </LevelDetail>
        </LevelInfoBox>
        <RoomList>
          <CtgyWrapper>
            <Ctgy>지역명</Ctgy>
            <Ctgy>상세지역</Ctgy>
            <Ctgy>가게 이름</Ctgy>
            <Ctgy>테마 이름</Ctgy>
          </CtgyWrapper>
          <List></List>
        </RoomList>
      </Container>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  width: 90%;
  height: 80%;
  border-radius: 1.25em;
  background-color: #373737;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LevelInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 74.1875em;
  height: 7.4375em;
  border-radius: 6.25em;
  background-color: #B1B1B1;
`;

const LevelIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7.4375em;
  height: 7.4375em;
  border-radius: 6.25em;
  background-color: #D9D9D9;
  position: absolute;
`;

const LevelIcon = styled.img`
  width: 3.77375em;
  height: 4.840625em;
`;

const GradientText = styled.div`
  font-family: 'VitroCore';
  background: linear-gradient(to bottom, #940000 40%, #2E0000 60%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Level = styled(GradientText)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2.5em;
  font-size: 3em;
  border-right: 0.02084em solid #fff;
  width: 20%;
  height: 100%;
  text-shadow: 0 0.08em 0.08em rgba(0, 0, 0, 0.3);
`;

const LevelDetail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
  padding-left: 1.3em;
  padding-right: 1.3em;
  width: 80%;
  height: 100%;
  color: #fff;
  font-family: 'PretendardSemiBold';
`;

const RoomList = styled.div`
  width: 76.0625em;
  height: 100%;
  background-color: #787878;
  border-radius: 6.25em;
`;

const CtgyWrapper = styled.div`
  display: flex;
  color: #fff;
  font-family: 'PretendardMedium';
  background-color: #383232;
`;

const Ctgy = styled.div`
  width: 10em;
  height: 100%;
`;

const List = styled.div`
  border-bottom: 1px solid #fff;
`;