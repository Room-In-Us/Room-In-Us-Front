import { useState, useEffect } from 'react';
import styled from 'styled-components';
import JokerHead from '../shared/assets/images/level/jokerhead.png';
import { useLocation } from 'react-router-dom';
import { getProficiencyListAPI } from '../features/levelInfo/api/levelInfoAPI'; // api 파일

export default function LevelInfoPage() {
  // state 관리
  const [profName, setProfName] = useState([]);
  const [profDescription, setProfDescription] = useState([]);
  const [cafeLists, setCafeLists] = useState([]);
  const [page] = useState('1');

  // useLocation
  const location = useLocation();
  const { level } = location.state || {};

  // const roomData = [
  //   {
  //     id: 1,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 2,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 3,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 4,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 5,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 6,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 7,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 8,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 9,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 10,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  //   {
  //     id: 11,
  //     region: '서울',
  //     detailRegion: '강남',
  //     shopName: '미스터리룸 이스케이프',
  //     themeName: '인형괴담',
  //   },
  // ];

  // 임시
  // const page = '1';

  // 방탈출 정보 불러오기
  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await getProficiencyListAPI(level, page);
        console.log('받은 데이터:', response);
        setProfName(response.profName); // 레벨
        setProfDescription(response.profDescription); // 설명
        setCafeLists(response.contents); // 리스트
      } catch (error) {
        console.error('카페 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchStudies();
  }, [level, page]);

  return (
    <Wrapper>
      <Container>
        <LevelInfoBox>
          <LevelIconWrapper>
            <LevelIcon src={JokerHead} alt="레벨아이콘" />
          </LevelIconWrapper>
          <Level>{profName}</Level>
          <LevelDetail>{profDescription}</LevelDetail>
        </LevelInfoBox>
        <RoomListWrapper>
          <TableHeaderWrapper>
            <TableHeader1>지역명</TableHeader1>
            <TableHeader2>상세지역</TableHeader2>
            <TableHeader3>가게 이름</TableHeader3>
            <TableHeader4>테마 이름</TableHeader4>
          </TableHeaderWrapper>
          <RoomList>
            <Table>
              <tbody>
                {cafeLists.map((cafe) => (
                  <TableRow key={cafe.themeId}>
                    <TableData>{cafe.cityName}</TableData>
                    <TableData>{cafe.townName}</TableData>
                    <TableData>{cafe.pointName}</TableData>
                    <TableData>{cafe.themeName}</TableData>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </RoomList>
        </RoomListWrapper>
      </Container>
    </Wrapper>
  );
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
  padding: 3em;
  margin: 1.5em;
`;

const LevelInfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 7.4375em;
  border-radius: 6.25em;
  background-color: #b1b1b1;
  position: relative;
`;

const LevelIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7.4375em;
  height: 7.4375em;
  border-radius: 6.25em;
  background-color: #d9d9d9;
  position: absolute;
`;

const LevelIcon = styled.img`
  width: 3.77375em;
  height: 4.840625em;
`;

const GradientText = styled.div`
  font-family: 'Vitro-Core';
  background: linear-gradient(to bottom, #940000 40%, #2e0000 60%);
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

const RoomListWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RoomList = styled.div`
  width: 100%;
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
  // margin-
`;

const TableRow = styled.tr``;

const TableHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  margin-top: 0.5%;
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
  width: 8%;
`;

const TableHeader2 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 14%;
`;

const TableHeader3 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 42%;
`;

const TableHeader4 = styled.div`
  padding: 0.6em;
  background-color: rgba(56, 50, 50, 0.7);
  color: #fff;
  font-family: 'Pretendard-Medium';
  font-size: 1.3em;
  text-align: center;
  border-radius: 0.9615em;
  width: 17%;
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
