import styled from "styled-components";
import SummaryInfoCard from "./SummaryInfoCard";
import PlayTimeIcon from "../../../shared/assets/icons/themeDetail/playTimeIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/recommendMemberIcon.svg?react";
import GenreIcon from "../../../shared/assets/icons/themeDetail/genreIcon.svg?react";
import LevelIcon from "../../../shared/assets/icons/themeDetail/levelIcon.svg?react";
import HorrorIcon from "../../../shared/assets/icons/themeDetail/horrorIcon.svg?react";
import LocationIcon from "../../../shared/assets/icons/location/storeLocationIcon.svg?react";
import LinkIcon from "../../../shared/assets/icons/location/storeLinkIcon.svg?react";
import TelIcon from "../../../shared/assets/icons/location/storeTelIcon.svg?react";
import CopyIcon from "../../../shared/assets/icons/location/copyIcon.svg?react";

function ThemeInfoSection() {
  // 임시 테마 정보 값
  const themeInfo = {
    playTime: "120분",
    member: "2~6명",
    genre: "판타지",
    level: "⭐ 4.4",
    horror: "👻 3.2",
    story: "내 이름은 John. JACK IN THE SHOW에 들어 온지도 어느덧 3년째... 난 언제쯤 무대에 설 수 있을까?",
  };

  // 임시 매장 정보 값
  const storeInfo = {
    storeName: "비트포비아 강남 던전",
    storeAddress: "서울 강남구 강남대로96길 17 6층",
    storeWebsiteUrl: "https://www.keyescape.co.kr/",
    storeContact: "02)000-0000",
  };
  
  // 상세 정보 복사 핸들러
  const handleInfoCopy = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
    } catch (err) {
      console.log(err);
    }
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
            icon={<PlayTimeIcon style={{ width: '1.875rem', height: '1.875rem' }}/>}
            type="플레이 타임"
            value={themeInfo.playTime}
          />
          <SummaryInfoCard
            icon={<MemberIcon style={{ width: '1.875rem', height: '1.875rem' }}/>}
            type="추천 인원"
            value={themeInfo.member}
          />
          <SummaryInfoCard
            icon={<GenreIcon style={{ width: '1.875rem', height: '1.875rem' }}/>}
            type="장르"
            value={themeInfo.genre}
          />
          <SummaryInfoCard
            icon={<LevelIcon style={{ width: '1.875rem', height: '1.875rem' }}/>}
            type="난이도"
            value={themeInfo.level}
          />
          <SummaryInfoCard
            icon={<HorrorIcon style={{ width: '1.875rem', height: '1.875rem' }}/>}
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
        <StoryText>
          {themeInfo.story}
        </StoryText>
      </SectionWrapper>

      {/* 테마 후기 */}
      <SectionWrapper>
        <SectionTitle>
          테마 후기
        </SectionTitle>
        <Divider/>
      </SectionWrapper>

      {/* 인당 가격 안내 */}
      <SectionWrapper>
        <SectionTitle>
          인당 가격 안내
        </SectionTitle>
        <Divider/>
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
              <StyledCopyIcon onClick={() => handleInfoCopy(storeInfo.storeAddress)}/>
            </DescriptionList>
            <DescriptionList>
              <StyledLinkIcon/>
              <DescriptionText
                href={storeInfo.storeWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >{storeInfo.storeWebsiteUrl}</DescriptionText>
              <StyledCopyIcon onClick={() => handleInfoCopy(storeInfo.storeWebsiteUrl)}/>
            </DescriptionList>
            <DescriptionList>
              <StyledTelIcon/>
              <DescriptionText>{storeInfo.storeContact}</DescriptionText>
              <StyledCopyIcon onClick={() => handleInfoCopy(storeInfo.storeContact)}/>          
            </DescriptionList>
          </DescriptionWrapper>
        </StoreInfoWrapper>
      </SectionWrapper>
    </ComponentWrapper>
  )
}

export default ThemeInfoSection;

// CSS
const ComponentWrapper = styled.div`
  width: 43.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;
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
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;
`;

const Divider = styled.hr`
  border: none;
  margin: 0;
  width: 41.25rem;
  height: 0.0625rem;
  background: #C4C6D1;
`;

const CardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5625rem;
  align-self: stretch;
`;

const StoryText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 140%;
`;

const StoreInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
`;

const StoreName = styled.div`
  color: var(--RIU_Primary-600, #303281);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1.25rem;
  line-height: normal;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`;

const DescriptionList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const StyledLocationIcon = styled(LocationIcon)`
  width: 1.25rem;
  height: 1.25rem;
`;
const StyledLinkIcon = styled(LinkIcon)`
  width: 1.25rem;
  height: 1.25rem;
`;
const StyledTelIcon = styled(TelIcon)`
  width: 1.25rem;
  height: 1.25rem;
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
`;

const StyledCopyIcon = styled(CopyIcon)`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;
