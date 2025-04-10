import { forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import { 
  Wrapper, 
  FilterContainer, 
  FilterTextWrapper,
  DropdownHeader,
  DropDownIcon,
  MenuWrapper } from "./FilterStyles.js";
import Location from '../../../shared/assets/icons/genre/location.svg?react';
import DropDownImg from '../../../shared/assets/icons/common/dropdown.svg';
import useDevice from "../../hooks/useDevice.js";
import useDropdown from "../../hooks/useDropDown.js";

const RegionFilter = forwardRef(({ 
  regions,
  zones,
  selectedRegion,
  selectedZone,
  selectedZones,
  activeRegionId,
  onTabClick,
  onRegionSelect,
  onRegionAllClick,
  onTabAllClick, 
  onZoneSelect,
  isAllZoneSelected,
 }, ref) => {
  const { isMobile, isTablet, isDeskTop } = useDevice();

  const {
    isOpen,
    handleSelect,
    selected,
    toggleDropdown,
    position,
    triggerRef: filterRef,
    dropdownRef,
    reset
  } = useDropdown({ 
    defaultValue: selectedRegion,
    initialWidth: 460,
    responsive: true,
    onSelect: onRegionSelect,
   });

   useImperativeHandle(ref, () => ({
    reset,
  })); 

  return (
    <Wrapper>
      {/* 필터 영역 */}
      { !isMobile && (
        <FilterContainer ref={filterRef} onClick={toggleDropdown} >
          <FilterTextWrapper>
            <FilterIcon disabled={false} />
            <FilterText disabled={false}>{selectedRegion || "지역 선택"}</FilterText>
          </FilterTextWrapper>
          <DropDownIcon src={DropDownImg} $isRotated={isOpen}/>
        </FilterContainer>
      )}

      {/* 드롭다운 영역 */}
      {isMobile ? (
        <MenuWrapper>
          <Container>

            {/* 지역 전체 버튼 */}
            <RegionAllButton
              onClick={onRegionAllClick}
              selected={selectedRegion === "지역 전체"}
            >
              지역 전체
            </RegionAllButton>

            <TabLayout>

              {/* 서울, 경기/인천 선택 영역 */}
              <Tabs>
              {regions.map((region) => (
                <TabButton
                  key={region.regionId} 
                  onClick={() => onTabClick(region.regionId)}
                  selected={activeRegionId === region.regionId}
                >
                  {region.regionName}
                </TabButton>
              ))}
              </Tabs>

              {/* 상세 구역 선택 영역 */}
              <Grid>

                {/* 구역 전체 선택 영역 */}
                <TabAllButton
                  onClick={() => onTabAllClick(activeRegionId, activeRegionId === 1 ? "서울 전체" : "경기/인천 전체")}
                  selected={selectedRegion === (activeRegionId === 1 ? "서울 전체" : "경기/인천 전체")}
                >
                  {activeRegionId === 1 ? "서울 전체" : activeRegionId === 2 ? "경기/인천 전체" : "서울 전체"}
                </TabAllButton>

                <Divider /> {/* 구분선 */}

              
                {zones.map((zone) => (
                <RegionButton
                  key={zone.zoneId}
                  onClick={() => {
                    onZoneSelect(zone.zoneName);
                    ref.currentValue = zone.zoneName; 
                  }}
                  selected={selectedZones.includes(zone.zoneName)}
                >
                  {zone.zoneName}
                </RegionButton>
                ))}
     
              </Grid>
            </TabLayout>

          </Container>
        </MenuWrapper>
      ) : (

        <DropdownMenu ref={dropdownRef} style={{ top: position.top, left: position.left }} $isVisible={isOpen}>
          <DropdownHeader>지역</DropdownHeader>
          <Container>

            {/* 지역 전체 버튼 */}
            <RegionAllButton
              onClick={onRegionAllClick}
              selected={selectedRegion === "지역 전체"}
            >
              지역 전체
            </RegionAllButton>

            <TabLayout>

              {/* 서울, 경기/인천 선택 영역 */}
              <Tabs>
                
              {regions.map((region) => (
                <TabButton
                  key={region.regionId} 
                  onClick={() => onTabClick(region.regionId)}
                  selected={activeRegionId === region.regionId}
                >
                  {region.regionName}
                </TabButton>
              ))}

              </Tabs>

              {/* 상세 구역 선택 영역 */}
              <Grid>

                {/* 구역 전체 선택 영역 */}
                <TabAllButton
                  onClick={() => onTabAllClick(activeRegionId, activeRegionId === 1 ? "서울 전체" : "경기/인천 전체")}
                  selected={isAllZoneSelected && selectedRegion === (activeRegionId === 1 ? "서울 전체" : "경기/인천 전체")}
                >
                  {activeRegionId === 1 ? "서울 전체" : activeRegionId === 2 ? "경기/인천 전체" : "서울 전체"}
                </TabAllButton>

                <Divider /> {/* 구분선 */}

                {zones.map((zone) => (
                <RegionButton
                  key={zone.zoneId}
                  onClick={() => onZoneSelect(zone.zoneName)}
                  selected={selectedZones.includes(zone.zoneName)}
                >
                  {zone.zoneName}
                </RegionButton>
                ))}
              </Grid>
            </TabLayout>
            
          </Container>
            
        </DropdownMenu>

    )}
    </Wrapper>
  );
})

const FilterIcon = styled(Location)`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;

  path {
    fill: ${({ disabled }) => (disabled ? "#515467" : "#5B6ACC")};
  }

  @media (max-width: 1024px) {
    width: 0.703125rem;
    height: 0.703125rem;
  }
`;

const FilterText = styled.div`
  color: ${({ disabled }) => (disabled ? "#717486" : "#5B6ACC")};
  font-family: Pretendard-Bold;
  font-size: 0.875rem;

  @media (max-width: 1024px) {
    font-size: 0.65625rem;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  z-index: 10;
  box-sizing: border-box;
  margin-top: 0.625rem;

  display: inline-flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: var(--RIU_Monochrome-20, #F0F0F4);
  box-shadow: 0rem 0.25rem 0.625rem rgba(0, 0, 0, 0.1);

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? 'translateY(0)' : 'translateY(-0.5px)')};
  transition: opacity 0.3s ease, transform 0.3s ease;

  width: 28.75rem;
  top: ${({ top }) => `${top}px`}; 
  left: ${({ left }) => `${left}px`}; 

  @media (max-width: 1024px) {
    width: 21.5625rem;
    margin-top: 0.46875rem;
    box-shadow: 0rem 0.1875rem 0.46875rem rgba(0, 0, 0, 0.1);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-top: 1px solid var(--RIU_Monochrome-50, #D6D6DF);

  @media (max-width: 768px) {
    border: none;
  }
`;

const TabLayout = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const Tabs = styled.div`
  display: flex;
  width: 5rem;
  height: 100%;
  flex-direction: column;

  @media (max-width: 1024px) {
    width: 3.75rem;
  }
  @media (max-width: 768px) {
    width: 20%;
  }
`;

const RegionAllButton = styled.div`
  display: flex;
  width: 27.5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  margin: 0.625rem;
  border-radius: 0.25rem;
  box-sizing: border-box;

  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: Pretendard-Bold;
  font-size: 0.875rem;
  cursor: pointer;

  background: ${(props) => (props.selected ? "var(--RIU_Primary-Gradient-01, linear-gradient(101deg, #9FABF7 0.85%, #85BFB3 100%))" : "#A1A4B5")};

  &:hover {
    background:var(--RIU_Primary-Gradient-01, linear-gradient(101deg, #9FABF7 0.85%, #85BFB3 100%));
  }

  @media (max-width: 1024px) {
    width: 20.625rem;
    height: 1.875rem;
    margin: 0.46875rem;
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    width: 21.5625rem;
    height: 2.5rem;
    margin: 0.625rem;
    font-size: 0.75rem;
  }
`;

const TabButton = styled.div`
  display: flex;
  width: 5rem;
  height: 2.5rem;
  justify-content: center;
  align-items: center;
  background: ${(props) => (props.selected ? "#718FF2" : "#F9F9FB")};
  cursor: pointer;

  color: ${(props) => (props.selected ? "#F9F9FB" : "#515467")};
  font-family: ${(props) => (props.selected ? "Pretendard-Bold" : "Pretendard-Medium")};
  font-size: 0.875rem;
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);

  @media (max-width: 1024px) {
    width: 3.75rem;
    height: 1.875rem;
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 3.125rem;
    font-size: 0.75rem;
  }
`;

const Grid = styled.div`
  display: flex;
  height: 100%;
  padding: 0.625rem;
  justify-content: space-between;
  align-items: center;
  row-gap: 0.625rem;
  flex-wrap: wrap;
  background: var(--RIU_Monochrome-70, #B3B6C3);
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 0.46875rem;
    row-gap: 0.46875rem;
  }
  @media (max-width: 768px) {
    padding: 0.625rem;
    gap: 0.625rem;
    row-gap: 0.625rem;
    width: 80%;
  }
`;

const TabAllButton = styled.div`
  display: flex;
  width: 100%;
  height: 2.5rem;
  align-items: center;
  border-radius: 0.25rem;
  padding: 0.625rem 1.25rem;
  background: ${(props) => (props.selected ? "#D0D8FF" : "#F0F0F4")};
  cursor: pointer;
  font-size: 0.875rem;
  box-sizing: border-box;
  font-family: ${(props) => (props.selected ? "Pretendard-Bold" : "Pretendard-Medium")};
  color: ${(props) => (props.selected ? "#5B6ACC" : "#717486")};

  &:hover {
    background: #D0D8FF;
  }

  @media (max-width: 1024px) {
    height: 1.875rem;
    padding: 0.46875rem 0.9375rem;
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    width: 17.5rem;
    height: 2.5rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #818496;
`;

const RegionButton = styled.div`
  display: flex;
  width: 10.9375rem;
  height: 2.5rem;
  padding: 0.625rem 1.25rem;
  align-items: center;
  border-radius: 0.25rem;
  background: ${(props) => (props.selected ? "#D0D8FF" : "#F0F0F4")};
  cursor: pointer;
  box-sizing: border-box;

  color: ${(props) => (props.selected ? "#5B6ACC" : "#717486")};
  font-family: ${(props) => (props.selected ? "Pretendard-Bold" : "Pretendard-Medium")};
  font-size: 0.875rem;

  &:hover {
    background: var(--RIU_Primary-20, #D0D8FF);
  }

  @media (max-width: 1024px) {
    width: 8.203125rem;
    height: 1.875rem;
    padding: 0.46875rem 0.9375rem;
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    width: 8.4375rem;
    height: 2.5rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.75rem;
  }
`;

export default RegionFilter;