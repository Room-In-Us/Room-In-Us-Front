import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import ThumbnailImg from '../../../shared/assets/images/common/thumbnailImg.png';
import InfoIcon from '../../../shared/assets/icons/themeDetail/infoIcon.svg?react';
import ShareIcon from '../../../shared/assets/icons/themeDetail/shareIcon.svg?react';
import HeartIcon from '../../../shared/assets/icons/common/heart/heart_default.svg?react';
import HeartIcon2 from '../../../shared/assets/icons/common/heart/heart_hover.svg?react';
import HeartIcon3 from '../../../shared/assets/icons/common/heart/heart_active.svg?react';
import ReservationIcon from '../../../shared/assets/icons/themeDetail/reservationIcon.svg?react';
import ScheduleIcon from '../../../shared/assets/icons/themeDetail/scheduleIcon.svg?react';
import PropTypes from 'prop-types';
import useDevice from "../../../shared/hooks/useDevice";
// import { postThemeLikeAPI, deleteThemeLikeAPI } from "../../like/api/themeLikeAPI";

function ThemeOverviewCard({ themeData }) {
  // state 관리
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [imageUrl, setImageUrl] = useState(themeData.img);

  const navigate = useNavigate();

  const { isMobile } = useDevice();
  
  // 이미지 로드 실패 시, 기본 썸네일로 변경
  useEffect(() => {
    setImageUrl(themeData.img);
  }, [themeData.img]);
  const handleImageError = () => {
    setImageUrl(ThumbnailImg);
  };

  return (
    <ComponentWrapper>
      {/* 이미지 영역 */}
      <ImageSection imgUrl={imageUrl}>
        {/* 보이지 않는 img 태그 추가 (onError 감지용) */}
        <img src={imageUrl} alt="테마 이미지" onError={handleImageError}/>
      </ImageSection>

      {/* 타이틀 영역 */}
      <ContentWrapper>
        <TitleWrapper>
          <StoreName>
            {themeData.storeInfo?.storeName}
          </StoreName>
          <ThemeName>
            {themeData?.themeName}
          </ThemeName>
          <InfoWrapper>
            <StyledInfoIcon/>
            <InfoText>
              테마별 제공 정보는 지점별로 차이가 있을 수 있습니다.
            </InfoText>
          </InfoWrapper>
        </TitleWrapper>

        { !isMobile ? (
          <BottomWrapper>
            {/* 버튼 영역 */}
            <ButtonSection>
              <ButtonWrapper>
                <StyledButton onClick={() => window.open(themeData?.storeInfo?.storeReservationUrl, '_blank',)}>
                  <StyeldReservationIcon/>
                  <ButtonText>
                    예약하러 가기
                  </ButtonText>
                </StyledButton>
                <StyledButton onClick={() => navigate('/mypage/reservations')}>
                  <StyledScheduleIcon/>
                  <ButtonText>
                    일정에 추가하기
                  </ButtonText>
                </StyledButton>
              </ButtonWrapper>
              <WarningText>
                테마 스포일러 및 근거없는 비난성 후기는 예고없이 삭제될 수 있습니다.
              </WarningText>
            </ButtonSection>

            {/* 상호작용 영역 */}
            <InteractionWrapper>
              <InteractionButton
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                      alert('링크가 복사되었습니다!');
                    })
                    .catch((err) => {
                      console.error('링크 복사 실패:', err);
                    });
                }}
              >
                <StyledShareIcon/>
              </InteractionButton>
              <InteractionButton
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
              </InteractionButton>
            </InteractionWrapper>
          </BottomWrapper>
        ) : (
          // 모바일 버전
         <MobileBottomWrapper>
          <ButtonWrapper>
            <StyledButton type="reservation" onClick={() => window.open(themeData?.storeInfo?.storeReservationUrl, '_blank',)}>
              <StyeldReservationIcon/>
              <ButtonText>
                예약하러 가기
              </ButtonText>
            </StyledButton>
            <StyledButton type="schedule" onClick={() => navigate('/mypage/reservations')}>
              <StyledScheduleIcon/>
              <ButtonText>
                일정에 추가하기
              </ButtonText>
            </StyledButton>
          </ButtonWrapper>

          <InteractionWrapper>
            <InteractionButton
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
                  .then(() => {
                    alert('링크가 복사되었습니다!');
                  })
                  .catch((err) => {
                    console.error('링크 복사 실패:', err);
                  });
              }}
            >
              <StyledShareIcon/>
            </InteractionButton>
            <InteractionButton
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
            </InteractionButton>
          </InteractionWrapper>
         </MobileBottomWrapper> 
        )}
      </ContentWrapper>
    </ComponentWrapper>
  )
}

