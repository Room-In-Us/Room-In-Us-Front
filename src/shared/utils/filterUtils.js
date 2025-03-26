import { getZoneAPI } from "../../features/location/api/getZoneAPI";

// 상세 구역 버튼 다중 선택 함수
export  const handleZoneSelect = (zoneName, regionId, regions, setSelectedTab, setSelectedRegionId, setSelectedRegions, setIsRegionAllSelected, onSelect) => {
    setSelectedRegions((prevSelected) => {
      const updatedRegions = prevSelected.includes(zoneName)
        ? prevSelected.filter(name => name !== zoneName) 
        : [...prevSelected, zoneName];
      
      onSelect(updatedRegions); 
      return updatedRegions;
    });
      
    const region = regions.find(region => region.regionId === regionId);
    if (region) {
      setSelectedTab(region.regionName);
      setSelectedRegionId(region.regionId);
    }
      
    setIsRegionAllSelected(false);

    if (selectedRegion === "서울 전체" || "경기/인천 전체") {
      setSelectedRegion("");
    }
  };
      

  // 서울, 경기/인천 탭 클릭 함수
  export const handleTabClick = (region) => {
    if ((selectedRegion === "서울 전체" && region.regionName === "경기/인천") ||
        (selectedRegion === "경기/인천 전체" && region.regionName === "서울")) {
      setSelectedRegion("지역 필터");
      setSelectedRegions([]); 
    }
    
    setSelectedTab(region.regionName);
    setSelectedRegionId(region.regionId);
    setIsRegionAllSelected(false);
  };
    

  // 지역 전체 버튼 클릭 함수
  export const handleRegionAllClick = (setSelectedTab, setSelectedRegion, setIsRegionAllSelected, setSelectedRegions, onSelect) => {
    setSelectedTab("지역 전체");
    setSelectedRegion("지역 전체");
    setIsRegionAllSelected(true);
    setSelectedRegions([]); 
    
    onSelect(null);
  };
    

  // 서울 전체, 경기/인천 전체 버튼 활성화 함수
  export const handleAllClick = async (selectedTab, isRegionAllSelected, setIsRegionAllSelected, setSelectedTab, setSelectedRegion, setSelectedRegions, onSelect) => {
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
    } else if (selectedTab === "경기/인천") {
      setSelectedRegion("경기/인천 전체");
      newSelectedTab = "경기/인천";
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