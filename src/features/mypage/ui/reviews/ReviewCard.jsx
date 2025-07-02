import { useEffect } from "react";
import { getThemeDetailAPI } from "../../../themeDetail/api/themeDetailAPI";
import styled from "styled-components"
import DefaultThumbnail from '../../../../shared/assets/images/common/thumbnailImg.png';
import BlueStar from "../../../../shared/assets/icons/themeDetail/blueStar.svg?react";

export default function ReviewCard({ data }) {

  const {
    themeId,
    storeName,
    themeName,
    satisfactionLevel,
    reviewComment,
    playedAt,
    createdAt,
    isEscaped,
    usedHint,
    remainingTime,
    participantCnt,
    review
  } = data;

  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  const infoItems = createReviewInfoItems({
    review,
    participantCnt,
    usedHint,
    remainingTime,
    isEscaped
  });

  useEffect(() => {
    if (!themeId) return;

    getThemeDetailAPI(themeId)
      .then((themeData) => {
        setThumbnailUrl(themeData.img);
      })
      .catch((error) => {
        console.error('썸네일 로딩 실패:', error);
        setThumbnailUrl(null);
      });
    }, [themeId]);

  return (
    <Wrapper>
      <Img src={thumbnailUrl || DefaultThumbnail} />
      <ItemsBox>
        <RoomLocation>{storeName}</RoomLocation>
        <RoomTitleWrapper>
          <RoomTitle>{themeName}</RoomTitle>
          <StarRateBox>
            <StarIcon />
            <RateValue>{satisfactionLevel?.toFixed(1)}</RateValue>
          </StarRateBox>
        </RoomTitleWrapper>
        <ReviewInfoBox>
        {infoItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <ReviewInfo key={index}>
              <ReviewIcon><IconComponent /></ReviewIcon>
              <ReviewMenu>{item.label}</ReviewMenu>
              <ReviewAnswer>{item.value}</ReviewAnswer>
            </ReviewInfo>
          );
        })}
        </ReviewInfoBox>
        <ReviewDetail>{reviewComment}</ReviewDetail>
        <DateBox>
          <Date>방문일자 : {playedAt}</Date>
          <Date>작성일자 : {createdAt}</Date>
        </DateBox>
        <Btn>
          <BtnText>후기 상세보기</BtnText>
        </Btn>
      </ItemsBox>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  padding: 0.875em;
  align-items: flex-start;
  gap: 1.25em;
  border-radius: 0.625em;
  border: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const Img = styled.img`
  width: 10em;
  height: 10em;
  border-radius: 0.5625em;
  border: 0.75px solid #87ADB5;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat, url(<path-to-image>) lightgray 50% / cover no-repeat;
`;

const ItemsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
  box-sizing: border-box;
`;

const RoomLocation = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;

const RoomTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RoomTitle = styled.div`
  color: var(--RIU_Primary-500, #4648A7);
  font-family: Pretendard-ExtraBold;
  font-size: 1em;
`;

const StarRateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
`;

const StarIcon = styled(BlueStar)`
  display: flex;
  width: 1.25em;
  height: 1.25em;
  justify-content: center;
  align-items: center;
`;

const RateValue = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 1.125em;
`;

const ReviewInfoBox = styled.div`
  display: flex;
  padding: 0.5em;
  gap: 0.5em;
  justify-content: space-between;
  align-items: flex-start;
  border-radius: 0.625em;
  background: var(--RIU_Monochrome-30, #E7E8ED);
`;

const ReviewInfo = styled.div`
  display: flex;
  width: 3.9375em;
  padding: 0.5em 0.75em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  border-radius: 0.25em;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;
`;

const ReviewIcon = styled.div`
  display: flex;
  width: 1.5625em;
  height: 1.5625em;
  justify-content: center;
  align-items: center;
`;

const ReviewMenu = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-SemiBold;
  font-size: 0.5625em;
`;

const ReviewAnswer = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 0.625em;
`;

const ReviewDetail = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: Pretendard-Medium;
  font-size: 0.875em;
`;

const DateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
`;

const Date = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  font-family: Pretendard-Medium;
  font-size: 0.75em;
`;

const Btn = styled.div`
  display: flex;
  width: 100%;
  height: 2.5em;
  padding: 0.875em 0em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  border-radius: 2.5em;
  background: var(--RIU_Primary-0, #E8EAFF);
  box-sizing: border-box;
`;

const BtnText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;