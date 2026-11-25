import { trackListFilter } from '../../../shared/utils/analytics';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components'
import { useRecoilValue } from 'recoil';
import { activeGenreState } from '../model/genreAtom';
import useDevice from "../../../shared/hooks/useDevice";
import ContentCard from "../../../shared/components/ContentCard";
import { getGenreListAPI } from "../../genre/api/genreAPI";
import { getRegionAPI, getZoneAPI } from "../../../features/location/api/locationAPI";
import FilterImg from '../../../shared/assets/icons/genre/filter.svg';
import PeopleFilter from '../../../shared/components/filter/PeopleFilter';
import SortFilter from '../../../shared/components/filter/SortFilter';
import RegionFilter from '../../../shared/components/filter/RegionFilter';
import { genres } from '../model/genreData';
import CustomPagination from '../../../shared/components/CustomPagination';
import BottomSheet from '../../../shared/components/BottomSheet';
import { sortOptions } from '../../../shared/components/filter/OptionList';
import NoDataImgLarge from '../../../shared/assets/images/common/noData/noDataImageLarge.png'

import type { RegionId, RegionResponse, ZoneId } from '../../location/api/types';
import type { ThemeResponse, ThemeSortOption } from '../../../shared/types/theme';
import type { FilterZone, RegionFilterValues } from '../../../shared/components/filter/filterTypes';

const LIST_NAME = '장르목록';

// 구역 조회는 적용된 필터 상태를 변경하지 않는다.
const loadZones = async (regionId: RegionId): Promise<FilterZone[]> => {
  const response = await getZoneAPI(regionId);
  return response.data.map((zone) => ({ ...zone, regionId }));
};

