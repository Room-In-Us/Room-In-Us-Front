import styled from "styled-components";
import SummaryInfoCard from "./SummaryInfoCard";
import PlayTimeIcon from "../../../shared/assets/icons/themeDetail/playTimeIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/recommendMemberIcon.svg?react";
import GenreIcon from "../../../shared/assets/icons/themeDetail/genreIcon.svg?react";
import LevelIcon from "../../../shared/assets/icons/themeDetail/levelIcon.svg?react";
import HorrorIcon from "../../../shared/assets/icons/themeDetail/horrorIcon.svg?react";
import PriceTable from "./PriceTable";
import LocationIcon from "../../../shared/assets/icons/location/storeLocationIcon.svg?react";
import LinkIcon from "../../../shared/assets/icons/location/storeLinkIcon.svg?react";
import TelIcon from "../../../shared/assets/icons/location/storeTelIcon.svg?react";
import CopyIcon from "../../../shared/assets/icons/location/copyIcon.svg?react";
import NoDataIcon from "../../../shared/assets/images/common/noData/noDataImageSmall.png";
import ThemeReviewSection from "./ThemeReviewSection";
import PropTypes from 'prop-types';
import useDevice from "../../../shared/hooks/useDevice";
import { genreListConversion, mapRecommendedHeadcount } from "../../../shared/utils/dataUtils";
import { useState } from "react";
import type { Dispatch, SetStateAction } from 'react';
import type { ThemePriceResponse } from '../api/types';
import type { ThemeDetailView } from '../model/themeDetailView';

type ThemeInfoSectionProps = { themeData: ThemeDetailView; themePrice: ThemePriceResponse[]; reviewRefetchKey?: number };

