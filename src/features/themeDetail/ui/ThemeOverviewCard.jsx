import { useState, useEffect } from "react";
import styled from "styled-components";
import ThumbnailImg from '../../../shared/assets/images/common/thumbnailImg.png';
import InfoIcon from '../../../shared/assets/icons/themeDetail/infoIcon.svg?react';
import ShareIcon from '../../../shared/assets/icons/themeDetail/shareIcon.svg?react';
import HeartIcon from '../../../shared/assets/icons/common/heart_default.svg?react';
import HeartIcon2 from '../../../shared/assets/icons/common/heart_hover.svg?react';
import HeartIcon3 from '../../../shared/assets/icons/common/heart_active.svg?react';
import { useSetRecoilState } from 'recoil';
import { reviewModalState } from "../model/reviewAtom";
import PropTypes from 'prop-types';

function ThemeOverviewCard({ themeData }) {
  // state 관리
  const [isHeartActive, setIsHeartActive] = useState(false);
  const [imageUrl, setImageUrl] = useState(themeData.img);
  const setModal = useSetRecoilState(reviewModalState);

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

      {/* 버튼 영역 */}
      <ButtonWrapper>
        <StyledButton type="reservation" onClick={() => window.open(themeData?.storeInfo?.storeReservationUrl, '_blank',)}>
          <ButtonText type="reservation">
            예약하기
          </ButtonText>
        </StyledButton>
        <StyledButton type="reviewWrite" onClick={() => setModal(true)}>
          <ButtonText type="reviewWrite">
            후기 작성하기
          </ButtonText>
        </StyledButton>
        <WarningText>
          테마 스포일러 및 근거없는 비난성 후기는 예고없이 삭제될 수 있습니다.
        </WarningText>
      </ButtonWrapper>

      {/* 상호작용 영역 */}
      <InteractionWrapper>
        <InteractionButton>
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
    </ComponentWrapper>
  )
}

// eslint 오류 방지
ThemeOverviewCard.propTypes = {
  themeData: PropTypes.shape({
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
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.375rem;
`;

const StoreName = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: normal;
`;

const ThemeName = styled.div`
  color: var(--RIU_Primary-500, #4648A7);
  font-family: 'Pretendard-ExtraBold';
  font-size: 1.375rem;
  line-height: normal;
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const StyledInfoIcon = styled(InfoIcon)`
  width: 1.25rem;
  height: 1.25rem;
`;

const InfoText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: normal;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
`;

const StyledButton = styled.div`
  border-radius: 2.5rem;
  display: flex;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  background: ${(props) => (props.type === "reviewWrite" ? "var(--RIU_Primary-80, #8DA3FF)" : "var(--RIU_Primary-20, #D0D8FF)")};
  cursor: pointer;
`;

const ButtonText = styled.div`
  color: ${(props) => (props.type === "reviewWrite" ? "var(--RIU_Monochrome-10, #F9F9FB)" : "var(--RIU_Primary-200, #6680DF)")};
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 130%;
  cursor: pointer;
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
`;

const StyledShareIcon = styled(ShareIcon)`
  width: 1.25rem;
  height: 1.25rem;
`;

const StyledHeartIcon = styled(HeartIcon)`
  width: 1rem;
  height: 1rem;
`;
const StyledHeartIcon2 = styled(HeartIcon2)`
  width: 1rem;
  height: 1rem;
`;
const StyledHeartIcon3 = styled(HeartIcon3)`
  width: 1rem;
  height: 1rem;
`;
