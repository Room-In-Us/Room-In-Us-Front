import { useState, useEffect } from 'react';
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import ThumbnailImg from '../assets/images/common/thumbnailImg.png';
import AwardsIcon from '../assets/icons/common/awards.svg?react';
import CautionIcon from '../assets/icons/common/cautionIcon.svg?react';
import HeartIcon from '../assets/icons/common/heart_default.svg?react';
import HeartIcon2 from '../assets/icons/common/heart_hover.svg?react';
import HeartIcon3 from '../assets/icons/common/heart_active.svg?react';
import { formatNumberWithCommas } from '../utils/formatUtils';
import { levelTextConversion, genreListConversion, satisfactionConversion } from '../utils/dataUtils';
import useDevice from '../hooks/useDevice';

function ContentCard({ data, headCount, type }) {
  const {
    locationName,
    awardsYear,
    img,
    satisfactionLevel,
    level,
    playTime,
    storeName,
    themeName,
    genreList,
    price,
    maxHeadcount,
  } = data;

  // state 관리
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [imageUrl, setImageUrl] = useState(img);
  
  // navigate
  const navigate = useNavigate();

  // 반응형 함수
  const { isMobile } = useDevice();

  // 이미지 로드 실패 시, 기본 썸네일로 변경
  useEffect(() => {
    setImageUrl(img);
  }, [img]);
  
  const handleImageError = () => {
    setImageUrl(ThumbnailImg);
  };

  return (
    <ContentWrapper
      type={type}
      onClick={() => navigate('/level')}
    >
      {/* 이미지 영역 */}
      <ImageSection imgUrl={imageUrl}>
        <LocationTag>{locationName}</LocationTag>
        {awardsYear && <AwardsTag><StyledAwards/>{awardsYear}</AwardsTag>}
        {/* 보이지 않는 img 태그 추가 (onError 감지용) */}
        <img src={imageUrl} alt="테마 이미지" onError={handleImageError} />
      </ImageSection>

      <ItemWrapper>
        <TagAndTitleWrapper>
          {/* 태그 영역 */}
          <TagSection>
            <ScoreTag>⭐&nbsp;&nbsp;&nbsp;{satisfactionConversion(satisfactionLevel)}</ScoreTag>
            <Tag>{levelTextConversion(level)}</Tag>
            <Tag>{playTime}분</Tag>
          </TagSection>

          {/* 제목 영역 */}
          <TitleSection>
            <TitleWrapper>
              <CafeName>{storeName}</CafeName>
              <Title>{themeName}</Title>
            </TitleWrapper>
            {!isMobile && (
              <>
                {/* 하트 아이콘 영역 */}
                <HeartWrapper
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsHeartActive(!isHeartActive);
                  }}
                >
                  {isHeartActive ? (
                    <StyledHeartIcon3 />
                  ) : (
                    <>
                      <StyledHeartIcon className="default" />
                      <StyledHeartIcon2 className="hover" />
                    </>
                  )}
                </HeartWrapper>
              </>
            )}
          </TitleSection>

          {/* 장르 영역 */}
          <GenreSection>
            {genreList &&
              genreListConversion(genreList).map((genre, index) => (
                <Tag key={index}>{genre}</Tag>
            ))}
          </GenreSection>
        </TagAndTitleWrapper>

        {/* 가격 영역 */}
        <PriceSection>
          {price === null && maxHeadcount === null ? (
            <CautionWrapper type="priceCaution">
              <StyledCautionIcon />
              가격 정보 없음
            </CautionWrapper>
          ) : price === null && maxHeadcount !== null ? (
            headCount > maxHeadcount ? (
              <CautionWrapper type="headCountCaution">
                <StyledCautionIcon />
                {maxHeadcount}인까지 플레이 가능
              </CautionWrapper>
            ) : (
              <CautionWrapper type="priceCaution">
                <StyledCautionIcon />
                가격 정보 없음
              </CautionWrapper>
            )
          ) : price !== null && maxHeadcount === null ? (
            <CautionWrapper type="priceCaution">
              <StyledCautionIcon />
              가격 정보 없음
            </CautionWrapper>
          ) : (
            <PriceWrapper>
              {type === 'home' && '1인'}
              <Price>₩ {formatNumberWithCommas(price ?? 0)} {type === 'home' && '~'}</Price>
            </PriceWrapper>
          )}
          {isMobile && (
              <>
                {/* 모바일 하트 아이콘 영역 */}
                <HeartWrapper
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsHeartActive(!isHeartActive);
                  }}
                >
                  {isHeartActive ? (
                    <StyledHeartIcon3 />
                  ) : (
                    <>
                      <StyledHeartIcon className="default" />
                      <StyledHeartIcon2 className="hover" />
                    </>
                  )}
                </HeartWrapper>
              </>
            )}
        </PriceSection>
      </ItemWrapper>
    </ContentWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