export default function GenreContentSection() {
  // 반응형 함수
  const { isMobile } = useDevice();

  // state 관리
  const activeGenre = useRecoilValue(activeGenreState);

  // 필터링 상태
  const [themeList, setThemeList] = useState<ThemeResponse[]>([]);

  // 지역 필터 관련 상태
  const [regions, setRegions] = useState<RegionResponse[]>([]);
  const [zones, setZones] = useState<FilterZone[]>([]);
  const [selectedRegion, setSelectedRegion] = useState("지역 전체");
  const [selectedZone, setSelectedZone] = useState<null>(null);
  const [activeRegionId, setActiveRegionId] = useState<RegionId>(1);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [isAllZoneSelected, setIsAllZoneSelected] = useState(false);
  const [regionId, setRegionId] = useState<RegionId | null>();
  const [zoneIdList, setZoneIdList] = useState<ZoneId[] | null>();

  // 정렬 필터 상태
  const [selectedSort, setSelectedSort] = useState<ThemeSortOption>("HIGH_SATISFACTION_LEVEL");

  // 인원수 필터 상태
  const [headCount, setHeadCount] = useState(2);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 4 : 16;
  const sectionTopRef = useRef<HTMLDivElement>(null);

  // 바텀 시트 상태
  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);

  // 모바일 필터 상태
  const [isFilterActive, setIsFilterActive] = useState(true);

  // 검색어 상태
  const [keyword,] = useState('');
  const filtersMounted = useRef(false);
  const filterLifetime = useRef(0);
  const regionSelectionVersion = useRef(0);
  const zoneRequestVersion = useRef(0);
  const viewedRegionId = useRef(activeRegionId);
  const availableZones = useRef({ regionId: activeRegionId, zones });
  const selectedZoneNames = useRef(selectedZones);

  useLayoutEffect(() => {
    filtersMounted.current = true;
    filterLifetime.current += 1;
    return () => {
      filtersMounted.current = false;
      filterLifetime.current += 1;
      zoneRequestVersion.current += 1;
      regionSelectionVersion.current += 1;
    };
  }, []);

  const viewRegion = useCallback((nextRegionId: RegionId) => {
    if (!filtersMounted.current) return;
    if (viewedRegionId.current !== nextRegionId) {
      viewedRegionId.current = nextRegionId;
      zoneRequestVersion.current += 1;
      availableZones.current = { regionId: nextRegionId, zones: [] };
      setZones([]);
    }
    setActiveRegionId(nextRegionId);
  }, []);

  // 구역 조회 결과는 현재 탭의 목록만 갱신하고 적용된 필터 ID는 바꾸지 않는다.
  const fetchZones = useCallback(async (requestedRegionId: RegionId) => {
    const lifetime = filterLifetime.current;
    if (!filtersMounted.current || viewedRegionId.current !== requestedRegionId) return;
    const generation = ++zoneRequestVersion.current;
    const isCurrent = () => filtersMounted.current && filterLifetime.current === lifetime
      && zoneRequestVersion.current === generation && viewedRegionId.current === requestedRegionId;
    try {
      const nextZones = await loadZones(requestedRegionId);
      if (!isCurrent()) return;
      availableZones.current = { regionId: requestedRegionId, zones: nextZones };
      setZones(nextZones);
    } catch (error) {
      if (isCurrent()) console.error("구역 목록 불러오기 실패:", error);
    }
  }, []);

  const requestGeneration = useRef(0);
  const requestContext = useRef({ activeGenre, headCount, selectedSort, keyword, regionId, zoneIdList });

  useLayoutEffect(() => {
    requestContext.current = { activeGenre, headCount, selectedSort, keyword, regionId, zoneIdList };
    requestGeneration.current += 1;
    return () => { requestGeneration.current += 1; };
  }, [activeGenre, headCount, selectedSort, keyword, regionId, zoneIdList]);

  // 장르 목록 조회
  useEffect(() => {
    let active = true;
    const generation = ++requestGeneration.current;
    const isCurrent = () => active && requestGeneration.current === generation
      && requestContext.current.activeGenre === activeGenre && requestContext.current.headCount === headCount
      && requestContext.current.selectedSort === selectedSort && requestContext.current.keyword === keyword
      && requestContext.current.regionId === regionId && requestContext.current.zoneIdList === zoneIdList;
    const fetchData = async () => {
      try {
        const response = await getGenreListAPI(
          activeGenre, 
          headCount, 
          1, 
          1000, 
          selectedSort, 
          keyword, 
          regionId, 
          zoneIdList
        );
        if (!isCurrent()) return;
        setThemeList(response.contents);
      } catch (error) {
        if (!isCurrent()) return;
        console.error('장르 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [activeGenre,headCount, selectedSort, keyword, regionId, zoneIdList]);

  // 인원수 필터링
  const handlePeopleFilterChange = (count: number) => {
    if (count !== headCount) trackListFilter(LIST_NAME, 'price_basis', count);
    setHeadCount(count); 
  };
  
  // 선택된 장르 찾기
  const selectedGenre = genres.find((g) => g.genre === activeGenre);

  // 지역 목록이 늦게 도착해도 사용자가 고른 탭을 초기 서울 탭으로 되돌리지 않는다.
  useEffect(() => {
    let active = true;
    const lifetime = filterLifetime.current;
    const initialSelection = regionSelectionVersion.current;
    const isCurrent = () => active && filtersMounted.current && filterLifetime.current === lifetime;
    const fetchRegions = async () => {
      try {
        const response = await getRegionAPI();
        if (!isCurrent()) return;
        if (response.contents) {
          setRegions(response.contents);

          const initialRegion = response.contents.find(region => region.regionId === 1);
          if (initialRegion && regionSelectionVersion.current === initialSelection && viewedRegionId.current === 1) {
            viewRegion(initialRegion.regionId);
            void fetchZones(initialRegion.regionId);
          }
        }
      } catch (error) {
        if (isCurrent()) console.error("지역 목록 불러오기 실패:", error);
      }
    };
    fetchRegions();
    return () => { active = false; };
  }, [fetchZones, viewRegion]);

  // 전체 지역 버튼 클릭 핸들러
  const handleRegionAllClick = () => {
    if (!filtersMounted.current) return;
    regionSelectionVersion.current += 1;
    viewRegion(1);
    if (selectedRegion !== '지역 전체') trackListFilter(LIST_NAME, 'region', '지역 전체');
    setSelectedRegion("지역 전체");
    setIsAllZoneSelected(false);
    selectedZoneNames.current = [];
    setSelectedZones([]);
    void fetchZones(1);
    setRegionId(null);
    setZoneIdList(null);
  };

  // 지역 탭은 표시할 구역만 바꾸고 적용된 필터는 선택할 때 확정한다.
  const handleTabClick = (regionId: RegionId) => {
    if (!filtersMounted.current) return;
    regionSelectionVersion.current += 1;
    viewRegion(regionId);
    selectedZoneNames.current = [];
    setSelectedZones([]);
    setSelectedZone(null);
    void fetchZones(regionId);
  };

  const handleTabAllClick = async (regionId: RegionId, buttonText: string) => {
    if (!filtersMounted.current) return;
    regionSelectionVersion.current += 1;
    viewRegion(regionId);
    setIsAllZoneSelected(true);
    selectedZoneNames.current = [];
    setSelectedZones([]);
    if (buttonText !== selectedRegion) trackListFilter(LIST_NAME, 'region', buttonText);
    setSelectedRegion(buttonText);
    // 조회 완료를 기다리지 않고 사용자의 선택을 확정한다.
    setZoneIdList(null);
    setRegionId(regionId);
    await fetchZones(regionId);
  };

  // 지역 선택 핸들러
  const handleRegionSelect = (regionName: string) => {
    if (!filtersMounted.current) return;
    regionSelectionVersion.current += 1;
    setSelectedRegion(regionName);
    setSelectedZone(null);
  };

  // 로딩 중 이전 탭의 버튼이나 오래된 callback으로 다른 지역의 ID를 조합하지 않는다.
  const handleZoneSelect = async (zoneName: string) => {
    const currentZones = availableZones.current;
    if (!filtersMounted.current || viewedRegionId.current !== activeRegionId
      || currentZones.regionId !== activeRegionId || !currentZones.zones.some(zone => zone.zoneName === zoneName)) return;
    regionSelectionVersion.current += 1;
    setIsAllZoneSelected(false);

    const previous = selectedZoneNames.current;
    const updatedZones = previous.includes(zoneName)
      ? previous.filter(name => name !== zoneName)
      : [...previous, zoneName];
    trackListFilter(LIST_NAME, 'region', updatedZones.join(',') || '지역 전체');
    selectedZoneNames.current = updatedZones;
    setSelectedZones(updatedZones);

    if (updatedZones.length === 0) setSelectedRegion("지역 전체");
    else if (updatedZones.length === 1) setSelectedRegion(updatedZones[0]);
    else setSelectedRegion(`${updatedZones[0]} 외 ${updatedZones.length - 1}개`);

    const selectedIds = currentZones.zones
      .filter(zone => updatedZones.includes(zone.zoneName))
      .map(zone => zone.zoneId);
    setZoneIdList(updatedZones.length === 0 ? null : selectedIds);
    setRegionId(updatedZones.length === 0 ? null : activeRegionId);
  };

  // 바텀 시트 오픈 함수
  const handleOpenBottomSheet = () => {
    setBottomSheetOpen(true);
    setSelectedRegion(selectedRegion);
    setSelectedZone(selectedZone);
  };



  const adjustedTotalPages = Math.ceil(themeList.length / itemsPerPage);

  
  const handlePageChange = (page: number) => {
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
  }, [activeGenre]);

  useEffect(() => {
    setCurrentPage(1);
  }, [headCount, selectedSort, regionId, zoneIdList, keyword]);
  
  // 모바일의 임시 선택을 적용 버튼에서 한 번에 확정한다.
  const handleSortChange = (sort: ThemeSortOption) => {
    if (sort !== selectedSort) {
      trackListFilter(LIST_NAME, 'sort', sortOptions.find((option) => option.value === sort)?.label ?? sort);
    }
    setSelectedSort(sort);
  };

  const handleApplyFilters = ({ people, sort, region, regionSelection }: RegionFilterValues) => {
    if (!filtersMounted.current) return;
    regionSelectionVersion.current += 1;
    zoneRequestVersion.current += 1;
    viewedRegionId.current = regionSelection.activeRegionId;
    availableZones.current = { regionId: regionSelection.activeRegionId, zones: regionSelection.zones };
    const nextRegion = regionSelection.selectedRegion ?? region;
    if (nextRegion !== selectedRegion || regionSelection.selectedZones.join() !== selectedZoneNames.current.join()) {
      trackListFilter(LIST_NAME, 'region', regionSelection.selectedZones.join(',') || nextRegion);
    }
    selectedZoneNames.current = regionSelection.selectedZones;
    handlePeopleFilterChange(people);
    handleSortChange(sort);
    setIsFilterActive(true);
    setActiveRegionId(regionSelection.activeRegionId);
    setZones(regionSelection.zones);
    setSelectedRegion(regionSelection.selectedRegion ?? region);
    setSelectedZones(regionSelection.selectedZones);
    setSelectedZone(null);
    setIsAllZoneSelected(regionSelection.isAllZoneSelected);
    setRegionId(region === "지역 전체" ? null : regionSelection.activeRegionId);
    setZoneIdList(regionSelection.selectedZones.length === 0 ? null : regionSelection.zones
      .filter((zone) => regionSelection.selectedZones.includes(zone.zoneName))
      .map((zone) => zone.zoneId));
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
    <Wrapper ref={sectionTopRef}>
      <TopBar>
        <TextWrapper>
          <MainText>{selectedGenre ? selectedGenre.text : "기본"} 테마</MainText>
          <SubText>	&#40;{themeList.length}&#41;</SubText>
        </TextWrapper>

        { !isMobile && (
          <FilterWrapper>
            {/* 인원수 필터 */}
            <PeopleFilter onSelect={(count) => handlePeopleFilterChange(count)} selected={headCount} />

            {/* 만족도 필터 */}
            <SortFilter onSelect={handleSortChange} selected={selectedSort} />
    
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
              isAllZoneSelected={isAllZoneSelected}
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
          selectedRegion={selectedRegion}
          selectedPeople={headCount}
          selectedSort={selectedSort}
          regions={regions}
          zones={zones}
          loadZones={loadZones}
          activeRegionId={activeRegionId}
          selectedZones={selectedZones}
          isAllZoneSelected={isAllZoneSelected}
          isLocationPage={false}
        />
      )}

      {/* 콘텐츠 카드 영역 */}
      {themeList.length === 0 ? (
        <NoDataWrapper>
          <img src={NoDataImgLarge} alt="데이터 없음" />
          <NonDataTextWrapper>
            <NonDataText>해당하는 테마가 없습니다</NonDataText>
          </NonDataTextWrapper>
        </NoDataWrapper>
      ) : (
        <>
          <ListWrapper>
            {themeList
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((items, index) => (
                <ContentCard
                  listName="장르목록"
                  listPosition={(currentPage - 1) * itemsPerPage + index + 1}
                  key={items.themeId}
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
            scrollTargetRef={sectionTopRef}
          />
        </>
      )}
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

const FilterIcon = styled.img<{ $isSelected: boolean }>`
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

const LocationFilterText = styled.div<{ $isSelected: boolean }>`
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

const NoDataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  gap: 1.25em;

  img {
    width: 25rem;
    
    @media (max-width: 768px) {
      width: 13.75rem;
    }
  }
`;

const NonDataTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

const NonDataText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-ExtraBold;
  font-size: 1.125rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;
