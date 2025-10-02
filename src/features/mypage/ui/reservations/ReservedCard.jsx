import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components"
import useDevice from "../../../../shared/hooks/useDevice";
import { useEffect, useState } from "react";
import { genreListConversion, levelTextConversion, satisfactionConversion } from "../../../../shared/utils/dataUtils";
import ThumbnailImg from '../../../../shared/assets/images/common/thumbnailImg.png';
import AwardsIcon from '../../../../shared/assets/icons/common/awards.svg?react';
import Logo from '../../../../shared/assets/icons/common/logo.svg?react';
import ReservationDropDown from "./ReservationDropDown";
import { useSetRecoilState } from "recoil";
import { reviewModalState, selectedThemeDataState } from "../../../themeDetail/model/reviewAtom";
import Plus from '../../../../shared/assets/icons/common/plusIcon.svg?react';
import Trash from "../../../../shared/assets/icons/reviewWrite/trashicon.svg?react";
import dayjs from "dayjs";

export default function ReservedCard({ data, isModal, hideTrash=false, setSelectedTheme, setSelectedThemeId }) {
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
    reservedAt,
  } = data || {};

  // state 관리
  const [imageUrl, setImageUrl] = useState(themeImg);
  const setReviewModalOpen = useSetRecoilState(reviewModalState);
  const setSelectedThemeData = useSetRecoilState(selectedThemeDataState);
  
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

  const handleRemoveSelection = (e) => {
    e.stopPropagation();
    setSelectedTheme(null);
    setSelectedThemeId(null);
  };

  return (
    <>
      {data ? (
        <Wrapper>
      <ThemeItemBox onClick={() => navigate(`/theme/${themeId}`)}>
        {/* 이미지 영역 */}
        <ImageSection isModal={isModal} imgUrl={imageUrl}>
          <LocationTag isModal={isModal}>
            <LocationText isModal={isModal}>{locationName}</LocationText>
          </LocationTag>
          {awardsYear && 
          <AwardsTag isModal={isModal}>
            <StyledAwards isModal={isModal}/>
            <AwardsTagText isModal={isModal}>{awardsYear}</AwardsTagText>
          </AwardsTag>}
          {/* 보이지 않는 img 태그 추가 (onError 감지용) */}
          <img src={imageUrl} alt="테마 이미지" onError={handleImageError} />
        </ImageSection>

        <TagAndTitleWrapper isModal={isModal}>
          {/* 태그 영역 */}
          <TagSection isModal={isModal}>
            <ScoreTag isModal={isModal}>
              <ScoreTagText isModal={isModal}>⭐&nbsp;&nbsp;&nbsp;{satisfactionConversion(satisfactionLevel)}</ScoreTagText>
            </ScoreTag>
            <Tag isModal={isModal}>
              <TagText isModal={isModal}>{levelTextConversion(level)}</TagText>
            </Tag>
            <Tag isModal={isModal}>
              <TagText isModal={isModal}>{playTime}분</TagText>
            </Tag>
          </TagSection>

          <TitleGenreSection>
            {/* 제목 영역 */}
            <TitleSection>
              <CafeName isModal={isModal}>{storeName}</CafeName>
              <Title isModal={isModal}>{themeName}</Title>
            </TitleSection>

            {/* 장르 영역 */}
            <GenreSection isModal={isModal}>
              {genreList &&
                genreListConversion(genreList).map((genre, index) => (
                  <Tag  isModal={isModal} key={index}>
                    <TagText isModal={isModal}>{genre}</TagText>
                  </Tag>
              ))}
            </GenreSection>
          </TitleGenreSection>

        </TagAndTitleWrapper>

        {/* 더보기 영역 */}
        {isModal ? (
          !hideTrash && <TrashIcon onClick={handleRemoveSelection} />
        ) : (
          <ReservationDropDown
            reservation={data}
            onReviewClick={() => {
              setSelectedThemeData({ data, img: data.themeImg });
              setReviewModalOpen(true);
            }}
          />
        )}
                  
      </ThemeItemBox>
        
      <ReservationBox>
        { !isMobile && (<LogoIcon />)}
        <ReservationInfoBox>
          <ReservationDate>{reservedAt ? dayjs(reservedAt).format("MM월 DD일 HH:mm") : ""}</ReservationDate>
          <ReservationText>예약 완료</ReservationText>
        </ReservationInfoBox>
      </ReservationBox>
        </Wrapper>
      ) : (
        // data가 null일 때 (초기 상태 또는 선택 취소)
      <Wrapper>
        <ThemeItemBox2>
          <PlusIcon />
          <InfoText>선택한 테마가<br/>표시됩니다</InfoText>
        </ThemeItemBox2>
        
        <ReservationBox>
        { !isMobile && (<LogoIcon />)}
        <ReservationInfoBox>
          <ReservationText>
            {isMobile ? "일정을 선택해주세요" : <>일정을<br/>선택해주세요</>}
          </ReservationText>
        </ReservationInfoBox>
      </ReservationBox>
            </Wrapper>
      )}
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;
  border-radius: 0.625em;
  border: 1px solid var(--RIU_Primary-80, #8DA3FF);
  overflow: hidden;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`;

const ThemeItemBox = styled.div`
  display: flex;
  padding: 0.625em;
  align-items: flex-start;
  gap: 0.9375em;
  flex: 1 0 0;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  transition: background 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background: var(--RIU_Primary-0, #E8EAFF);
  }

  @media (max-width: 768px) {
    gap: 0.5em;
    align-self: stretch;
  }
`;

const ThemeItemBox2 = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 10em;
    padding: 0.625em;
    gap: 0.5em;
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

  ${props => props.isModal && css`
    width: 10em;
    height: 10em;
    border-radius: 0.5625em;
  `}

  img {
    display: none;
  }

  @media (max-width: 768px) {
    border-radius: 0.375rem;
    width: 8.75rem;
    height: 8.75rem;
    display: flex;
    flex-direction: column;

    ${props => props.isModal && css`
      width: 8.75em;
      height: 8.75em;
      border-radius: 0.375em;
    `}
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

  ${props => props.isModal && css`
      padding: 0.3125em 0.75em;
      margin: 0.5em 0 0 0.5em;
      height: 1.375em;
      border-radius: 0.9375em;
  `}

  @media (max-width: 768px) {
    height: 1.125rem;
    font-size: 0.625rem;
    
    ${props => props.isModal && css`
      height: 1.125em;
      font-size: 0.625em;
    `}
  }
`;

const LocationText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;

  ${props => props.isModal && css`
      font-size: 0.65625em;
  `}
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

  ${props => props.isModal && css`
      border-radius: 0.9375em;
      padding: 0 0.75em;
      margin: 0.5em 0 0 0.5em;
      height: 1.375em;
      gap: 0.25em;
  `}

  @media (max-width: 768px) {
    height: 1.125rem;

    ${props => props.isModal && css`
      height: 1.125em;
    `}
  }
`;

const AwardsTagText = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;

  ${props => props.isModal && css`
      font-size: 0.65625em;
  `}

  @media (max-width: 768px) {
    font-size: 0.625rem;

    ${props => props.isModal && css`
      font-size: 0.625em;
    `}
  }
`;

const StyledAwards = styled(AwardsIcon)`
  width: 0.625rem;

  ${props => props.isModal && css`
      width: 0.625em;
  `}
`;

const TagAndTitleWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  flex: 1 0 0;

  ${props => props.isModal && css`
      gap: 0.875em;
  `}

  @media (max-width: 768px) {
    gap: 0.5rem;

    ${props => props.isModal && css`
        gap: 0.5em;
    `}
  }
`;

const TagSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.375rem;

  ${props => props.isModal && css`
      gap: 0.375em;
  `}

  @media (max-width: 768px) {
    gap: 0.25rem;

    ${props => props.isModal && css`
      gap: 0.25em;
  `}
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

  ${props => props.isModal && css`
      border-radius: 0.1875em;
      padding: 0 0.46875em;
      height: 1.375em;
  `}

  @media (max-width: 768px) {
    height: 1rem;
    padding: 0 0.3rem;

    ${props => props.isModal && css`
      height: 1em;
      padding: 0 0.3em;
    `}
  }
`;

const ScoreTagText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.65625rem;

  ${props => props.isModal && css`
      font-size: 0.65625em;
  `}

  @media (max-width: 768px) {
    font-size: 0.5rem;

    ${props => props.isModal && css`
      font-size: 0.5em;
    `}
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

  ${props => props.isModal && css`
      border-radius: 0.1875em;
      padding: 0 0.46875em;
      height: 1.375em;
  `}

  ${Wrapper}:hover & {
    background: var(--RIU_Primary-20, #D0D8FF);
  }

  @media (max-width: 768px) {
    height: 1rem;

    ${props => props.isModal && css`
      height: 1em;
    `}
  }
`;

const TagText = styled.div`
  font-family: 'Pretendard-Medium';
  font-size: 0.65625rem;
  transition: background 0.2s ease-in-out;
  color: var(--RIU_Monochrome-80, #A1A4B5);

  ${Wrapper}:hover & {
    color: var(--RIU_Primary-200, #6680DF);
  }

  ${props => props.isModal && css`
      font-size: 0.65625em;
  `}


  @media (max-width: 768px) {
    font-size: 0.5rem;

    ${props => props.isModal && css`
      font-size: 0.5em;
    `}
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

  ${props => props.isModal && css`
      font-size: 0.625em;
  `}

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

  ${props => props.isModal && css`
      font-size: 1.125em;
  `}

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

  ${props => props.isModal && css`
      gap: 0.1875em;
  `}

  @media (max-width: 768px) {
    gap: 0.25rem;

    ${props => props.isModal && css`
      gap: 0.25em;
    `}
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
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const PlusIcon = styled(Plus)`
  display: flex;
  width: 2.5em;
  height: 2.5em;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 1.5625em;
    height: 1.5625em;
  }
`;

const InfoText = styled.div`
  color: var(--RIU_Monochrome-70, #B3B6C3);
  text-align: center;
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const TrashIcon = styled(Trash)`
  display: flex;
  width: 1.3125em;
  height: 1.3125em;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  path {
    fill: #717486;
  }

  @media (max-width: 768px) {
    width: 1em;
    height: 1em;
  }
`;