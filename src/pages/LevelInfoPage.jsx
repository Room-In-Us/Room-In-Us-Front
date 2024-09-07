import React from 'react'
import styled from 'styled-components'
import JokerHead from '../assets/images/levelPage/jokerhead.png';

export default function LevelInfoPage() {
  const roomData = [
    {
      id: 1,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 2,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 3,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 4,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 5,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 6,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 7,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 8,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 9,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 10,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
    {
      id: 11,
      region: '서울',
      detailRegion: '강남',
      shopName: '미스터리룸 이스케이프',
      themeName: '인형괴담',
    },
  ];

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
          <TableHeaderWrapper>
            <TableHeader1>지역명</TableHeader1>
            <TableHeader2>상세지역</TableHeader2>
            <TableHeader3>가게 이름</TableHeader3>
            <TableHeader4>테마 이름</TableHeader4>
          </TableHeaderWrapper>
          <Table>
            <tbody>
              {roomData.map((room) => (
                <TableRow key={room.id}>
                  <TableData>{room.region}</TableData>
                  <TableData>{room.detailRegion}</TableData>
                  <TableData>{room.shopName}</TableData>
                  <TableData>{room.themeName}</TableData>
                </TableRow>
              ))}
            </tbody>
          </Table>
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
  width: 85%;
  height: 100%;
  border-radius: 1.25em;
  background-color: #373737;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2em;
  padding: 2.5em;
  margin: 1.5em;
`;

const LevelInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 74.1875em;
  height: 7.4375em;
  border-radius: 6.25em;
  background-color: #B1B1B1;
  position: relative;
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
  font-family: 'Vitro-Core';
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
  font-family: 'Pretendard-SemiBold';
`;

const RoomList = styled.div`
  width: 76.0625em;
  height: 28em;
  background-color: #787878;
  border-radius: 0.9375em;
  padding: 0.5em;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8x;
    background: none;
  }
  &:hover::-webkit-scrollbar-thumb {
      border-radius: 30px;
      background-color: darkgray;
  }
`;

const Table = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  margin-top: 3em;
`;

const TableRow = styled.tr``;

const TableHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 72.0625em;
  margin-right: 2em;
  margin-left: 2em;
  position: absolute;
`;

const TableHeader1 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 5em;
`;

const TableHeader2 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 7.8em;
`;

const TableHeader3 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 24.3em;
`;

const TableHeader4 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 9.8em;
`;

const TableData = styled.td`
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  padding-left: 1em;
  padding-right: 1em;
  text-align: center;
  border-bottom: 1px solid #fff;
  height: 2.375em;
`;