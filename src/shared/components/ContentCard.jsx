import { useState } from 'react';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import ThumbnailImg from '../assets/images/common/thumbnailImg.png';
import HeartIcon from '../assets/icons/common/heart_default.svg?react';
import HeartIcon2 from '../assets/icons/common/heart_hover.svg?react';
import HeartIcon3 from '../assets/icons/common/heart_active.svg?react';

function ContentCard({ data }) {
  const {
    stationName,
    themeImg,
    themeRecommendedRatio,
    themeLevel,
    themePlayTime,
    pointName,
    themeName,
    themePricePerHeadcount,
  } = data;

  // state 관리
  const [isHeartActive, setIsHeartActive] = useState(false);
  
  // navigate
  const navigate = useNavigate();

  // 세자리마다 콤마 기능
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <ItemWrapper onClick={() => navigate('/level')}>
      {/* 이미지 영역 */}
      <ImageSection imgUrl={themeImg}>
        <LocationTag>{stationName}</LocationTag>
      </ImageSection>

      {/* 태그 영역 */}
      <TagSection>
        <ScoreTag>⭐&nbsp;&nbsp;&nbsp;4.4</ScoreTag>
        <Tag>어려움</Tag>
        <Tag>{themePlayTime}분</Tag>
      </TagSection>

      {/* 제목 영역 */}
      <TitleSection>
        <TitleWrapper>
          <CafeName>{pointName}</CafeName>
          <Title>{themeName}</Title>
        </TitleWrapper>
        {/* 하트 아이콘 영역 */}
        <HeartWrapper
          onClick={(event) => {
            event.stopPropagation();
            setIsHeartActive(!isHeartActive);
          }}
        >
          {isHeartActive ? (
            <HeartIcon3 />
          ) : (
            <>
              <HeartIcon className="default" />
              <HeartIcon2 className="hover" />
            </>
          )}
        </HeartWrapper>
      </TitleSection>

      {/* 장르 영역 */}
      <GenreSection>
        <Tag>잠입</Tag>
        <Tag>스릴러</Tag>
      </GenreSection>

      {/* 가격 영역 */}
      <PriceSection>
        1인
        <Price>₩ {formatNumberWithCommas(themePricePerHeadcount)} ~</Price>
      </PriceSection>
    </ItemWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
ContentCard.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ContentCard;

// CSS
const ItemWrapper = styled.div`
  border-radius: 0.9375rem;
  padding: 0.84375rem;
  box-sizing: border-box;
  width: 16.5625rem;
  height: 28.125rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: var(--RIU_Primary-0, #E8EAFF);
  }
`;

const ImageSection = styled.div`
  display: flex;
  border-radius: 0.5625rem;
  width: 100%;
  height: 15.65625rem;
  align-self: stretch;
  background-image: ${(props) =>
    props.imgUrl && typeof props.imgUrl === "string" && props.imgUrl.trim() !== ""
      ? `url(${props.imgUrl})`
      : `url(${ThumbnailImg})`};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;

const LocationTag = styled.div`
  padding: 0 13.5px;
  margin: 0.5rem 0 0 0.5rem;
  height: 1.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.9375rem;
  background: var(--RIU_Primary-400, #515DBA);
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;
`;

const TagSection = styled.div`
  margin-top: 0.46875rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

const ScoreTag = styled.div`
  border-radius: 0.1875rem;
  padding: 0 0.46875rem;
  height: 1.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--RIU_Primary-100, #718FF2);
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;
`;

const Tag = styled.div`
  border-radius: 0.1875rem;
  padding: 0 0.46875rem;
  height: 1.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--RIU_Monochrome-20, #F0F0F4);
  color: var(--RIU_Monochrome-80, #A1A4B5);
  font-family: 'Pretendard-Medium';
  font-size: 0.65625rem;
  transition: background 0.2s ease-in-out;

  ${ItemWrapper}:hover & {
    background: var(--RIU_Primary-20, #D0D8FF);
    color: var(--RIU_Primary-200, #6680DF);
  }
`;

const TitleSection = styled.div`
  margin-top: 0.9375rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
`;

const CafeName = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;
`;

const Title = styled.div`
  width: 13rem;
  color: var(--RIU_Primary-600, #303281);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.3125rem;
  word-break: keep-all;
`;

const HeartWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  position: relative;

  svg {
    position: absolute;
    transition: opacity 0.2s ease-in-out;
  }

  .default {
    opacity: 1;
  }

  .hover {
    opacity: 0;
  }

  &:hover .default {
    opacity: 0;
  }

  &:hover .hover {
    opacity: 1;
  }
`;

const GenreSection = styled.div`
  margin-top: 0.46875rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.1875rem;
`;

const PriceSection = styled.div`
  margin-top: 0.9375rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.234375rem;
  color: var(--RIU_Monochrome-80, #A1A4B5);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.84375rem;
  ${ItemWrapper}:hover & {
    color: var(--RIU_Primary-80, #8DA3FF);
  }
`;

const Price = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-ExtraBold';
  font-size: 0.84375rem;
`;