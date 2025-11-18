import { useState, useEffect } from "react";
import styled from "styled-components";
import LeftArrowIcon from "../../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import LocationIcon from "../../../shared/assets/icons/location/storeLocationIcon.svg?react";
import LinkIcon from "../../../shared/assets/icons/location/storeLinkIcon.svg?react";
import TelIcon from "../../../shared/assets/icons/location/storeTelIcon.svg?react";
import CopyIcon from "../../../shared/assets/icons/location/copyIcon.svg?react";
import FilterImg from '../../../shared/assets/icons/genre/filter.svg';
import { useRecoilState } from "recoil";
import { stationCardVisible, storeCardVisible, locationStoreId } from "../../../features/location/model/locationAtom";
import LocationPeopleFilter from "./filter/LocationPeopleFilter";
import LocationSortFilter from "./filter/LocationSortFilter";
import LocationContentCard from "./LocationContentCard";
import { getLocationListAPI, getLocationStoreInfoAPI } from "../api/locationAPI";
import BottomSheet from "../../../shared/components/BottomSheet";
import { sortOptions } from '../../../shared/components/filter/OptionList.js';
import useDevice from "../../../shared/hooks/useDevice";

function StoreCard() {
  // 상태 관리
  const [headCount, setHeadCount] = useState(2); // 인원 필터 상태
  const [selectedSort, setSelectedSort] = useState("HIGH_SATISFACTION_LEVEL"); // 정렬 필터 상태
  const [themeList, setThemeList] = useState([]);
  const [, setIsStationCardVisible] = useRecoilState(stationCardVisible);
  const [, setIsStoreCardVisible] = useRecoilState(storeCardVisible);
  const [storeId,] = useRecoilState(locationStoreId);
  const [storeInfo, setStoreInfo] = useState([]);
  // 복사 툴팁 상태 관리
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const [showUrlTooltip, setShowUrlTooltip] = useState(false);
  const [showContactTooltip, setShowContactTooltip] = useState(false);

  // 지역 필터 관련 상태
  // const [regions, setRegions] = useState([]);
  // const [zones, setZones] = useState([]);
  // const [zoneList, setZoneList] = useState([]);
  // const [selectedRegion, setSelectedRegion] = useState("지역 전체");
  // const [selectedZone, setSelectedZone] = useState(null);
  // const [activeRegionId, setActiveRegionId] = useState(1);
  // const [selectedZones, setSelectedZones] = useState([]);
  // const [isAllZoneSelected, setIsAllZoneSelected] = useState(false);
  // const [regionId, setRegionId] = useState();
  // const [zoneIdList, setZoneIdList] = useState();

  // 바텀 시트 상태
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  // 모바일 필터 상태
  const [isFilterActive, setIsFilterActive] = useState(true);
  
  // 반응형 함수
  const { isMobile } = useDevice();

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

  // 상세 정보 복사 기능
  const showTooltipWithTimer = (setFn) => {
    setFn(true);
    setTimeout(() => setFn(false), 1500);
  };

  const handleAddressCopy = (data) => {
    navigator.clipboard.writeText(data)
      .then(() => {
        showTooltipWithTimer(setShowAddressTooltip);
      })
      .catch((err) => {
        console.error('주소 복사 실패:', err);
      });
  };

  const handleUrlCopy = (data) => {
    navigator.clipboard.writeText(data)
      .then(() => {
        showTooltipWithTimer(setShowUrlTooltip);
      })
      .catch((err) => {
        console.error('URL 복사 실패:', err);
      });
  };

  const handleContactCopy = (data) => {
    navigator.clipboard.writeText(data)
      .then(() => {
        showTooltipWithTimer(setShowContactTooltip);
      })
      .catch((err) => {
        console.error('연락처 복사 실패:', err);
      });
  };

  // 필터 적용 함수 수정
  const handleApplyFilters = ({ people, sort }) => {
    setHeadCount(people);
    setSelectedSort(sort);
    setIsFilterActive(true);

    // if (region === "지역 전체") {
    //   setSelectedRegion("지역 전체");
    //   setSelectedZones([]);
    //   setZoneList([]);
    // } 
    // // "서울 전체" 선택 시 서울의 모든 구역 설정
    // else if (region === "서울 전체") {
    //   setSelectedRegion("서울 전체");
    //   setZoneList(zones);
    // } 
    // // "경기/인천 전체" 선택 시 경기/인천의 모든 구역 설정
    // else if (region === "경기/인천 전체") {
    //   setSelectedRegion("경기/인천 전체");
    //   setZoneList(zones);
    // } 
    // // 특정 구역 선택 시 해당 구역만 설정
    // else if (zones && zones.length > 0) {
    //   setSelectedRegion(region);
    //   setSelectedZones(zones);
    //   setZoneList([]);
    // } 
    // // 초기화 상태
    // else {
    //   setSelectedRegion(region);
    //   setSelectedZones([]);
    //   setZoneList([]);
    // }
  };

  // 리셋 처리 함수
  const handleResetFilters = ({ people, sort }) => {
    setHeadCount(people);  
    setSelectedSort(sort);
    // setSelectedRegion(region); 
    // setSelectedZones([]); 
    // setZoneList([]);
    // setIsAllZoneSelected(false); 
    setIsFilterActive(true);
  };

  // 전체 지역 버튼 클릭 핸들러
  // const handleRegionAllClick = () => {
  //   setActiveRegionId(1);
  //   setSelectedRegion("지역 전체");
  //   setSelectedZones([]);
  //   // fetchZones(1);
  //   setRegionId(null); 
  //   setZoneIdList(null);  
  // };

  // 지역 버튼 클릭 핸들러 (구역 렌더링)
    // const handleTabClick = (regionId) => {
    //   setActiveRegionId(regionId); 
    //   setSelectedZones([]);     
    //   setSelectedZone(null);  
    //   // fetchZones(regionId);    
    // };
      
    // const handleTabAllClick = async (regionId, buttonText) => {
    //   setActiveRegionId(regionId);
    //   setIsAllZoneSelected(true);
    //   setSelectedZones([]);
    //   setZoneList([]);
    //   setSelectedRegion(buttonText);
  
    //   // await getZoneAPI(regionId);
    //   setZoneIdList(null); 
    //   setRegionId(regionId);
    // };
      
    // // 지역 선택 핸들러
    // const handleRegionSelect = (regionName) => {
    //   setSelectedRegion(regionName);
    //   setSelectedZone(null);
    // };
      
    // // 구역 선택 핸들러
    // const handleZoneSelect = async (zoneName) => {
    //   setIsAllZoneSelected(false);
    
    //   setSelectedZones((prevZones) => {
    //     let updatedZones;
    
    //     if (prevZones.includes(zoneName)) {
    //       // 이미 선택된 경우 → 제거
    //       updatedZones = prevZones.filter((name) => name !== zoneName);
    //     } else {
    //       // 새로 선택
    //       updatedZones = [...prevZones, zoneName];
    //     }
    
    //     // 선택 텍스트 표시용
    //     if (updatedZones.length === 0) {
    //       setSelectedRegion("지역 선택");
    //     } else if (updatedZones.length === 1) {
    //       setSelectedRegion(updatedZones[0]);
    //     } else {
    //       setSelectedRegion(`${updatedZones[0]} 외 ${updatedZones.length - 1}개`);
    //     }
    
    //     // zoneIdList 생성
    //     const selectedIds = zones
    //       .filter((zone) => updatedZones.includes(zone.zoneName))
    //       .map((zone) => zone.zoneId);
    
    //     setZoneIdList(selectedIds);  
    //     setRegionId(activeRegionId);   
    
    //     return updatedZones;
    //   });
    // }; 

  // 바텀 시트 오픈 함수
  const handleOpenBottomSheet = () => {
    setBottomSheetOpen(true);
    // setSelectedRegion(selectedRegion);
    // setSelectedZone(selectedZone);
  };

  const getMobileFilterText = () => {
    const peopleText = `${headCount}인`;
    const sortText =  sortOptions.find(option => option.value === selectedSort)?.label || selectedSort;

    // let regionText = selectedRegion;
  
    // if (selectedZones.length > 1) {
    //   const currentRegion = regions.find(r => r.regionId === activeRegionId)?.regionName || '';
    //   regionText = `${currentRegion} ${selectedZones.length}`;
    // } else if (selectedZones.length === 1) {
    //   regionText = selectedZones[0];
    // }
  
    return `${peopleText}, ${sortText}`;
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
      </TitleWrapper>
      
      {/* 필터 영역 */}
      <FilterTitleWrapper>
        <ThemeNumber>
          테마 목록 &#40;{themeList.length}&#41;
        </ThemeNumber>
        {isMobile ? (
          <>
            <Filter onClick={handleOpenBottomSheet}>
              <FilterIcon src={FilterImg} $isSelected={isFilterActive}/>
              <LocationFilterText $isSelected={isFilterActive}>{getMobileFilterText()}</LocationFilterText>
            </Filter>
            <BottomSheet
              isOpen={isBottomSheetOpen}
              onClose={() => setBottomSheetOpen(false)}
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
              // selectedRegion={selectedRegion}
              // selectedZone={selectedZone}
              selectedPeople={headCount}
              selectedSort={selectedSort}
              // regions={regions}  
              // zones={zones}     
              // zoneList={zoneList}
              // activeRegionId={activeRegionId}
              // selectedZones={selectedZones}
              // onTabClick={handleTabClick}
              // onRegionSelect={handleRegionSelect}
              // onRegionAllClick={handleRegionAllClick}
              // onTabAllClick={handleTabAllClick}
              // onZoneSelect={handleZoneSelect}
              // isAllZoneSelected={isAllZoneSelected}
              setHeadCount={setHeadCount}
              setSelectedSort={setSelectedSort}
              // setSelectedRegion={setSelectedRegion}
              isLocationPage={true}
            />
          </>
        ) : (
          <FilterWrapper>
            {/* 인원 필터 */}
            <LocationPeopleFilter onSelect={(count) => handlePeopleFilterChange(count)} selected={headCount} />
            {/* 정렬 필터 */}
            <LocationSortFilter onSelect={(value) => setSelectedSort(value)} selected={selectedSort} />
          </FilterWrapper>
        )}
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
    margin-bottom: 1.875em;
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

  @media (max-width: 768px) {
    width: 100%;
  }
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const DescriptionList = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;

  @media (max-width: 768px) {
    max-width: 100%;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
    flex: 1;
    text-align: start;
  }
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

  @media (max-width: 768px) {
    height: auto;
    flex: 1;
  }
`;

// 모바일
const Filter = styled.div`
  display: flex;
  padding: 0.625rem 1.25rem;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 1.25rem;
  border: 1px solid var(--RIU_Primary-40, #B9C3FF);
  background: var(--RIU_Monochrome-10, #F9F9FB);
  cursor: pointer;

  @media (max-width: 1024px) {
    padding: 0.46875rem 0.9375rem;
    align-items: center;
    gap: 0.46875rem;
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    padding: 0.375rem 0.875rem;
    align-items: center;
    gap: 0.375rem;
  }
`;

const FilterIcon = styled.img`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;

  svg{
    background: ${({ $isSelected }) => ($isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)")};
  }

  filter: ${({ $isSelected }) =>
    $isSelected
      ? "invert(32%) sepia(79%) saturate(722%) hue-rotate(203deg) brightness(96%) contrast(97%)"
      : "none"};
`;

const LocationFilterText = styled.div`
  font-family: ${({ $isSelected }) => $isSelected ? 'Pretendard-Bold' : 'Pretendard-Medium'};
  font-size: 0.875rem;
  color: ${({ $isSelected }) => $isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)"};

  @media (max-width: 768px) {
    font-size: 0.75rem;
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
