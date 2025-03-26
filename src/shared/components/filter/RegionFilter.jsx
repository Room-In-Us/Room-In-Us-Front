import { useState, useRef, useEffect } from "react";
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
import { getRegionAPI } from "../../../features/location/api/getRegionAPI";
import { getZoneAPI } from "../../../features/location/api/getZoneAPI";
import useDevice from "../../hooks/useDevice.js";
import useDropdown from "../../hooks/useDropDown.js";

const RegionFilter = forwardRef(({ onSelect, selected: externalSelected }, ref) => {
  const { isMobile, isTablet, isDeskTop } = useDevice();
  const [regions, setRegions] = useState([]); 
  const [selectedTab, setSelectedTab] = useState("서울");
  const [selectedRegion, setSelectedRegion] = useState("지역 전체");
  const [selectedRegions, setSelectedRegions] = useState([]);

  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [isRegionAllSelected, setIsRegionAllSelected] = useState(true); // 지역 전체 버튼 상태
  const [zones, setZones] = useState([]); 

  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 

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
    defaultValue: externalSelected,
    initialWidth: 460,
    responsive: true,
    onSelect,
   });

   useImperativeHandle(ref, () => ({
    reset,
  }));  

  // 지역 목록 조회 API 호출
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await getRegionAPI();
        const regionData = response.contents;

        if (Array.isArray(regionData) && regionData.length > 0) {
          setRegions(regionData);
          setSelectedRegionId(regionData[0].regionId); 
        } else {
          console.error("지역 API 응답이 비어 있습니다.");
          setRegions([]);
        }
      } catch (err) {
        console.error("API 요청 실패:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, []);

  // 구역 목록 조회 API 호출
  useEffect(() => {
    if (!selectedRegionId) return;

    const fetchZones = async () => {
      try {
        const response = await getZoneAPI(selectedRegionId);
        setZones(response.data); 
      } catch (err) {
        console.error("구역 API 요청 실패:", err);
        setError(err);
      }
    };

    fetchZones();
  }, [selectedRegionId]); 



    
  // 지역 전체 버튼 클릭 함수
  const handleRegionAllClick = () => {
    setSelectedTab("서울");
    setSelectedRegion("지역 전체");
    setIsRegionAllSelected(true);
    setSelectedRegions([]);
    setSelectedRegionId(1);
    
    if (ref) ref.currentValue = "지역 전체";
    onSelect(null);
  };
      
  // 서울, 경기/인천 탭 클릭 함수
  const handleTabClick = (region) => {
    if (selectedTab !== region.regionName) {
      setSelectedRegions([]);
      setSelectedRegion("지역 필터");
      onSelect(null);
    }

    setSelectedTab(region.regionName);
    setSelectedRegionId(region.regionId);
    setIsRegionAllSelected(false);
  };
    
  // 서울 전체, 경기/인천 전체 버튼 활성화 함수
  const handleAllClick = async () => {
    let newSelectedTab = selectedTab;

    if (isRegionAllSelected || selectedTab === "지역 전체") {
      setIsRegionAllSelected(false);
      setSelectedRegion("서울 전체"); 
      setSelectedTab("서울"); 
      setSelectedRegions([]);
      try {
        const response = await getZoneAPI(1); 
        const zones = response.data.map(zone => zone.zoneName);
        onSelect(zones); 
      } catch (error) {
        console.error("서울 전체 구역 데이터를 불러오는 중 오류 발생:", error);
      }
      return;
    }
    
    if (selectedTab === "서울") {
      setSelectedRegion("서울 전체");
      newSelectedTab = "서울";
      onSelect(null); 
    } else if (selectedTab === "경기/인천") {
      setSelectedRegion("경기/인천 전체");
      newSelectedTab = "경기/인천";
      onSelect(null); 
    }
    

    setSelectedRegions([]);
    setSelectedTab(newSelectedTab);
      
    try {
      const regionId = selectedTab === "서울" ? 1 : selectedTab === "경기/인천" ? 2 : null;
      if (regionId) {
        const response = await getZoneAPI(regionId);
        const zones = response.data.map(zone => zone.zoneName);
        onSelect(zones);
      }
    } catch (error) {
      console.error(`${selectedRegion} 전체 구역 데이터를 불러오는 중 오류 발생:`, error);
    }
  };

  // 상세 구역 버튼 다중 선택 함수
  const handleZoneSelect = (zoneName, regionId) => {

    setSelectedRegions((prevSelected) => {
      const updatedRegions = prevSelected.includes(zoneName)
        ? prevSelected.filter(name => name !== zoneName) 
        : [...prevSelected, zoneName];

        if (selectedRegion === "서울 전체" || selectedRegion === "경기/인천 전체") {
          setSelectedRegion("");
        }
      
      onSelect(updatedRegions); 
      return updatedRegions;
    });
      
    const region = regions.find(region => region.regionId === regionId);
    if (region) {
      setSelectedTab(region.regionName);
      setSelectedRegionId(region.regionId);
    }
      
    setIsRegionAllSelected(false);
  };


  console.log("📦 BottomSheet selectedRegion:", selectedRegion);


  return (
    <Wrapper>
      {/* 필터 영역 */}
      { !isMobile && (
        <FilterContainer ref={filterRef}>
          <FilterTextWrapper>
            <FilterIcon disabled={false} />
            <FilterText disabled={false}>
              {
              selectedRegions.length > 1
                ? `${selectedRegions[0]} 외 ${selectedRegions.length - 1}`
                : selectedRegions.length === 1
                  ? selectedRegions[0]
                  : selectedRegion
              }
            </FilterText>
          </FilterTextWrapper>
          <DropDownIcon src={DropDownImg} onClick={toggleDropdown} />
        </FilterContainer>
      )}

      {/* 드롭다운 영역 */}
      {isMobile ? (
        <MenuWrapper>
          <Container>

            {/* 지역 전체 버튼 */}
            <RegionAllButton
              selected={isRegionAllSelected} onClick={handleRegionAllClick}
            >
              지역 전체
            </RegionAllButton>

            <TabLayout>

              {/* 서울, 경기/인천 선택 영역 */}
              <Tabs>
                {regions.map((region) => (
                <TabButton
                key={region.regionId}
                onClick={() => handleTabClick(region)}
                selected={!isRegionAllSelected && selectedTab === region.regionName}
                >
                  {region.regionName}
                </TabButton>
                ))}
              </Tabs>

              {/* 상세 구역 선택 영역 */}
              <Grid>

                {/* 구역 전체 선택 영역 */}
                <TabAllButton
                  selected={!isRegionAllSelected && (selectedRegion === "서울 전체" || selectedRegion === "경기/인천 전체")}
                  onClick={() => {
                    // if (isRegionAllSelected) {
                    //   setIsRegionAllSelected(false); 
                    //   setSelectedTab("서울");
                    //   setSelectedRegion("서울 전체"); 
                    //   handleAllClick();
                    // } else {
                      handleAllClick();
                    // }
                  }}
                >
                  {isRegionAllSelected ? "서울 전체" : selectedTab === "서울" ? "서울 전체" : "경기/인천 전체"}
                </TabAllButton>

                <Divider /> {/* 구분선 */}

                {zones.map((zone) => (
                <RegionButton
                  key={zone.zoneId} 
                  onClick={() => handleZoneSelect(zone.zoneName, selectedRegionId)} 
                  selected={selectedRegions.includes(zone.zoneName)}
                >
                  {zone.zoneName} 
                </RegionButton>
                ))}
              </Grid>
            </TabLayout>

          </Container>
        </MenuWrapper>
      ) : (
      <>
        {isOpen && (
        <DropdownMenu ref={dropdownRef} style={{ top: position.top, left: position.left }}>
          <DropdownHeader>지역</DropdownHeader>
          <Container>

            {/* 지역 전체 버튼 */}
            <RegionAllButton
              selected={isRegionAllSelected} onClick={handleRegionAllClick}
            >
              지역 전체
            </RegionAllButton>

            <TabLayout>

              {/* 서울, 경기/인천 선택 영역 */}
              <Tabs>
                {regions.map((region) => (
                <TabButton
                key={region.regionId}
                onClick={() => handleTabClick(region)}
                selected={!isRegionAllSelected && selectedTab === region.regionName}
                >
                  {region.regionName}
                </TabButton>
                ))}
              </Tabs>

              {/* 상세 구역 선택 영역 */}
              <Grid>

                {/* 구역 전체 선택 영역 */}
                <TabAllButton
                  selected={!isRegionAllSelected && (selectedRegion === "서울 전체" || selectedRegion === "경기/인천 전체")}
                  onClick={() => {
                    // if (isRegionAllSelected) {
                    //   setIsRegionAllSelected(false); 
                    //   setSelectedTab("서울");
                    //   setSelectedRegion("서울 전체"); 
                    //   handleAllClick();
                    // } else {
                      handleAllClick();
                    // }
                  }}
                >
                  {isRegionAllSelected ? "서울 전체" : selectedTab === "서울" ? "서울 전체" : "경기/인천 전체"}
                </TabAllButton>

                <Divider /> {/* 구분선 */}

                {zones.map((zone) => (
                <RegionButton
                  key={zone.zoneId} 
                  onClick={() => handleZoneSelect(zone.zoneName, selectedRegionId)} 
                  selected={selectedRegions.includes(zone.zoneName)}
                >
                  {zone.zoneName} 
                </RegionButton>
                ))}
              </Grid>
            </TabLayout>
            
          </Container>
            
        </DropdownMenu>
      )}
      </>
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