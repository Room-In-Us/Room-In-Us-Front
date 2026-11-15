import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import RegionFilter from './filter/RegionFilter';
import PeopleFilter from './filter/PeopleFilter';
import SortFilter from './filter/SortFilter';
import useDevice from '../../shared/hooks/useDevice';
import ResetIcon from '../assets/icons/common/filterIcon/reset.svg';
import type { RegionId } from '../../features/location/api/types';
import type { ThemeSortOption } from '../types/theme';
import type { FilterValues, FilterZone, RegionFilterDraft, RegionFilterValues, RegionSelectionProps } from './filter/filterTypes';

type RegionSheetProps = Pick<RegionSelectionProps,
  'regions' | 'zones' | 'selectedRegion' | 'selectedZones' | 'activeRegionId' | 'isAllZoneSelected'
> & {
  loadZones: (regionId: RegionId) => Promise<FilterZone[]>;
};

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedPeople: number;
  selectedSort: ThemeSortOption;
} & (
  | ({ isLocationPage?: false; onApply: (values: RegionFilterValues) => void } & RegionSheetProps)
  | {
    isLocationPage: true;
    onApply: (values: FilterValues) => void;
    onReset: (values: FilterValues) => void;
    setHeadCount: (value: number) => void;
    setSelectedSort: (value: ThemeSortOption) => void;
  }
);

function createRegionDraft(props: BottomSheetProps): RegionFilterDraft {
  if (props.isLocationPage) {
    return { activeRegionId: 1, zones: [], selectedRegion: '지역 전체', selectedZones: [], isAllZoneSelected: false };
  }
  return {
    activeRegionId: props.activeRegionId,
    zones: [...props.zones],
    selectedRegion: props.selectedRegion,
    selectedZones: [...props.selectedZones],
    isAllZoneSelected: props.isAllZoneSelected,
  };
}

const regionAllLabel = (regionId: RegionId) => regionId === 1 ? '서울 전체' : '경기/인천 전체';

