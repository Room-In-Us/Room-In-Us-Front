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
    selectedPeople,
    selectedRegion,
    selectedSort
  }) {
  const { isMobile } = useDevice();
  const [activeTab, setActiveTab] = useState("people");
  const [localSelectedRegions, setLocalSelectedRegions] = useState(selectedRegion || []);

  const peopleRef = useRef();
  const sortRef = useRef();
  const regionRef = useRef();

  useEffect(() => {
    if (isOpen && isMobile) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => (document.body.style.overflow = "auto");
  }, [isOpen, isMobile]);

  if (!isOpen) return null;
  
  const resetFilters = () => {
    peopleRef.currentValue = 2;
    regionRef.currentValue = null;
    sortRef.currentValue = "만족도 높은 순";
  
    peopleRef.current?.reset?.();
    regionRef.current?.reset?.();
    sortRef.current?.reset?.();
  
    onReset?.(); 
  };
  
  const applyFilters = () => {

    onApply({
      people: peopleRef.currentValue ?? selectedPeople,
      region: regionRef.currentValue ?? selectedRegion,
      sort: sortRef.currentValue ?? selectedSort,
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
              <ResetButton src={ResetIcon} onClick={resetFilters} />
            </TabContainer>
          </TopWrapper>

          <Content>
            {activeTab === "people" && ( <PeopleFilter   key={selectedPeople}  ref={peopleRef} onSelect={(val) => (peopleRef.currentValue = val)} isMobile={isMobile} selected={selectedPeople} />)}
            {activeTab === "sort" && <SortFilter key={selectedSort} ref={sortRef} onSelect={(val) => (sortRef.currentValue = val)} isMobile={isMobile} selected={selectedSort} />}
            {activeTab === "region" && <RegionFilter key={JSON.stringify(selectedRegion)} ref={regionRef} onSelect={(val) => {
    regionRef.currentValue = val;
    setLocalSelectedRegions(val); // 내부 상태 관리
  }} isMobile={isMobile} selected={selectedRegion} />}
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
  z-index: 1000;
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