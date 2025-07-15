import { useNavigate } from "react-router-dom";
import styled from "styled-components"
import useDevice from "../../../../shared/hooks/useDevice";
import { useEffect, useState } from "react";
import { genreListConversion, levelTextConversion, satisfactionConversion } from "../../../../shared/utils/dataUtils";
import ThumbnailImg from '../../../../shared/assets/images/common/thumbnailImg.png';
import AwardsIcon from '../../../../shared/assets/icons/common/awards.svg?react';
import Logo from '../../../../shared/assets/icons/common/logo.svg?react';
import ReservationDropDown from "./ReservationDropDown";

export default function ReservedCard({ data, headCount, type, onUnlike }) {
    const {
    themeId,
    locationName,
    awardsYear,
    themeImg,
    satisfactionLevel,
    level,
    playTime,
    storeName,
    themeName,
    genreList,
    price,
    maxHeadcount,
    reservedAt,
  } = data;

  // state 관리
  const [imageUrl, setImageUrl] = useState(themeImg);
  
  // navigate
  const navigate = useNavigate();

  // 반응형 함수
  const { isMobile } = useDevice();

  // 이미지 로드 실패 시, 기본 썸네일로 변경
  useEffect(() => {
    setImageUrl(themeImg);
  }, [themeImg]);
  
  const handleImageError = () => {
    setImageUrl(ThumbnailImg);
  };

  return (
    <Wrapper>

      <ThemeItemBox>
        {/* 이미지 영역 */}
        <ImageSection imgUrl={imageUrl}>
          <LocationTag>
            <LocationText>{locationName}</LocationText>
          </LocationTag>
          {awardsYear && <AwardsTag><StyledAwards/>{awardsYear}</AwardsTag>}
          {/* 보이지 않는 img 태그 추가 (onError 감지용) */}
          <img src={imageUrl} alt="테마 이미지" onError={handleImageError} />
        </ImageSection>

        <TagAndTitleWrapper>
          {/* 태그 영역 */}
          <TagSection>
            <ScoreTag>⭐&nbsp;&nbsp;&nbsp;{satisfactionConversion(satisfactionLevel)}</ScoreTag>
            <Tag>{levelTextConversion(level)}</Tag>
            <Tag>{playTime}분</Tag>
          </TagSection>

          <TitleGenreSection>
            {/* 제목 영역 */}
            <TitleSection>
              <CafeName>{storeName}</CafeName>
              <Title>{themeName}</Title>
            </TitleSection>

            {/* 장르 영역 */}
            <GenreSection>
              {genreList &&
                genreListConversion(genreList).map((genre, index) => (
                  <Tag key={index}>{genre}</Tag>
              ))}
            </GenreSection>
          </TitleGenreSection>

        </TagAndTitleWrapper>

        {/* 더보기 영역 */}
        <ReservationDropDown />
                  
      </ThemeItemBox>
        
      <ReservationBox>
        { !isMobile && (<LogoIcon />)}
        <ReservationInfoBox>
          <ReservationDate>{reservedAt}</ReservationDate>
          <ReservationText>예약 완료</ReservationText>
        </ReservationInfoBox>
      </ReservationBox>

    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  border-radius: 0.625em;
  border: 1px solid var(--RIU_Primary-80, #8DA3FF);
  overflow: hidden;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    width: 21.6875em;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ThemeItemBox = styled.div`
  display: flex;
  padding: 0.625em;
  align-items: flex-start;
  gap: 0.9375em;
  flex: 1 0 0;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    gap: 0.5em;
    align-self: stretch;
  }
`;

const ImageSection = styled.div`
  display: flex;
  border-radius: 0.5625rem;
  width: 10rem;
  height: 10rem;
  background-image: url(${props => props.imgUrl});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  flex-shrink: 0;

  img {
    display: none;
  }

  // @media (max-width: 1024px) {
  //   height: 11.7421875rem;
  // }
  @media (max-width: 768px) {
    border-radius: 0.375rem;
    width: 8.75rem;
    height: 8.75rem;
    display: flex;
    flex-direction: column;
  }
`;

const LocationTag = styled.div`
  padding: 0.3125em 0.75rem;
  box-sizing: border-box;
  margin: 0.5rem 0 0 0.5rem;
  width: fit-content;
  height: 1.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.9375rem;
  background: var(--RIU_Primary-400, #515DBA);

  // @media (max-width: 1024px) {
  //   padding: 0 0.6328125rem;
  //   margin: 0.375rem 0 0 0.375rem;
  //   height: 1.078125rem;
  //   font-size: 0.5625rem;
  // }
  @media (max-width: 768px) {
    height: 1.125rem;
    font-size: 0.625rem;
  }
`;

const LocationText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;
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

  // @media (max-width: 1024px) {
  //   padding: 0 0.6328125rem;
  //   margin: 0.375rem 0 0 0.375rem;
  //   height: 1.078125rem;
  //   font-size: 0.5625rem;
  // }
  @media (max-width: 768px) {
    height: 1.125rem;
    font-size: 0.625rem;
  }
`;

const StyledAwards = styled(AwardsIcon)`
  width: 0.625rem;
`;

const TagAndTitleWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  flex: 1 0 0;

  @media (max-width: 768px) {
    gap: 0.5em;
  }
`;

const TagSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  // @media (max-width: 1024px) {
  //   margin-top: 0.3515625rem;
  //   gap: 0.28125rem;
  // }
  @media (max-width: 768px) {
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

  // @media (max-width: 1024px) {
  //   padding: 0 0.3515625rem;
  //   height: 1.078125rem;
  //   font-size: 0.5625rem;
  // }
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

  ${Wrapper}:hover & {
    background: var(--RIU_Primary-20, #D0D8FF);
    color: var(--RIU_Primary-200, #6680DF);
  }

  // @media (max-width: 1024px) {
  //   padding: 0 0.3515625rem;
  //   height: 1.078125rem;
  //   font-size: 0.5625rem;
  // }
  @media (max-width: 768px) {
    height: 1rem;
    font-size: 0.5rem;
  }
`;

const TitleGenreSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
  width: 100%;
  
  @media (max-width: 768px) {
    gap: 0.5em;
  }
`;

const TitleSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.234375em;
  align-self: stretch;

  // @media (max-width: 1024px) {
  //   margin-top: 0.703125rem;
  // }
  @media (max-width: 768px) {
    gap: 0.125em;
  }
`;

const CafeName = styled.div`
  width: 100%;
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.625rem;

  // 말줄임 표시
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;

  // @media (max-width: 1024px) {
  //   width: 15.75em;
  //   font-size: 0.5625em;
  // }
  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.625rem;
  }
`;

const Title = styled.div`
  width: 100%;
  color: var(--RIU_Primary-600, #303281);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.125rem;

  // 말줄임 표시
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow-wrap: break-word;

  // @media (max-width: 1024px) {
  //   width: 15.75rem;
  //   font-size: 1.125rem;
  // }
  @media (max-width: 768px) {
    width: 100%;
    font-size: 1rem;
  }
`;

const GenreSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.1875rem;

  // @media (max-width: 1024px) {
  //   gap: 0.375rem;
  // }
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const ReservationBox = styled.div`
  display: flex;
  width: 8.125em;
  height: 11.25em;
  padding: 2.5em 1.25em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  background: var(--RIU_Primary-80, #8DA3FF);
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    height: 1.875em;
    padding: 0em;
  }
`;

const LogoIcon = styled(Logo)`
  width: 3.75em;
  height: 3.75em;
`;

const ReservationInfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125em;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 0.75em;
    width: 100%;
  }
`;

const ReservationDate = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.75em;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const ReservationText = styled.div`
  color: var(--RIU_Primary-20, #D0D8FF);
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;