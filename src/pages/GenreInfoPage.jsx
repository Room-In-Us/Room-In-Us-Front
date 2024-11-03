import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import styled from 'styled-components'
import JokerHeadIcon from '../assets/images/genrePage/jokerheadicon.png'
import NoImage from '../assets/images/common/nophotos.png'
import { getGenreRoomListAPI } from '../apis/theme/getGenresListAPI';

export default function GenreInfoPage() {
  const location = useLocation();
  const [genreRoomList, setGenreRoomList] = useState([]);
  const [genre, setGenre] = useState(location.state.genre || 'FANTASY');
  const [page, setPage] = useState(1); // 우선 첫 페이지만 초기값으로 설정

  useEffect(() => {
    const fetchData= async () => {
      try {
        const response = await getGenreRoomListAPI(genre, page);
        console.log('받은 데이터: ', response);
        setGenreRoomList(response.contents);
        console.log('response.contents: ', response.contents);
      } catch (error) {
          console.error('장르 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    }
    fetchData();
  }, [genre, page]);


  // 레이아웃 구현 위해 임시로 만든 data
  // const genreData = [
  //   {
  //     id: 1,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 2,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 3,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 4,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 5,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 6,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 7,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  //   {
  //     id: 8,
  //     title: '키이스케이프',
  //     location: '강남',
  //     description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
  //     icon: JokerHeadIcon,
  //     image: Sample,
  //   },
  // ];

  return (
    <Wrapper>
      {genreRoomList.map((room) => (
        <InfoBox key={room.id}>
          <InfoHeader>
            <HeaderIcon src={JokerHeadIcon} />
            <TextWrapper>
              <MainText>{room.pointName}</MainText>
              <SubText>{room.stationName}</SubText>
            </TextWrapper>
          </InfoHeader>
          {room.img ? (
            <MainImg src={room.img} alt="방탈출 이미지" />
          ) : (
            <NoImgWrapper>
              <NoImg src={NoImage} alt="샘플 이미지" />
              <NoImgText>No Image</NoImgText>
            </NoImgWrapper>
          )}
          <InfoFooter>
            <InfoDetail>{room.name}</InfoDetail>
            <Button>구경하기</Button>
          </InfoFooter>
        </InfoBox>
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

const InfoBox = styled.div`
  border: 3px solid #fff;
  width: 20em;
  height: 26.3125em;
  border-radius: 0.625em;
  margin: 1em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const InfoHeader = styled.div`
  display: flex;
  padding: 1.3em;
  align-items: center;
  width: 85%;
  gap: 0.5em;
`;

const HeaderIcon = styled.img`
  width: 3em;
  height: 3em;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3em;
`;

const MainText = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 1.2em;
  color: #fff;
`;

const SubText = styled.div`
  font-family: 'Pretendard-Medium';
  color: #A9A9A9;
`;

const MainImg = styled.img`
  width: 100%;
  height: 10.9375em;
  object-fit: cover;
`;

const NoImgWrapper = styled.div`
  width: 100%;
  height: 10.9375em;
  background-color: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
`;

const NoImg = styled.img`
  width: 50%;
  height: 50%;
  object-fit: contain;
`;

const NoImgText = styled.div`
  color: #000;
  font-family: 'Pretendard-Medium';
  font-size: 1.5em;
`;

const InfoFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const InfoDetail = styled.div`
  font-family: 'Pretendard-Regular';
  color: #fff;
  padding: 1em;
  width: 90%;
  white-space: pre-line;
`;

const Button = styled.button`
  border: 1px solid #fff;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  padding-left: 0.7em;
  padding-right: 0.7em;
  border-radius: 0.3125em;
  background-color: transparent;
  color: #fff;
  margin: 1em;
  cursor: pointer;
`;