// eslint 오류 방지
ThemeOverviewCard.propTypes = {
  themeData: PropTypes.shape({
    themeId: PropTypes.number,
    themeName: PropTypes.string,
    img: PropTypes.string,
    playTime: PropTypes.number,
    minRecommendedHeadcount: PropTypes.number,
    maxRecommendedHeadcount: PropTypes.number,
    genreList: PropTypes.arrayOf(PropTypes.string),
    level: PropTypes.number,
    horrorLevel: PropTypes.number,
    synopsis: PropTypes.string,
    storeInfo: PropTypes.shape({
      storeId: PropTypes.number,
      storeName: PropTypes.string,
      storeWebsiteUrl: PropTypes.string,
      storeReservationUrl: PropTypes.string,
      storeAddress: PropTypes.string,
      storeContact: PropTypes.string,
    }),
  }),
};

export default ThemeOverviewCard;

// CSS
const ComponentWrapper = styled.div`
  width: 23.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    gap: 1rem;
  }
`;

const ImageSection = styled.div`
  border-radius: 0.625rem;
  height: 35.625rem;
  align-self: stretch;
  background-image: url(${props => props.imgUrl});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;

  img {
    display: none;
  }

  @media (max-width: 768px) {
    width: 9.375rem;
    height: 13.125rem;
    flex-shrink: 0;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    height: 13.125rem;
    justify-content: space-between;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const StoreName = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const ThemeName = styled.div`
  color: var(--RIU_Primary-500, #4648A7);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.375rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StyledInfoIcon = styled(InfoIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
  }
`;

const InfoText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

const BottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;

const StyledButton = styled.div`
  border-radius: 2.5rem;
  padding: 0.875rem 0rem;
  box-sizing: border-box;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  flex: 1 0 0;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  transition: all 0.1s ease-in-out;
  cursor: pointer;

  &:hover {
    background: var(--RIU_Primary-20, #D0D8FF);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 1.5625rem;
    justify-content: center;
    gap: 0.3125rem;
  }
`;

const ButtonText = styled.div`
  color: var(--RIU_Primary-200, #6680DF);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 130%;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;  

const WarningText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 140%;
`;

const InteractionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
`;

const InteractionButton = styled.div`
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  border-radius: 2.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  aspect-ratio: 1/1;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  cursor: pointer;
  position: relative;
  right: 0.5rem;
  bottom: 0.4rem;

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

  @media (max-width: 768px) {
    width: 1.5625rem;
    height: 1.5625rem;
    right: 0;
    bottom: 0;
  }
`;

const StyledShareIcon = styled(ShareIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

const StyledHeartIcon = styled(HeartIcon)`
  width: 1rem;
  height: 1rem;

  @media (max-width: 768px) {
    width: 0.75rem;
    height: 0.75rem;
  }
`;
const StyledHeartIcon2 = styled(HeartIcon2)`
  width: 1rem;
  height: 1rem;

  @media (max-width: 768px) {
    width: 0.75rem;
    height: 0.75rem;
  }
`;
const StyledHeartIcon3 = styled(HeartIcon3)`
  width: 1rem;
  height: 1rem;

  @media (max-width: 768px) {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

const StyeldReservationIcon = styled(ReservationIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
  }
`;
const StyledScheduleIcon = styled(ScheduleIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
  }
`;

const MobileBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  gap: 0.625rem;
`;
