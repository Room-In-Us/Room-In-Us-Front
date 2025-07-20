import { useEffect, useState } from 'react';
import styled from 'styled-components'
import { useRecoilValue } from 'recoil';
import { activeLevelState } from '../model/levelAtom.jsx';
import useDevice from "../../../shared/hooks/useDevice.js";
import ContentCard from "../../../shared/components/ContentCard.jsx";
import { levels } from '../model/levelData.js';
import { getLevelListAPI } from "../api/levelAPI.js";
import { getRegionAPI } from "../../../features/location/api/getRegionAPI";
import { getZoneAPI } from "../../../features/location/api/getZoneAPI";
import FilterImg from '../../../shared/assets/icons/genre/filter.svg';
import PeopleFilter from '../../../shared/components/filter/PeopleFilter';
import SortFilter from '../../../shared/components/filter/SortFilter';
import RegionFilter from '../../../shared/components/filter/RegionFilter';
import CustomPagination from '../../../shared/components/CustomPagination';
import BottomSheet from '../../../shared/components/BottomSheet';
import { sortOptions } from '../../../shared/components/filter/OptionList.js';

export default function LevelContentSection() {

  // 반응형 함수
  const { isMobile } = useDevice();

  // state 관리
  const activeLevel = useRecoilValue(activeLevelState);

  // 필터링 상태
  const [themeList, setThemeList] = useState([]);
  
  // 지역 필터 관련 상태
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("지역 전체");
  const [selectedZone, setSelectedZone] = useState(null);
  const [activeRegionId, setActiveRegionId] = useState(1);
  const [selectedZones, setSelectedZones] = useState([]);
  const [isAllZoneSelected, setIsAllZoneSelected] = useState(false);
  const [regionId, setRegionId] = useState();
  const [zoneIdList, setZoneIdList] = useState();

  // 정렬 필터 상태
  const [selectedSort, setSelectedSort] = useState("HIGH_SATISFACTION_LEVEL");

  // 인원수 필터 상태
  const [headCount, setHeadCount] = useState(2);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 4 : 16;

  // 바텀 시트 상태
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  // 모바일 필터 상태
  const [isFilterActive, setIsFilterActive] = useState(true);

  // 검색어 상태
  const [keyword,] = useState('');

  // 숙련도 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLevelListAPI(
          activeLevel, 
          headCount, 
          1, 
          1000, 
          selectedSort,
          keyword, 
          regionId, 
          zoneIdList
        );
        setThemeList(response.contents);
      } catch (error) {
        console.error('숙련도 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [activeLevel, headCount, selectedSort, keyword, regionId, zoneIdList]);

  // 인원수 필터링
  const handlePeopleFilterChange = (count) => {
    setHeadCount(count); 
  };

  // 선택된 숙련도 찾기
  const selectedLevel = levels.find((l) => l.level === activeLevel);
  
  // 지역 목록 가져오기
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getRegionAPI();
        if (response.contents) {
          setRegions(response.contents);
          
          // 초기 활성화 상태 설정: 서울
          const initialRegion = response.contents.find(region => region.regionId === 1);
          if (initialRegion) {
            setActiveRegionId(initialRegion.regionId);
            fetchZones(initialRegion.regionId);
          }
        }
      } catch (error) {
        console.error("지역 목록 불러오기 실패:", error);
      }
    };
    fetchRegions();
  }, []);
    
  // 선택된 지역의 구역 목록 가져오기
  const fetchZones = async (regionId) => {
    try {
        const response = await getZoneAPI(regionId);
        if (response.data) {
            const zonesWithRegion = response.data.map((zone) => ({
                ...zone,
                regionId,
            }));
            setZones(zonesWithRegion);
        }
    } catch (error) {
        console.error("구역 목록 불러오기 실패:", error);
    }
};
    
  // 전체 지역 버튼 클릭 핸들러
  const handleRegionAllClick = () => {
    setActiveRegionId(1);
    setSelectedRegion("지역 전체");
    setSelectedZones([]);
    fetchZones(1);
    setRegionId(null); 
    setZoneIdList(null);  
  };

  // 지역 버튼 클릭 핸들러 (구역 렌더링)
  const handleTabClick = (regionId) => {
    setActiveRegionId(regionId); 
    setSelectedZones([]);     
    setSelectedZone(null);  
    fetchZones(regionId);    
  };
    
  const handleTabAllClick = async (regionId, buttonText) => {
    setActiveRegionId(regionId);
    setIsAllZoneSelected(true);
    setSelectedZones([]);
    setZoneList([]);
    setSelectedRegion(buttonText);

    await getZoneAPI(regionId);
    setZoneIdList(null); 
    setRegionId(regionId);
  };
    
  // 지역 선택 핸들러
  const handleRegionSelect = (regionName) => {
    setSelectedRegion(regionName);
    setSelectedZone(null);
  };
    
  // 구역 선택 핸들러
  const handleZoneSelect = async (zoneName) => {
    setIsAllZoneSelected(false);
  
    setSelectedZones((prevZones) => {
      let updatedZones;
  
      if (prevZones.includes(zoneName)) {
        // 이미 선택된 경우 → 제거
        updatedZones = prevZones.filter((name) => name !== zoneName);
      } else {
        // 새로 선택
        updatedZones = [...prevZones, zoneName];
      }
  
      // 선택 텍스트 표시용
      if (updatedZones.length === 0) {
        setSelectedRegion("지역 선택");
      } else if (updatedZones.length === 1) {
        setSelectedRegion(updatedZones[0]);
      } else {
        setSelectedRegion(`${updatedZones[0]} 외 ${updatedZones.length - 1}개`);
      }
  
      // zoneIdList 생성
      const selectedIds = zones
        .filter((zone) => updatedZones.includes(zone.zoneName))
        .map((zone) => zone.zoneId);
  
      setZoneIdList(selectedIds);  
      setRegionId(activeRegionId);   
  
      return updatedZones;
    });
  };  

  // 바텀 시트 오픈 함수
  const handleOpenBottomSheet = () => {
    setBottomSheetOpen(true);
    setSelectedRegion(selectedRegion);
    setSelectedZone(selectedZone);
  };
  

  
  const adjustedTotalPages = Math.ceil(themeList.length / itemsPerPage);
  
    
  const handlePageChange = (page) => {
    if (page < 1 || page > adjustedTotalPages) return;
    setCurrentPage(page);
  };
  
  useEffect(() => {
    const adjustedTotalPages = Math.ceil(themeList.length / itemsPerPage);
    if (currentPage > adjustedTotalPages) {
      setCurrentPage(1);
    }
  }, [themeList, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeLevel]);
  
  // 필터 적용 함수 수정
  const handleApplyFilters = ({ people, sort, region, zones }) => {
    setHeadCount(people);
    setSelectedSort(sort);
    setIsFilterActive(true);

    if (region === "지역 전체") {
      setSelectedRegion("지역 전체");
      setSelectedZones([]);
      setZoneList([]);
    } 
    // "서울 전체" 선택 시 서울의 모든 구역 설정
    else if (region === "서울 전체") {
      setSelectedRegion("서울 전체");
      setZoneList(zones);
    } 
    // "경기/인천 전체" 선택 시 경기/인천의 모든 구역 설정
    else if (region === "경기/인천 전체") {
      setSelectedRegion("경기/인천 전체");
      setZoneList(zones);
    } 
    // 특정 구역 선택 시 해당 구역만 설정
    else if (zones && zones.length > 0) {
      setSelectedRegion(region);
      setSelectedZones(zones);
      setZoneList([]);
    } 
    // 초기화 상태
    else {
      setSelectedRegion(region);
      setSelectedZones([]);
      setZoneList([]);
    }
  };


  // 리셋 처리 함수
  const handleResetFilters = ({ people, sort, region }) => {
    setHeadCount(people);  
    setSelectedSort(sort);
    setSelectedRegion(region); 
    setSelectedZones([]); 
    setZoneList([]);  
    setIsAllZoneSelected(false); 
    setIsFilterActive(true);
  };

  const getMobileFilterText = () => {
    const peopleText = `${headCount}인`;
    const sortText =  sortOptions.find(option => option.value === selectedSort)?.label || selectedSort;

    let regionText = selectedRegion;
  
    if (selectedZones.length > 1) {
      const currentRegion = regions.find(r => r.regionId === activeRegionId)?.regionName || '';
      regionText = `${currentRegion} ${selectedZones.length}`;
    } else if (selectedZones.length === 1) {
      regionText = selectedZones[0];
    }
  
    return `${peopleText}, ${sortText}, ${regionText}`;
  };


  return (
    <Wrapper>
      <TopBar>
        <TextWrapper>
          <MainText>{selectedLevel ? selectedLevel.text : "기본"} 테마</MainText>
          <SubText>	&#40;{themeList.length}&#41;</SubText>
        </TextWrapper>

        { !isMobile && (
          <FilterWrapper>
            {/* 인원수 필터 */}
            <PeopleFilter onSelect={(count) => handlePeopleFilterChange(count)} selected={headCount} />

            {/* 만족도 필터 */}
            <SortFilter onSelect={(value) => setSelectedSort(value)} selected={selectedSort} />
    
            {/* 지역 필터 */}
            <RegionFilter 
              regions={regions}
              zones={zones}
              selectedRegion={selectedRegion}
              selectedZone={selectedZone}
              selectedZones={selectedZones}
              activeRegionId={activeRegionId}
              onTabClick={handleTabClick}
              onRegionSelect={handleRegionSelect}
              onRegionAllClick={handleRegionAllClick}
              onTabAllClick={handleTabAllClick}
              onZoneSelect={handleZoneSelect}
              isAllZoneSelected={setIsAllZoneSelected}
              setHeadCount={setHeadCount}
              setSelectedSort={setSelectedSort}
              setSelectedRegion={setSelectedRegion}
              regionId={regionId}
              zoneIdList={zoneIdList}
            />
          </FilterWrapper>
        )}

        { isMobile && (
          <Filter onClick={handleOpenBottomSheet}>
            <FilterIcon src={FilterImg} $isSelected={isFilterActive}/>
            <LocationFilterText $isSelected={isFilterActive}>{getMobileFilterText()}</LocationFilterText>
          </Filter>
        )}

      </TopBar>

      {/* 바텀 시트 추가 */}
      {isMobile && (
        <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        selectedRegion={selectedRegion}
        selectedZone={selectedZone}
        selectedPeople={headCount}
        selectedSort={selectedSort}
        regions={regions}  
        zones={zones}     
        zoneList={zoneList}
        activeRegionId={activeRegionId}
        selectedZones={selectedZones}
        onTabClick={handleTabClick}
        onRegionSelect={handleRegionSelect}
        onRegionAllClick={handleRegionAllClick}
        onTabAllClick={handleTabAllClick}
        onZoneSelect={handleZoneSelect}
        isAllZoneSelected={isAllZoneSelected}
        setHeadCount={setHeadCount}
        setSelectedSort={setSelectedSort}
        setSelectedRegion={setSelectedRegion}
      />
      )}

      {/* 콘텐츠 카드 영역 */}
      <>
        <ListWrapper>
          {themeList
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((items) => (
              <ContentCard
                key={items.id}
                data={{ ...items, price: items.price != null ? items.price * headCount : null }}
                headCount={headCount}
              />
            ))}
        </ListWrapper>

        {/* 페이지네이션 */}
        <CustomPagination
          currentPage={currentPage}
          totalPages={adjustedTotalPages}
          onPageChange={handlePageChange}
        />
      </>

    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 70rem;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    width: 43.3125rem;
    gap: 1.40625rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
    gap: 0.625rem;
    padding-bottom: 1.21875rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 1024px) {
    width: 100%;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const MainText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-ExtraBold;
  font-size: 1.375rem;

  @media (max-width: 1024px) {
    font-size: 1.03125rem;
  }
  @media (max-width: 768px) {
    font-family: Pretendard-Medium;
    font-size: 0.875rem;
  }
`;

const SubText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 1.375rem;

  @media (max-width: 1024px) {
    font-size: 1.03125rem;
  }
  @media (max-width: 768px) {
    font-family: Pretendard-Medium;
    font-size: 0.875rem;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

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

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    gap: 0.9375rem;
    justify-content: space-between;
  }
  @media (max-width: 768px) {
    gap: 0.625rem;
    justify-content: center;
  }
`;