function ThemeInfoSection({ themeData, themePrice, reviewRefetchKey }: ThemeInfoSectionProps) {
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const [showUrlTooltip, setShowUrlTooltip] = useState(false);
  const [showContactTooltip, setShowContactTooltip] = useState(false);

  const { isMobile } = useDevice();

  // 임시 테마 정보 값
  const themeInfo = {
    playTime: themeData?.playTime != null ? `${themeData?.playTime}분` : "-",
    member: mapRecommendedHeadcount(themeData?.minRecommendedHeadcount,themeData?.maxRecommendedHeadcount),
    genre: themeData?.genreList?.[0]
      ? genreListConversion([themeData.genreList[0]])[0]
      : "-",
    level: themeData?.level != null ? `⭐ ${themeData?.level}` : "-",
    horror: themeData?.horrorLevel != null ? `👻 ${themeData.horrorLevel}` : "-",
    story: themeData?.synopsis ?? "-",
  };

  // 임시 매장 정보 값
  const storeInfo = {
    storeName: themeData?.storeInfo?.storeName ?? "-",
    storeAddress: themeData?.storeInfo?.storeAddress ?? "-",
    storeWebsiteUrl: themeData?.storeInfo?.storeWebsiteUrl ?? "-",
    storeContact: themeData?.storeInfo?.storeContact ?? "-",
  };
  
  // 상세 정보 복사 기능
  const showTooltipWithTimer = (setFn: Dispatch<SetStateAction<boolean>>) => {
    setFn(true);
    setTimeout(() => setFn(false), 1500);
  };

  const handleAddressCopy = (data: string) => {
    navigator.clipboard.writeText(data)
      .then(() => {
        showTooltipWithTimer(setShowAddressTooltip);
      })
      .catch((err: unknown) => {
        console.error('주소 복사 실패:', err);
      });
  };

  const handleUrlCopy = (data: string) => {
    navigator.clipboard.writeText(data)
      .then(() => {
        showTooltipWithTimer(setShowUrlTooltip);
      })
      .catch((err: unknown) => {
        console.error('URL 복사 실패:', err);
      });
  };

  const handleContactCopy = (data: string) => {
    navigator.clipboard.writeText(data)
      .then(() => {
        showTooltipWithTimer(setShowContactTooltip);
      })
      .catch((err: unknown) => {
        console.error('연락처 복사 실패:', err);
      });
  };

  return (
    <ComponentWrapper>
      {/* 테마 정보 요약 */}
      <SectionWrapper>
        <SectionTitle>
          테마 정보 요약
        </SectionTitle>
        <Divider/>
        <CardWrapper>
          <SummaryInfoCard
            icon={<PlayTimeIcon style={{ width: isMobile ? '0.9375rem' : '1.875rem', height: isMobile ? '0.9375rem' : '1.875rem' }}/>}
            type="플레이 타임"
            value={themeInfo.playTime}
          />
          <SummaryInfoCard
            icon={<MemberIcon style={{ width: isMobile ? '0.9375rem' : '1.875rem', height: isMobile ? '0.9375rem' : '1.875rem' }}/>}
            type="추천 인원"
            value={themeInfo.member}
          />
          <SummaryInfoCard
            icon={<GenreIcon style={{ width: isMobile ? '0.9375rem' : '1.875rem', height: isMobile ? '0.9375rem' : '1.875rem' }}/>}
            type="장르"
            value={themeInfo.genre}
          />
          <SummaryInfoCard
            icon={<LevelIcon style={{ width: isMobile ? '0.9375rem' : '1.875rem', height: isMobile ? '0.9375rem' : '1.875rem' }}/>}
            type="난이도"
            value={themeInfo.level}
          />
          <SummaryInfoCard
            icon={<HorrorIcon style={{ width: isMobile ? '0.9375rem' : '1.875rem', height: isMobile ? '0.9375rem' : '1.875rem' }}/>}
            type="공포도"
            value={themeInfo.horror}
          />
        </CardWrapper>
      </SectionWrapper>

      {/* 테마 스토리 */}
      <SectionWrapper>
        <SectionTitle>
          테마 스토리
        </SectionTitle>
        <Divider/>
        {themeInfo.story !== '-' ? (
          <StoryText>
            {themeInfo.story}
          </StoryText>
        ) : (
          <NoDataWrapper>
            <StyledNoDataIcon src={NoDataIcon}/>
            <NoDataText>
              작성된 스토리가 없습니다.
            </NoDataText>
          </NoDataWrapper>
        )}
      </SectionWrapper>

      {/* 테마 후기 */}
      <ThemeReviewSection
        themeId={themeData?.themeId}
        reviewRefetchKey={reviewRefetchKey}
      />

      {/* 인당 가격 안내 */}
      <SectionWrapper>
        <PriceTitleWrapper>
          <SectionTitle>
            인당 가격 안내
          </SectionTitle>
          <PriceCautionText>
            실제 가격이 상이할 수 있습니다.
          </PriceCautionText>
        </PriceTitleWrapper>
        <Divider/>
        {themePrice.length > 0 ? (
          <PriceTable themePrice={themePrice}/>
        ) : (
          <NoDataWrapper>
            <StyledNoDataIcon src={NoDataIcon}/>
            <NoDataText>
              제공되는 가격 정보가 없습니다.
            </NoDataText>
          </NoDataWrapper>
        )}
      </SectionWrapper>

      {/* 매장 정보 */}
      <SectionWrapper>
        <SectionTitle>
          매장 정보
        </SectionTitle>
        <Divider/>
        <StoreInfoWrapper>
          <StoreName>
            {storeInfo.storeName}
          </StoreName>
          <DescriptionWrapper>
            <DescriptionList>
              <StyledLocationIcon/>
              <DescriptionText>{storeInfo.storeAddress}</DescriptionText>
              <CopyWrapper>
                <StyledCopyIcon onClick={() => handleAddressCopy(storeInfo.storeAddress)}></StyledCopyIcon>
                {showAddressTooltip && <Tooltip>주소 복사 완료!</Tooltip>}
              </CopyWrapper>
            </DescriptionList>
            <DescriptionList>
              <StyledLinkIcon/>
              <DescriptionText
                href={storeInfo.storeWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >{storeInfo.storeWebsiteUrl}</DescriptionText>
              <CopyWrapper>
                <StyledCopyIcon onClick={() => handleUrlCopy(storeInfo.storeWebsiteUrl)}/>
                {showUrlTooltip && <Tooltip>URL 복사 완료!</Tooltip>}
              </CopyWrapper>
            </DescriptionList>
            <DescriptionList>
              <StyledTelIcon/>
              <DescriptionText>{storeInfo.storeContact}</DescriptionText>
              <CopyWrapper>
                <StyledCopyIcon onClick={() => handleContactCopy(storeInfo.storeContact)}/>          
                {showContactTooltip && <Tooltip>번호 복사 완료!</Tooltip>}
              </CopyWrapper>
            </DescriptionList>
          </DescriptionWrapper>
        </StoreInfoWrapper>
      </SectionWrapper>
    </ComponentWrapper>
  )
}

// eslint 오류 방지
ThemeInfoSection.propTypes = {
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
  themePrice: PropTypes.arrayOf(
    PropTypes.shape({
      headcount: PropTypes.number,
      price: PropTypes.number,
    })
  ),
};

export default ThemeInfoSection;

// CSS
const ComponentWrapper = styled.div`
  width: 43.75rem;
  height: 54rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: #8DA3FF;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.875rem;
    width: 100%;
    min-width: 20.9375rem;
    height: auto;
  }
`;

const SectionWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const PriceCautionText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const Divider = styled.hr`
  border: none;
  margin: 0;
  width: 41.25rem;
  height: 0.0625rem;
  background: #C4C6D1;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5625rem;
  align-self: stretch;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.625rem;
  }
`;

const StoryText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PriceTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const StoreInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StoreName = styled.div`
  color: var(--RIU_Primary-600, #303281);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1.25rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DescriptionList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const StyledLocationIcon = styled(LocationIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;
const StyledLinkIcon = styled(LinkIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;
const StyledTelIcon = styled(TelIcon)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

const DescriptionText = styled.a`
  max-width: 30rem;
  color: var(--RIU_Monochrome-400, #616277);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    flex: 1;
    font-size: 0.75rem;
    text-align: start;
  }
`;

const StyledCopyIcon = styled(CopyIcon)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

const NoDataWrapper = styled.div`
  height: 18.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  align-self: stretch;

  @media (max-width: 768px) {
    height: 10.625rem;
    gap: 0.3125rem;
  }
`;

const StyledNoDataIcon = styled.img`
  width: 3.75rem;
  height: 3.75rem;

  @media (max-width: 768px) {
    width: 3.125rem;
    height: 3.125rem;
  }
`;

const NoDataText = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`;

const CopyWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Tooltip = styled.div`
  width: 5.625rem;
  height: 1.625rem;
  position: absolute;
  bottom: 105%;
  left: 50%;
  transform: translateX(-50%);
  flex-shrink: 0;

  /* 배경/스트로크/라운드 */
  background: var(--RIU_Monochrome-10, #F9F9FB);
  border: 1px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 0.25rem;

  /* 내용 정렬 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 텍스트 스타일 */
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: Pretendard;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: normal;
  z-index: 20;

  /* 등장/퇴장 애니메이션 (원 코드 유지) */
  animation: fadeInOut 1.5s ease forwards;

  /* 꼬리: 스트로크(바깥) */
  &::before {
    border-width: 0.5rem 0.3125rem 0 0.3125rem;
    border-style: solid;
    border-color: var(--RIU_Primary-100, #718FF2) transparent transparent transparent;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    content: "";
  }

  /* 꼬리: 필(안쪽) */
  &::after {
    border-width: 0.5rem 0.3125rem 0 0.3125rem;
    border-style: solid;
    border-color: var(--RIU_Monochrome-10, #F9F9FB) transparent transparent transparent;
    position: absolute;
    top: calc(100% - 1px);
    left: 50%;
    transform: translateX(-50%);
    content: "";
  }

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, 4px); }
    15% { opacity: 1; transform: translate(-50%, 0); }
    85% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 4px); }
  }
`;