ContentCard.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  headCount: PropTypes.number.isRequired,
};

export default ContentCard;

// CSS
const ContentWrapper = styled.div`
  font-size: ${(props) => (props.type === 'location') ? '0.52rem' : '1rem'};
  border-radius: 0.9375em;
  padding: 0.84375em;
  box-sizing: border-box;
  width: 16.5625em;
  height: 28.125em;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  cursor: pointer;
  transition: background 0.2s ease-in-out;

  &:hover {
    background: var(--RIU_Primary-0, #E8EAFF);
  }

  @media (max-width: 1024px) {
    padding: 0.703125em;
    width: 21.1875em;
    height: 21.09375em;
  }
  @media (max-width: 768px) {
    padding: 0.625em;
    width: 20.9375em;
    height: 10em;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const ImageSection = styled.div`
  display: flex;
  border-radius: 0.5625em;
  width: 100%;
  height: 15.65625em;
  align-self: stretch;
  background-image: url(${props => props.imgUrl});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  img {
    display: none;
  }

  @media (max-width: 1024px) {
    height: 11.7421875em;
  }
  @media (max-width: 768px) {
    border-radius: 0.375em;
    width: 8.75em;
    height: 8.75em;
    display: flex;
    flex-direction: column;
  }
`;

const LocationTag = styled.div`
  padding: 0 1.14285714em;
  box-sizing: border-box;
  margin: 0.76190476em 0 0 0.76190476em;
  width: fit-content;
  height: 2.0952381em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 1.42857143em;
  background: var(--RIU_Primary-400, #515DBA);
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625em;

  @media (max-width: 1024px) {
    padding: 0 1.125em;
    margin: 0.66666667em 0 0 0.66666667em;
    height: 1.91666667em;
    font-size: 0.5625em;
  }
  @media (max-width: 768px) {
    height: 1.8em;
    font-size: 0.625em;
  }
`;

const AwardsTag = styled.div`
  border: 1px solid var(--RIU_Monochrome-80, #A1A4B5);
  border-radius: 1.42857143em;
  padding: 0 1.14285714em;
  box-sizing: border-box;
  margin: 0.76190476em 0 0 0.76190476em;
  width: fit-content;
  height: 2.0952381em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.38095238em;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625em;

  @media (max-width: 1024px) {
    padding: 0 1.125em;
    margin: 0.66666667em 0 0 0.66666667em;
    height: 1.91666667em;
    font-size: 0.5625em;
  }
  @media (max-width: 768px) {
    height: 1.8em;
    font-size: 0.625em;
  }
`;

const StyledAwards = styled(AwardsIcon)`
  width: 0.95238095em;

  @media (max-width: 1024px) {
    font-size: 1.69312169em;
  }
  @media (max-width: 768px) {
    font-size: 1.52380952em;
  }
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 10.59375em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1024px) {
    height: 7.9453125em;
  }
  @media (max-width: 768px) {
    width: 10.4375em;
    height: 8.75em;
  }
`;

const TagAndTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TagSection = styled.div`
  margin-top: 0.46875em;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.375em;

  @media (max-width: 768px) {
    margin-top: 0.3515625em;
    gap: 0.28125em;
  }
  @media (max-width: 768px) {
    margin-top: 0;
    gap: 0.25em;
  }
`;

const ScoreTag = styled.div`
  border-radius: 0.28571429em;
  padding: 0 0.71428571em;
  height: 2.0952381em;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--RIU_Primary-100, #718FF2);
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625em;

  @media (max-width: 1024px) {
    padding: 0 0.625em;
    height: 1.91666667em;
    font-size: 0.5625em;
  }
  @media (max-width: 768px) {
    padding: 0 0.6em;
    height: 2em;
    font-size: 0.5em;
  }
`;

const Tag = styled.div`
  border-radius: 0.28571429em;
  padding: 0 0.71428571em;
  height: 2.0952381em;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--RIU_Monochrome-20, #F0F0F4);
  color: var(--RIU_Monochrome-80, #A1A4B5);
  font-family: 'Pretendard-Medium';
  font-size: 0.65625em;
  transition: background 0.2s ease-in-out;

  ${ContentWrapper}:hover & {
    background: var(--RIU_Primary-20, #D0D8FF);
    color: var(--RIU_Primary-200, #6680DF);
  }

  @media (max-width: 1024px) {
    padding: 0 0.625em;
    height: 1.91666667em;
    font-size: 0.5625em;
  }
  @media (max-width: 768px) {
    height: 2em;
    font-size: 0.5em;
  }
`;

const TitleSection = styled.div`
  margin-top: 0.9375em;
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 1024px) {
    margin-top: 0.703125em;
  }
  @media (max-width: 768px) {
    margin-top: 0.5em;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125em;

  @media (max-width: 1024px) {
    gap: 0.234375em;
  }
  @media (max-width: 768px) {
    gap: 0;
  }
`;

const CafeName = styled.div`
  width: 17.52380952em;
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625em;

  // 말줄임 표시
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;

  @media (max-width: 1024px) {
    width: 28em;
    font-size: 0.5625em;
  }
  @media (max-width: 768px) {
    width: 13.6em;
    font-size: 0.625em;
  }
`;

const Title = styled.div`
  width: 8.76190476em;
  color: var(--RIU_Primary-600, #303281);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.3125em;

  // 말줄임 표시
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;

  @media (max-width: 1024px) {
    width: 14em;
    font-size: 1.125em;
  }
  @media (max-width: 768px) {
    width: 8.5em;
    font-size: 1em;
  }
`;

const HeartWrapper = styled.div`
  width: 1.5em;
  height: 1.5em;
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

  @media (max-width: 1024px) {
    width: 1.125em;
    height: 1.125em;
    right: 0.5em;
  }
  @media (max-width: 768px) {
    width: 1em;
    height: 1em;
    bottom: 0.4em;
  }
`;

const StyledHeartIcon = styled(HeartIcon)`
  width: 100%;
  height: 100%;
`;
const StyledHeartIcon2 = styled(HeartIcon2)`
  width: 100%;
  height: 100%;
`;
const StyledHeartIcon3 = styled(HeartIcon3)`
  width: 100%;
  height: 100%;
`;

const GenreSection = styled.div`
  margin-top: 0.3125em;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.1875em;

  @media (max-width: 1024px) {
    gap: 0.375em;
  }
  @media (max-width: 768px) {
    gap: 0.5em;
  }
`;

const PriceSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PriceWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.27777778em;
  color: var(--RIU_Monochrome-80, #A1A4B5);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.84375em;
  ${ItemWrapper}:hover & {
    color: var(--RIU_Primary-80, #8DA3FF);
  }

  @media (max-width: 1024px) {
    gap: 0.27777778em;
    font-size: 0.6328125em;
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const CautionWrapper = styled.div`
  border-radius: 2.22222222em;
  padding: ${(props) => (props.type === 'headCountCaution') ? '0.2962963em 0.74074074em' : '0'};
  width: ${(props) => (props.type === 'headCountCaution') ? '100%' : 'auto'};
  display: flex;
  align-items: center;
  gap: 0.59259259em;
  background-color: ${(props) => (props.type === 'headCountCaution') ? 'var(--RIU_Primary-500, #4648A7)' : 'transparent'};
  color: ${(props) => (props.type === 'headCountCaution') ? 'var(--RIU_Monochrome-10, #F9F9FB)' : 'var(--RIU_Monochrome-60, #C4C6D1)'};
  font-family: 'Pretendard-SemiBold';
  font-size: 0.84375em;
  line-height: normal;

  @media (max-width: 1024px) {
    gap: 0.27777778em;
    font-size: 0.6328125em;
  }
  @media (max-width: 768px) {
    padding: ${(props) => (props.type === 'headCountCaution') ? '0.16666667em 0.66666667em' : '0'};
    width: ${(props) => (props.type === 'headCountCaution') ? '70%' : 'auto'};
    font-size: 0.75em;
  }
`;

const StyledCautionIcon = styled(CautionIcon)`
  width: 0.88888889em;
  height: 0.88888889em;

  @media (max-width: 1024px) {
    font-size: 1.40466392em;
  }
  @media (max-width: 768px) {
    font-size: 1.18518519em;
  }
`;

const Price = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-ExtraBold';

  @media (max-width: 1024px) {
    font-size: 0.75em;
  }
  @media (max-width: 768px) {
    font-size: 0.88888889em;
  }
`;