export default function BottomSheet(props: BottomSheetProps) {
  const { isOpen, onClose, selectedPeople, selectedSort, isLocationPage } = props;
  const { isMobile } = useDevice();
  const [activeTab, setActiveTab] = useState('people');
  const [draftPeople, setDraftPeople] = useState(selectedPeople);
  const [draftSort, setDraftSort] = useState(selectedSort);
  const [draftRegion, setDraftRegion] = useState(() => createRegionDraft(props));
  const wasOpen = useRef(false);
  const regionRequest = useRef(0);

  // 적용된 값은 열 때만 복사한다. 부모의 재렌더로 작성 중인 선택을 덮어쓰지 않는다.
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      setDraftPeople(selectedPeople);
      setDraftSort(selectedSort);
      setDraftRegion(createRegionDraft(props));
    }
    if (wasOpen.current !== isOpen) regionRequest.current += 1;
    wasOpen.current = isOpen;
  }, [isOpen, selectedPeople, selectedSort, props]);

  useEffect(() => () => { regionRequest.current += 1; }, []);

  const tabs = [
    { id: 'people', label: '가격' },
    { id: 'sort', label: '정렬' },
    ...(isLocationPage ? [] : [{ id: 'region', label: '지역' }]),
  ];

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflowY = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    }
    return () => {
      document.body.style.overflowY = 'auto';
      document.body.style.overflowX = 'hidden';
    };
  }, [isOpen, isMobile]);

  const loadDraftZones = async (regionId: RegionId) => {
    if (props.isLocationPage) return;
    const request = ++regionRequest.current;
    try {
      const zones = await props.loadZones(regionId);
      if (request !== regionRequest.current) return;
      setDraftRegion(previous => previous.activeRegionId === regionId ? { ...previous, zones } : previous);
    } catch (error) {
      if (request === regionRequest.current) console.error('구역 목록 불러오기 실패:', error);
    }
  };

  const handleRegionAllClick = () => {
    setDraftRegion(previous => ({
      ...previous, activeRegionId: 1, selectedRegion: '지역 전체', selectedZones: [],
      isAllZoneSelected: false, zones: previous.activeRegionId === 1 ? previous.zones : [],
    }));
    void loadDraftZones(1);
  };

  const handleTabClick = (regionId: RegionId) => {
    setDraftRegion(previous => ({
      ...previous, activeRegionId: regionId, selectedRegion: regionAllLabel(regionId),
      selectedZones: [], isAllZoneSelected: true, zones: [],
    }));
    void loadDraftZones(regionId);
  };

  const handleTabAllClick = (regionId: RegionId, label: string) => {
    setDraftRegion(previous => ({
      ...previous, activeRegionId: regionId, selectedRegion: label,
      selectedZones: [], isAllZoneSelected: true,
    }));
  };

  const handleZoneSelect = (zoneName: string) => {
    setDraftRegion(previous => {
      const selectedZones = previous.selectedZones.includes(zoneName)
        ? previous.selectedZones.filter(name => name !== zoneName)
        : [...previous.selectedZones, zoneName];
      const selectedRegion = selectedZones.length === 0 ? '지역 전체'
        : selectedZones.length === 1 ? selectedZones[0]
        : selectedZones[0] + ' 외 ' + (selectedZones.length - 1) + '개';
      return { ...previous, selectedZones, selectedRegion, isAllZoneSelected: false };
    });
  };

  if (!isOpen) return null;

  const handleReset = () => {
    setDraftPeople(2);
    setDraftSort('HIGH_SATISFACTION_LEVEL');
    if (props.isLocationPage) {
      // 지역 필터가 없는 매장 화면의 기존 초기화 callback은 유지한다.
      props.setHeadCount(2);
      props.setSelectedSort('HIGH_SATISFACTION_LEVEL');
      props.onReset({ people: 2, sort: 'HIGH_SATISFACTION_LEVEL', region: '지역 전체', zones: [] });
    } else {
      handleRegionAllClick();
    }
  };

  const applyFilters = () => {
    if (props.isLocationPage) {
      props.onApply({ people: draftPeople, sort: draftSort, region: '지역 전체', zones: [] });
    } else {
      props.onApply({
        people: draftPeople, sort: draftSort,
        region: draftRegion.selectedZones.length > 0 ? '지역 선택됨' : draftRegion.selectedRegion ?? '지역 전체',
        zones: [...draftRegion.selectedZones],
        regionSelection: { ...draftRegion, selectedZones: [...draftRegion.selectedZones], zones: [...draftRegion.zones] },
      });
    }
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Container>
          <TopWrapper>
            <SheetBar />
            <TabContainer>
              <FilterWrapper>
                {tabs.map(({ id, label }) => (
                  <TabButton key={id} isActive={activeTab === id} onClick={() => setActiveTab(id)}>
                    {label}
                  </TabButton>
                ))}
              </FilterWrapper>
              <ResetButton src={ResetIcon} onClick={handleReset} />
            </TabContainer>
          </TopWrapper>

          <Content>
            {activeTab === 'people' &&
              <PeopleFilter
                key={selectedPeople}
                onSelect={setDraftPeople}
                isMobile={isMobile}
                selected={draftPeople}
              />
            }
            {activeTab === 'sort' &&
              <SortFilter
                key={selectedSort}
                onSelect={setDraftSort}
                isMobile={isMobile}
                selected={draftSort}
              />
            }
            {activeTab === 'region' && !props.isLocationPage &&
              <RegionFilter
                key={draftRegion.selectedRegion}
                regions={props.regions}
                zones={draftRegion.zones}
                selectedRegion={draftRegion.selectedRegion}
                selectedZones={draftRegion.selectedZones}
                activeRegionId={draftRegion.activeRegionId}
                onTabClick={handleTabClick}
                onRegionSelect={(selectedRegion) => setDraftRegion(previous => ({ ...previous, selectedRegion }))}
                onRegionAllClick={handleRegionAllClick}
                onTabAllClick={handleTabAllClick}
                onZoneSelect={handleZoneSelect}
                isAllZoneSelected={draftRegion.isAllZoneSelected}
              />
            }
          </Content>
        </Container>

        <ApplyButton onClick={applyFilters}>필터 적용하기</ApplyButton>
      </Sheet>
    </Overlay>
  );
}


const Overlay = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 2000;
`;

const Sheet = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 70%;
  background: var(--RIU_Monochrome-50, #D6D6DF);
  border-radius: 0.625rem 0.625rem 0 0;
  overflow: hidden;
  animation: slideUp 0.3s ease-in-out;
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;

const TopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const SheetBar = styled.div`
  width: 4.75rem;
  height: 0.3125rem;
  border-radius: 0.625rem;
  background: var(--RIU_Primary-80, #8DA3FF);
  margin: 0.375rem 0.75rem;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 1.25rem;
  width: 100%;
  height: 3.125rem;
  box-sizing: border-box;
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

const TabButton = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 0rem;
  font-size: 0.875rem;
  color: ${({ isActive }) => (isActive ? "#718FF2" : "#A1A4B5")};
  font-family: "Pretendard-Bold";
  border-bottom: ${({ isActive }) => (isActive ? "3px solid #718FF2" : "3px solid #E7E8ED")};
  cursor: pointer;
  width: 3.125rem;
  height: 0.875rem;
  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  overflow-y: auto;
`;

const ResetButton = styled.img`
  display: flex;
  width: 1.171875rem;
  height: 1.171875rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ApplyButton = styled.div`
  display: flex;
  width: 100%;
  height: 3.125rem;
  padding: 0.625rem 1.25rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  background: var(--RIU_Primary-100, #718FF2);

  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: Pretendard-Bold;
`;
