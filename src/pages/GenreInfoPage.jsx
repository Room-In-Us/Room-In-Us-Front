import React from 'react'
import styled from 'styled-components'
import JokerHeadIcon from '../assets/images/genrePage/jokerheadicon.png'
import Sample from '../assets/images/genrePage/sampleImage.png'

export default function GenreInfoPage() {
  // 레이아웃 구현 위해 임시로 만든 data
  const genreData = [
    {
      id: 1,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 2,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 3,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 4,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 5,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 6,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 7,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
    {
      id: 8,
      title: '키이스케이프',
      location: '강남',
      description: '방탈출 설명 블라블라\n여기에 해당 설명이 적힐 예정입니다\n키이스케이프는어쩌구저쩌구',
      icon: JokerHeadIcon,
      image: Sample,
    },
  ];

  return (
    <Wrapper>
      {genreData.map((genre) => (
      <InfoBox key={genre.id}>
        <InfoHeader>
          <HeaderIcon src={genre.icon} />
          <TextWrapper>
            <MainText>{genre.title}</MainText>
            <SubText>{genre.location}</SubText>
          </TextWrapper>
        </InfoHeader>
        <SampleImg src={genre.image} />
        <InfoFooter>
          <InfoDetail>{genre.description}</InfoDetail>
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
  font-family: 'PretendardBold';
  font-size: 1.2em;
  color: #fff;
`;

const SubText = styled.div`
  font-family: 'PretendardMedium';
  color: #A9A9A9;
`;

const SampleImg = styled.img`
  width: 100%;
  height: 10.9375em;
`;

const InfoFooter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const InfoDetail = styled.div`
  font-family: 'PretendardRegular';
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