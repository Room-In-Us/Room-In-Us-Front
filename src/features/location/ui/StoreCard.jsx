import { useState, useEffect } from "react";
import styled from "styled-components";
import LeftArrowIcon from "../../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import LocationIcon from "../../../shared/assets/icons/location/storeLocationIcon.svg?react";
import LinkIcon from "../../../shared/assets/icons/location/storeLinkIcon.svg?react";
import TelIcon from "../../../shared/assets/icons/location/storeTelIcon.svg?react";
import CopyIcon from "../../../shared/assets/icons/location/copyIcon.svg?react";
import { useRecoilState } from "recoil";
import { stationCardVisible, storeCardVisible, locationStoreId } from "../../../features/location/model/locationAtom";
import LocationPeopleFilter from "./filter/LocationPeopleFilter";
import LocationSortFilter from "./filter/LocationSortFilter";
import LocationContentCard from "./LocationContentCard";
import { getLocationListAPI, getLocationStoreInfoAPI } from "../api/locationAPI";

function StoreCard() {
  // 상태 관리
  const [headCount, setHeadCount] = useState(2); // 인원 필터 상태
  const [selectedSort, setSelectedSort] = useState("HIGH_SATISFACTION_LEVEL"); // 정렬 필터 상태
  const [themeList, setThemeList] = useState([]);
  const [, setIsStationCardVisible] = useRecoilState(stationCardVisible);
  const [, setIsStoreCardVisible] = useRecoilState(storeCardVisible);
  const [storeId,] = useRecoilState(locationStoreId);
  const [storeInfo, setStoreInfo] = useState([]);

  // 돌아가기 핸들러
  const handleStationSelect = () => {
    setIsStationCardVisible(true);
    setIsStoreCardVisible(false);
  };

  // 인원수 필터링
  const handlePeopleFilterChange = (count) => {
    setHeadCount(count); 
  };

  // 매장 상세 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLocationStoreInfoAPI(storeId);
        console.log('매장 상세 정보: ', response);
        setStoreInfo(response);
      } catch (error) {
        console.error('매장 상세 정보 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [storeId]);

  // 테마 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLocationListAPI(storeId, headCount, 1, 10000, selectedSort);
        console.log('테마 목록: ', response.contents);
        setThemeList(response.contents);
      } catch (error) {
        console.error('테마 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [storeId, headCount, selectedSort]);

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
      {/* 돌아가기 버튼 영역 */}
      <GoBackButtonWrapper>
        <StyledLeftArrowIcon onClick={handleStationSelect}/>
        <GoBackText onClick={handleStationSelect}>매장 선택으로 돌아가기</GoBackText>
      </GoBackButtonWrapper>

      {/* 타이틀 영역 */}
      <TitleWrapper>
        <Title>
          {storeInfo.storeName}
        </Title>
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
      </TitleWrapper>
      
      {/* 필터 영역 */}
      <FilterTitleWrapper>
        <ThemeNumber>
          테마 목록 &#40;{themeList.length}&#41;
        </ThemeNumber>
        <FilterWrapper>
          {/* 인원 필터 */}
          <LocationPeopleFilter onSelect={(count) => handlePeopleFilterChange(count)} selected={headCount} />
          {/* 정렬 필터 */}
          <LocationSortFilter onSelect={(value) => setSelectedSort(value)} selected={selectedSort} />
        </FilterWrapper>
      </FilterTitleWrapper>

      {/* 콘텐츠 카드 영역 */}
      <ContentCardWrapper>
        {themeList.map((items) => (
          <LocationContentCard key={items.id} data={items} headCount={headCount} type="location"/>
        ))}
      </ContentCardWrapper>
    </ComponentWrapper>
  )
}

export default StoreCard;

// CSS
const ComponentWrapper = styled.div`
  border-radius: 1.25em;
  padding: 0 2.5em;
  box-sizing: border-box;
  display: flex;
  width: 34.375em;
  height: 55.375em;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  background: var(--RIU_Monochrome-20, #F0F0F4);
  pointer-events: auto;

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 1.5em;
    width: 100%;
    height: 100%;
  }
`;

const GoBackButtonWrapper = styled.div`
  display: flex;
  padding: 1.25em 0em;
  box-sizing: border-box;
  align-items: center;
  align-self: stretch;

  @media (max-width: 768px) {
    font-size: 1.2em;
    padding: 0;
  }
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  padding-right: 0.625em;
  width: 1.25em;
  height: 1.25em;
  fill: #717486;
  cursor: pointer;
`;

const GoBackText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Medium';
  line-height: normal;
  cursor: pointer;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
`;

const Title = styled.div`
  color: var(--RIU_Primary-600, #303281);
  font-family: 'Pretendard-Bold';
  font-size: 1.75em;
  line-height: normal;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
`;

const DescriptionList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const StyledLocationIcon = styled(LocationIcon)`
  width: 1.5625em;
  height: 1.5625em;
`;
const StyledLinkIcon = styled(LinkIcon)`
  width: 1.5625em;
  height: 1.5625em;
`;
const StyledTelIcon = styled(TelIcon)`
  width: 1.5625em;
  height: 1.5625em;
`;

const DescriptionText = styled.a`
  max-width: 25em;
  color: var(--RIU_Monochrome-600, #414152);
  text-align: center;
  font-family: 'Pretendard-Regular';
  line-height: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
`;

const StyledCopyIcon = styled(CopyIcon)`
  width: 1.25em;
  height: 1.25em;
  cursor: pointer;
`;

const FilterTitleWrapper = styled.div`
  margin: 1.875em 0 1.25em 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const ThemeNumber = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: 'Pretendard-SemiBold';
  font-size: 1.25em;
  line-height: 100%
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const ContentCardWrapper = styled.div`
  padding-bottom: 0.625em;
  box-sizing: border-box;
  height: 36.8em;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-content: flex-start;
  row-gap: 0.625em;
  flex-shrink: 0;
  align-self: stretch;
  flex-wrap: wrap;

  // 스크롤 설정
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
