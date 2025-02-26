import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import JokerHeadIcon from '../shared/assets/images/genre/jokerheadicon.png';
import NoImage from '../shared/assets/images/common/nophotos.png';
import { getGenreRoomListAPI } from '../features/genreInfo/api/genreInfoAPI';

export default function GenreInfoPage() {
  const location = useLocation();
  const [genreRoomList, setGenreRoomList] = useState([]);
  const [genre] = useState(location.state.genre || 'FANTASY');
  const [page] = useState(1); // 우선 첫 페이지만 초기값으로 설정

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGenreRoomListAPI(genre, page);
        console.log('받은 데이터: ', response);
        setGenreRoomList(response.contents);
        console.log('response.contents: ', response.contents);
      } catch (error) {
        console.error('장르 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
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

  const genreKoreanName = {
    SENTIMENTAL: '감성',
    HORROR: '공포',
    DETECTIVE: '추리',
    COMIC: '코믹',
    MYSTERY: '미스테리',
    FANTASY: '판타지',
    ADVENTURE: '어드벤처',
    ETC: '기타',
  };

  const getKoreanGenre = (genre) => genreKoreanName[genre] || '기타';

  // const difficultyLevels = [
  //   "매우 쉬움", // 0
  //   "쉬움",     // 1
  //   "보통",     // 2
  //   "어려움",   // 3
  //   "매우 어려움", // 4
  //   "극한"      // 5
  // ];

  // 난이도 단계 임의로 처리, 추후에 수정 가능
  const getDifficultyText = (level) => {
    if (level < 0) return '알 수 없음'; // 음수는 잘못된 값 처리
    if (level < 1) return '매우 쉬움'; // 0.0 ~ 0.9
    if (level < 2) return '쉬움'; // 1.0 ~ 1.9
    if (level < 3) return '보통'; // 2.0 ~ 2.9
    if (level < 4) return '어려움'; // 3.0 ~ 3.9
    if (level < 5) return '매우 어려움'; // 4.0 ~ 4.9
    if (level == 5) return '극한'; // 5.0
    return '알 수 없음'; // 5.0 초과는 기본값 처리
  };

  return (
    <Wrapper>
      <InfoHeaderWrapper>
        <InfoHeader>
          <HeaderIcon src={JokerHeadIcon} />
          <LevelText>방린이</LevelText>
        </InfoHeader>

        <InputWrapper>
          {/* <StyledSearchIcon />
          <StyledInput placeholder="검색어를 입력하세요." />
          <StyledEnterIcon /> */}
        </InputWrapper>
      </InfoHeaderWrapper>

      <InfoBoxWrapper>
        {genreRoomList.map((room) => (
          <InfoBox key={room.id}>
            {room.img ? (
              <MainImgWrapper>
                <MainImg src={room.img} alt="방탈출 이미지" />
                <Overlay className="overlay">
                  <CircleWrapper>
                    <CircleTag>난이도</CircleTag>
                    <Circle>
                      <OverlayText>{getDifficultyText(room.themeLevel)}</OverlayText>
                    </Circle>
                  </CircleWrapper>
                  <CircleWrapper>
                    <CircleTag>플레이타임</CircleTag>
                    <Circle>
                      <OverlayText>{room.themePlayTime}분</OverlayText>
                    </Circle>
                  </CircleWrapper>
                  <CircleWrapper>
                    <CircleTag>장르</CircleTag>
                    <Circle>
                      <OverlayText>{getKoreanGenre(room.themeGenre)}</OverlayText>
                    </Circle>
                  </CircleWrapper>
                </Overlay>
              </MainImgWrapper>
            ) : (
              <NoImgWrapper>
                <NoImg src={NoImage} alt="이미지 없음" />
                <NoImgText>No Image</NoImgText>
                <Overlay className="overlay">
                  <CircleWrapper>
                    <CircleTag>난이도</CircleTag>
                    <Circle>
                      <OverlayText>{getDifficultyText(room.themeLevel)}</OverlayText>
                    </Circle>
                  </CircleWrapper>
                  <CircleWrapper>
                    <CircleTag>플레이타임</CircleTag>
                    <Circle>
                      <OverlayText>{room.themePlayTime}분</OverlayText>
                    </Circle>
                  </CircleWrapper>
                  <CircleWrapper>
                    <CircleTag>장르</CircleTag>
                    <Circle>
                      <OverlayText>{getKoreanGenre(room.themeGenre)}</OverlayText>
                    </Circle>
                  </CircleWrapper>
                </Overlay>
              </NoImgWrapper>
            )}
            <InfoFooter>
              {/* <TextWrapper> */}
              <MainText>{room.pointName}</MainText>
              {/* <SubText>{room.stationName}</SubText> */}
              {/* </TextWrapper> */}
              <InfoDetail>{room.name}</InfoDetail>
            </InfoFooter>
            <Button>
              <ButtonText>예약하기</ButtonText>
            </Button>
          </InfoBox>
        ))}
      </InfoBoxWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InfoHeaderWrapper = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 2.5em;
`;

const InfoBoxWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 1em;
`;

const InfoBox = styled.div`
  width: 16em;
  height: 20.3125em;
  border-radius: 0.3125em;
  margin: 1em;
  padding-top: 1em;
  padding-right: 1.8em;
  padding-left: 1.8em;
  padding-bottom: 1.3em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  background-color: #3b3b3b;

  &:hover .overlay {
    opacity: 1;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  width: 13.5em;
  height: 4.5em;
  margin-top: 0.5em;
  padding-left: 1em;
  gap: 1.3em;
  background-color: #3b3b3b;
  border-radius: 1.25em;
`;

const HeaderIcon = styled.img`
  width: 3.5em;
  height: 3.5em;
  padding: 0.1em;
  border-radius: 100%;
  object-fit: contain;
  background: radial-gradient(50% 50% at 50% 50%, #1a1a1a 0%, #808080 100%);
`;

const LevelText = styled.div`
  font-family: 'esamanru-Bold';
  color: #fff;
  font-size: 2.3em;
`;

const MainText = styled.div`
  font-family: 'esamanru-Light';
  font-size: 0.8em;
  color: #fff;
`;

const InputWrapper = styled.div`
  border: 3px solid rgba(148, 0, 0.8);
  border-radius: 1em;
  width: 100%;
  height: 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(148, 0, 0, 0.15);
  box-shadow: 0 0.3em 1em 0.1em #111111;
`;

const MainImgWrapper = styled.div`
  width: 100%;
  height: 10.9375em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // 오버레이 위치 조정을 위해 필요
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  // object-fit: contain;
  border-radius: 0.625em;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.625em;
  background: rgba(0, 0, 0, 0.6); // 반투명 배경
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0; // 기본적으로 보이지 않음
  transition: opacity 0.3s ease; // 부드러운 전환 효과
  gap: 1em;
`;

const CircleTag = styled.div`
  font-family: 'esamanru-Light';
  color: #fff;
  font-size: 0.5em;
`;

const CircleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  word-break: keep-all;
  white-space: normal;
`;

const Circle = styled.div`
  width: 3.5em;
  height: 3.5em;
  // padding: 0.5em;
  border-radius: 50%;
  background: #383838;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OverlayText = styled.div`
  font-family: 'esamanru-Light';
  font-size: 0.8em;
  width: 100%;
  height: 2.5em;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  // word-break: break-word;
  // white-space: normal;
  color: #fff;
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
  border-radius: 0.625em;
  position: relative;
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
  justify-content: center;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  gap: 0.5em;
`;

const InfoDetail = styled.div`
  font-family: 'esamanru-Bold';
  color: #fff;
  font-size: 1.5em;
`;

const Button = styled.div`
  width: 100%;
  height: 2.8em;
  border: none;
  border-radius: 0.3125em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #940000;
`;

const ButtonText = styled.div`
  font-family: 'esamanru-Medium';
  font-size: 1em;
  color: #fff;
`;
