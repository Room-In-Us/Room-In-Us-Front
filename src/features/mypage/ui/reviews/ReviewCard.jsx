import { useEffect, useState } from "react";
import { getThemeDetailAPI } from "../../../themeDetail/api/themeDetailAPI";
import styled from "styled-components"
import DefaultThumbnail from '../../../../shared/assets/images/common/thumbnailImg.png';
import BlueStar from "../../../../shared/assets/icons/themeDetail/blueStar.svg?react";
import { createReviewInfoItems } from "../../model/reviewDataList";
import useDevice from "../../../../shared/hooks/useDevice";
import { formatDateToDot } from "../../../../shared/utils/dataUtils";

export default function ReviewCard({ data }) {

  const { isMobile } = useDevice();

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
        { !isMobile && (
        <>
          <RoomLocation>{storeName || '지점명'}</RoomLocation>
          <RoomTitleWrapper>
            <RoomTitle>{themeName || '테마명'}</RoomTitle>
            <StarRateBox>
              <StarIcon />
              <RateValue>{satisfactionLevel?.toFixed(1) || '0.0'}</RateValue>
            </StarRateBox>
          </RoomTitleWrapper>
        </>
        )}
        {isMobile && (
        <RoomInfoWrapper>
          <RoomLocation>{storeName || '지점명'}</RoomLocation>
          <RoomTitleWrapper>
            <RoomTitle>{themeName || '테마명'}</RoomTitle>
            <StarRateBox>
              <StarIcon />
              <RateValue>{satisfactionLevel?.toFixed(1) || '0.0'}</RateValue>
            </StarRateBox>
          </RoomTitleWrapper>
        </RoomInfoWrapper>
        )}
        <ReviewInfoBox>
        {infoItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <ReviewInfo key={index}>
              <ReviewIcon><IconComponent /></ReviewIcon>
              { !isMobile && (
                <ReviewMenu>{item.label || '메뉴'}</ReviewMenu>
              )}
              <ReviewAnswer>{item.value || '-'}</ReviewAnswer>
            </ReviewInfo>
          );
        })}
        </ReviewInfoBox>
        <ReviewDetail>{reviewComment || '-'}</ReviewDetail>
        <DateBox>
          <Date>방문일자 : {formatDateToDot(playedAt) || '-'}</Date>
          <Date>작성일자 : {formatDateToDot(createdAt) || '-'}</Date>
        </DateBox>
        { !isMobile && (
          <Btn>
            <BtnText>후기 상세보기</BtnText>
          </Btn>
        )}
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

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.625em;
  }
`;

const Img = styled.img`
  width: 10em;
  height: 10em;
  border-radius: 0.5625em;
  border: 0.75px solid #87ADB5;
  background: url(<path-to-image>) lightgray 50% / cover no-repeat, url(<path-to-image>) lightgray 50% / cover no-repeat;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 8.75em;
    height: 8.75em;
  }
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

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const RoomTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const RoomInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25em;
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

  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

const RateValue = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 1.125em;

  @media (max-width: 768px) {
    font-size: 1em;
  }
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
  padding: 0.5em 0.625em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25em;
  border-radius: 0.25em;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 3em;
    height: 3em;
    padding: 0.25em 0.5em;
    gap: 0.125em;
  }
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
  font-size: 0.5625rem;
`;

const ReviewAnswer = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 0.625em;

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

const ReviewDetail = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
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

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
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
  cursor: pointer;
`;

const BtnText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;