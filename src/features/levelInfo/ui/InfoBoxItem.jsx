import styled from "styled-components";
import OverlayInfo from "./OverlayInfo";
import NoImage from '../../../shared/assets/images//common/nophotos.png'

export default function InfoBoxItem ({ room }) {

  return (
  <InfoBox key={room.id}>
    {room.image ? (
    <MainImgWrapper>
      <MainImg src={room.image} alt="방탈출 이미지" />
      <OverlayInfo level="5" playTime="100" genre="장르 이름" />
    </MainImgWrapper>
    ) : (
    <NoImgWrapper>
      <NoImg src={NoImage} alt="이미지 없음" />
      <NoImgText>No Image</NoImgText>
      <OverlayInfo level="5" playTime="100" genre="판타지" />
    </NoImgWrapper>
    )}
    <InfoFooter>
      <RoomTagWrapper>
        <RoomTag>⭐{room.levelNum}</RoomTag>
        <RoomTag>{room.levelText}</RoomTag>
        <RoomTag>{room.playTime}분</RoomTag>
        <RoomTag>{room.genre}</RoomTag>
      </RoomTagWrapper>
      <RoomBrand>{room.title}</RoomBrand>
      <RoomTitle>방이름</RoomTitle>
      <RoomInfoText>{room.description}</RoomInfoText>
      <Button>예약하기</Button>
    </InfoFooter>
  </InfoBox>
  )
};

const InfoBox = styled.div`
  // width: 19.625em;
  // height: 23.75em;
  border-radius: 0.625em;
  padding-top: 1em;
  padding-right: 0.75em;
  padding-left: 0.75em;
  padding-bottom: 1em;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.9375em;

  background-color: #3b3b3b;
`;

const MainImgWrapper = styled.div`
  width: 18.125em;
  height: 10.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; // 오버레이 위치 조정을 위해 필요

  &:hover .overlay {
    opacity: 1;
  }
`;

const MainImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  // object-fit: contain;
  border-radius: 0.625em;
`;

const NoImgWrapper = styled.div`
  width: 100%;
  height: 10.5em;
  background-color: gray;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  border-radius: 0.625em;
  position: relative;

  &:hover .overlay {
    opacity: 1;
  }
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
  gap: 0.5em;
`;

const RoomTagWrapper = styled.div`
  display: flex;
  gap: 0.5em;
`;

const RoomTag = styled.div`
  witdh: 3.0625em;
  height: 1.4375em;
  padding-top: 0.125em;
  padding-bottom: 0.125em;
  padding-left: 0.25em;
  padding-right: 0.25em;
  border-radius: 0.25em;
  background-color: #ECECEC;
  color: #777777;
  line-height: 1;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-family: 'Pretendard-Light';
`;

const RoomBrand = styled.div`
  font-family: 'Pretendard-Light';
  font-size: 1.125em;
  color: #fff;
`;

const RoomTitle = styled.div`
  font-family: 'Pretendard-Medium';
  color: #fff;
  font-size: 1.5em;
`;

const RoomInfoText = styled.div`
  color: #fff;
  font-family: 'Pretendard-Light';
`;

const Button = styled.div`
  width: 100%;
  height: 2.8em;
  border-radius: 0.3125em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #ECECEC;
  color: #9E9E9E;
  font-family: 'Pretendard-Medium';
`;