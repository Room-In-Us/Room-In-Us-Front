import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import RegionFilter from "./filter/RegionFilter";
import PeopleFilter from "./filter/PeopleFilter";
import SortFilter from "./filter/SortFilter";
import useDevice from "../../shared/hooks/useDevice";
import ResetIcon from '../assets/icons/common/filterIcon/reset.svg';

const tabs = [
  { id: "people", label: "가격" },
  { id: "sort", label: "정렬" },
  { id: "region", label: "지역" },
];

export default function BottomSheet({
  isOpen,
  onClose,
  onApply,
  onReset,
  selectedRegion,
  selectedZone,
  selectedPeople,
  selectedSort,
  regions,
  zones,   
  zoneList,
  activeRegionId,
  selectedZones,
  onTabClick,
  onRegionSelect,
  onRegionAllClick,
  onTabAllClick,
  onZoneSelect,
  isAllZoneSelected,
  setHeadCount,
  setSelectedSort,
  setSelectedRegion,
  }) {
  const { isMobile } = useDevice();
  const [activeTab, setActiveTab] = useState("people");

  const peopleRef = useRef();
  const sortRef = useRef();
  const regionRef = useRef();

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflowY = "hidden";  
      document.body.style.overflowX = "hidden"; 
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";  
    }
  
    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    };
  }, [isOpen, isMobile]);

  if (!isOpen) return null;
  
  const handleReset = () => {

    setHeadCount(2);
    setSelectedSort("HIGH_SATISFACTION_LEVEL");
    setSelectedRegion("지역 전체");

    if (peopleRef.current) {
      peopleRef.current.reset();
      peopleRef.current.currentValue = 2;
    }
  
    if (sortRef.current) {
      sortRef.current.reset();
      sortRef.current.currentValue = "HIGH_SATISFACTION_LEVEL";
    }
  
    onReset({
      people: 2,
      sort: "HIGH_SATISFACTION_LEVEL",
      region: "지역 전체",
      zones: []
    });
  };

  // 필터 적용 함수
  const applyFilters = () => {
    let regionValue = "지역 전체";
    let zoneValues = [];

    // 서울 전체 또는 경기/인천 전체를 선택한 경우
    if (activeRegionId === 1 && selectedRegion === "서울 전체") {
      regionValue = "서울 전체";
      zoneValues = zoneList
        .filter((zone) => zone?.zoneName) 
        .map((zone) => zone.zoneName); 
    } else if (activeRegionId === 2 && selectedRegion === "경기/인천 전체") {
      regionValue = "경기/인천 전체";
      zoneValues = zoneList
        .filter((zone) => zone?.zoneName) 
        .map((zone) => zone.zoneName); 
    } 
    // 특정 구역이 선택된 경우
    else if (selectedZones.length > 0) {
      regionValue = "지역 선택됨";
      zoneValues = selectedZones;
    } 
    // 지역 전체를 선택한 경우
    else {
      regionValue = "지역 전체";
      zoneValues = [];
    }

    onApply({
      people: peopleRef.current?.getValue?.() ?? selectedPeople,
      sort: sortRef.current?.getValue?.() ?? selectedSort,
      region: regionValue,
      zones: zoneValues
    });

    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Sheet onClick={(e) => e.stopPropagation()}>
        <Container>

          <TopWrapper >
            <SheetBar />
            <TabContainer>
              <FilterWrapper>
                {tabs.map(({ id, label }) => (
                  <TabButton
                    key={id}
                    isActive={activeTab === id}
                    onClick={() => setActiveTab(id)}
                  >
                    {label}
                  </TabButton>
                ))}
              </FilterWrapper>
              <ResetButton src={ResetIcon} onClick={handleReset} />
            </TabContainer>
          </TopWrapper>

          <Content>
            {activeTab === "people" && 
              <PeopleFilter   
              key={selectedPeople}
              ref={peopleRef} 
              onSelect={(val) => (peopleRef.currentValue = val)} 
              isMobile={isMobile} selected={selectedPeople} 
              />
            }

            {activeTab === "sort" && 
              <SortFilter key={selectedSort} 
                ref={sortRef} 
                onSelect={(val) => (sortRef.currentValue = val)} 
                isMobile={isMobile} 
                selected={selectedSort} 
              />
            }

            {activeTab === "region" && 
              <RegionFilter 
                key={selectedRegion}
                ref={regionRef}
                isOpen={isOpen}
                onClose={onClose}
                onApply={onApply}
                onReset={onReset}
                selectedRegion={selectedRegion}
                selectedZone={selectedZone}
                selectedPeople={selectedPeople}
                selectedSort={selectedSort}
                regions={regions}  
                zones={zones}     
                zoneList={zoneList}
                activeRegionId={activeRegionId}
                selectedZones={selectedZones}
                onTabClick={onTabClick}
                onRegionSelect={onRegionSelect}
                onRegionAllClick={onRegionAllClick}
                onTabAllClick={onTabAllClick}
                onZoneSelect={onZoneSelect}
                isAllZoneSelected={isAllZoneSelected}
                setSelectedRegion={setSelectedRegion}
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

const TabButton = styled.div`
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