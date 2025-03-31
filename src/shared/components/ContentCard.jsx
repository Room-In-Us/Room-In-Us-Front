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
    <ContentWrapper onClick={() => navigate('/level')}>
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
                    <HeartIcon3 />
                  ) : (
                    <>
                      <HeartIcon className="default" />
                      <HeartIcon2 className="hover" />
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
              <Price>₩ {formatNumberWithCommas(price ?? 0)} {type !== 'home' && '~'}</Price>
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
                    <HeartIcon3 />
                  ) : (
                    <>
                      <HeartIcon className="default" />
                      <HeartIcon2 className="hover" />
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

  @media (max-width: 1024px) {
    padding: 0.703125rem;
    width: 21.1875rem;
    height: 21.09375rem;
  }
  @media (max-width: 768px) {
    padding: 0.625rem;
    width: 20.9375rem;
    height: 10rem;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const ImageSection = styled.div`
  display: flex;
  border-radius: 0.5625rem;
  width: 100%;
  height: 15.65625rem;
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
    height: 11.7421875rem;
  }
  @media (max-width: 768px) {
    border-radius: 0.375rem;
    width: 8.75rem;
    height: 8.75rem;
    display: flex;
    flex-direction: column;
  }
`;

const LocationTag = styled.div`
  padding: 0 0.75rem;
  box-sizing: border-box;
  margin: 0.5rem 0 0 0.5rem;
  width: fit-content;
  height: 1.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.9375rem;
  background: var(--RIU_Primary-400, #515DBA);
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;

  @media (max-width: 1024px) {
    padding: 0 0.6328125rem;
    margin: 0.375rem 0 0 0.375rem;
    height: 1.078125rem;
    font-size: 0.5625rem;
  }
  @media (max-width: 768px) {
    height: 1.125rem;
    font-size: 0.625rem;
  }
`;

const AwardsTag = styled.div`
  border: 1px solid var(--RIU_Monochrome-80, #A1A4B5);
  border-radius: 0.9375rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
  margin: 0.5rem 0 0 0.5rem;
  width: fit-content;
  height: 1.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;

  @media (max-width: 1024px) {
    padding: 0 0.6328125rem;
    margin: 0.375rem 0 0 0.375rem;
    height: 1.078125rem;
    font-size: 0.5625rem;
  }
  @media (max-width: 768px) {
    height: 1.125rem;
    font-size: 0.625rem;
  }
`;

const StyledAwards = styled(AwardsIcon)`
  width: 0.625rem;
`;

const ItemWrapper = styled.div`
  width: 100%;
  height: 10.59375rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 1024px) {
    height: 7.9453125rem;
  }
  @media (max-width: 768px) {
    width: 10.4375rem;
    height: 8.75rem;
  }
`;

const TagAndTitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TagSection = styled.div`
  margin-top: 0.46875rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  @media (max-width: 768px) {
    margin-top: 0.3515625rem;
    gap: 0.28125rem;
  }
  @media (max-width: 768px) {
    margin-top: 0;
    gap: 0.25rem;
  }
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

  @media (max-width: 1024px) {
    padding: 0 0.3515625rem;
    height: 1.078125rem;
    font-size: 0.5625rem;
  }
  @media (max-width: 768px) {
    height: 1rem;
    font-size: 0.5rem;
    padding: 0 0.3rem;
  }
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

  ${ContentWrapper}:hover & {
    background: var(--RIU_Primary-20, #D0D8FF);
    color: var(--RIU_Primary-200, #6680DF);
  }

  @media (max-width: 1024px) {
    padding: 0 0.3515625rem;
    height: 1.078125rem;
    font-size: 0.5625rem;
  }
  @media (max-width: 768px) {
    height: 1rem;
    font-size: 0.5rem;
  }
`;

const TitleSection = styled.div`
  margin-top: 0.9375rem;
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 1024px) {
    margin-top: 0.703125rem;
  }
  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;

  @media (max-width: 1024px) {
    gap: 0.234375rem;
  }
  @media (max-width: 768px) {
    gap: 0;
  }
`;

const CafeName = styled.div`
  width: 11.5rem;
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;

  // 말줄임 표시
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;

  @media (max-width: 1024px) {
    width: 15.75rem;
    font-size: 0.5625rem;
  }
  @media (max-width: 768px) {
    width: 8.5rem;
    font-size: 0.625rem;
  }
`;

const Title = styled.div`
  width: 11.5rem;
  color: var(--RIU_Primary-600, #303281);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.3125rem;

  // 말줄임 표시
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;

  @media (max-width: 1024px) {
    width: 15.75rem;
    font-size: 1.125rem;
  }
  @media (max-width: 768px) {
    width: 8.5rem;
    font-size: 1rem;
  }
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

  @media (max-width: 1024px) {
    width: 1.125rem;
    height: 1.125rem;
    right: 0.5rem;
  }
  @media (max-width: 768px) {
    width: 1rem;
    height: 1rem;
    bottom: 0.4rem;
  }
`;

const GenreSection = styled.div`
  margin-top: 0.3125rem;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.1875rem;

  @media (max-width: 1024px) {
    gap: 0.375rem;
  }
  @media (max-width: 768px) {
    gap: 0.5rem;
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
  gap: 0.234375rem;
  color: var(--RIU_Monochrome-80, #A1A4B5);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.84375rem;
  ${ItemWrapper}:hover & {
    color: var(--RIU_Primary-80, #8DA3FF);
  }

  @media (max-width: 1024px) {
    gap: 0.17578125rem;
    font-size: 0.6328125rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const CautionWrapper = styled.div`
  border-radius: 1.875rem;
  padding: ${(props) => (props.type === 'headCountCaution') ? '0.25rem 0.625rem' : '0'};
  width: ${(props) => (props.type === 'headCountCaution') ? '100%' : 'auto'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${(props) => (props.type === 'headCountCaution') ? 'var(--RIU_Primary-500, #4648A7)' : 'transparent'};
  color: ${(props) => (props.type === 'headCountCaution') ? 'var(--RIU_Monochrome-10, #F9F9FB)' : 'var(--RIU_Monochrome-60, #C4C6D1)'};
  font-family: 'Pretendard-SemiBold';
  font-size: 0.84375rem;
  line-height: normal;

  @media (max-width: 1024px) {
    gap: 0.17578125rem;
    font-size: 0.6328125rem;
  }
  @media (max-width: 768px) {
    padding: ${(props) => (props.type === 'headCountCaution') ? '0.125rem 0.5rem' : '0'};
    width: ${(props) => (props.type === 'headCountCaution') ? '70%' : 'auto'};
    font-size: 0.75rem;
  }
`;

const StyledCautionIcon = styled(CautionIcon)`
  width: 0.75rem;
  height: 0.75rem;
`;

const Price = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-ExtraBold';
  font-size: 0.84375rem;

  @media (max-width: 1024px) {
    font-size: 0.6328125rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;