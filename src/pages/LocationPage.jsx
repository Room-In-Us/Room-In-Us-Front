import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GoogleMapComponent from "../features/location/ui/GoogleMapComponent";
import MarkerIcon from "../shared/assets/icons/location/markerIcon.svg?react";
import ArrowIcon from "../shared/assets/icons/common/arrow/rightArrow.svg?react";
import StationCard from "../features/location/ui/StationCard";
import StoreCard from "../features/location/ui/StoreCard";
import { useRecoilState } from "recoil";
import { stationCardVisible, storeCardVisible, zoneId, storePageNumber, locationRegionId, zoneName, storeCount, themeCount } from "../features/location/model/locationAtom";
import { getLocationZonesAPI } from "../features/location/api/locationAPI";
import useDevice from "../shared/hooks/useDevice";
import { Sheet } from "react-modal-sheet";

function LocationPage() {
  // 상태 관리
  const [isSeoulCheck, setIsSeoulCheck] = useState(true);
  const [selectedStationIndices, setSelectedStationIndices] = useState({
    1: null, // 서울
    2: null, // 경기/인천
  });
  const [isStationListVisible, setIsStationListVisible] = useState(true);
  const [isStationCardVisible, setIsStationCardVisible] = useRecoilState(stationCardVisible);
  const [isStoreCardVisible, setIsStoreCardVisible] = useRecoilState(storeCardVisible);
  const [stationList, setStationList] = useState([]); // 역 목록 상태
  const [regionId, setRegionId] = useRecoilState(locationRegionId); // 지역 아이디 상태
  const [, setZoneName] = useRecoilState(zoneName); // 구역 이름 상태
  const [, setStoreCount] = useRecoilState(storeCount); // 구역별 매장 개수
  const [, setThemeCount] = useRecoilState(themeCount); // 구역별 테마 개수
  const [, setIsZoneId] = useRecoilState(zoneId);
  const [, setCurrentPage] = useRecoilState(storePageNumber);

  const sheetRef = useRef(null);

  // 스냅 포인트
  const snapPoints = [0, 26, 0.9, 1];
  const PEEK_INDEX = 2;

  // 반응형 함수
  const { isMobile } = useDevice();

  // 지역 선택 핸들러
  const handleLocationCheck = (id) => {
    setIsSeoulCheck(id === 1);
    setIsStationListVisible(true);
    setRegionId(id);
    setCurrentPage(1);
  };

  // 역 선택 핸들러
  const handleStationSelect = (data) => {
    setIsStationCardVisible(true);
    setIsStoreCardVisible(false);
    setIsZoneId(data.zoneId);
    setZoneName(data.zoneName);
    setStoreCount(data.storeCount);
    setThemeCount(data.themeCount);
    setCurrentPage(1);
  };

  // 구역 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLocationZonesAPI(regionId);
        console.log('구역별 역 목록: ', response);
        setStationList(response);
        setIsZoneId(response.zoneId);
      } catch (error) {
        console.error('구역별 역 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [regionId, setIsZoneId]);

  return (
    <PageWrapper>
      {/* 지도 영역 */}
      <GoogleMapComponent />

      {!isMobile ? (
      <OverlayWrapper>
        {/* 지역 선택 영역 */}
        <LocationButtonWrapper>
          <LocationButton
            isSeoulCheck={isSeoulCheck}
            onClick={() => handleLocationCheck(1)}
          >
            <StyledMarkerIcon isSeoulCheck={isSeoulCheck}/>
            <LocationText>
              서울
            </LocationText>
          </LocationButton>
          <LocationButton
            isSeoulCheck={!isSeoulCheck}
            onClick={() => handleLocationCheck(2)}
          >
            <StyledMarkerIcon isSeoulCheck={!isSeoulCheck}/>
            <LocationText>
              경기/인천
            </LocationText>
          </LocationButton>
        </LocationButtonWrapper>

        {/* 역 선택 영역 */}
        <StationListWrapper isVisible={isStationListVisible}>
          {stationList.map((station, index) => (
            <StationList
              key={index}
              isSelected={selectedStationIndices[regionId] === index}
              onClick={() => {
                handleStationSelect(station);
                setSelectedStationIndices({
                  [regionId]: index,
                  [regionId === 1 ? 2 : 1]: null,
                });
              }}
            >
              <StationTitle>
                {station.zoneName}
              </StationTitle>
              <ListEnterWrapper>
                <StoreNumber>
                  {station.storeCount}
                </StoreNumber>
                <StyledArrowIcon />
              </ListEnterWrapper>
            </StationList>
          ))}
        </StationListWrapper>

        {/* 옆 버튼 */}
        <SideButtonWrapper>
          <SideButton onClick={() => {setIsStationListVisible(!isStationListVisible)}}>
            <SideButtonArrow openState={isStationListVisible}/>
          </SideButton>
        </SideButtonWrapper>

        {/* 역 카드 영역 */}
        {isStationCardVisible &&
          <StationCard />
        }

        {/* 매장 카드 영역 */}
        {isStoreCardVisible &&
          <StoreCard />
        }

      </OverlayWrapper>
      ) : (

        <>
          {/* 모바일 바텀시트 */}
          <Sheet
            ref={sheetRef}
            isOpen={true}
            initialSnap={PEEK_INDEX}
            snapPoints={snapPoints}
            onClose={() => sheetRef.current?.snapTo(PEEK_INDEX)}
            onSnap={(index) => {
              if (index === 0) sheetRef.current?.snapTo(PEEK_INDEX);
            }}
          >
            <Sheet.Container style={{ zIndex: 3000 }}>
              {/* 손잡이(드래그 핸들) */}
              <Sheet.Header>
                <HeaderDragHandle />
              </Sheet.Header>
              
              <Sheet.Content>
                <SheetBody>

                  {/* 지역 선택 영역 */}
                  <LocationButtonWrapper>
                    <LocationButton
                      isSeoulCheck={isSeoulCheck}
                      onClick={() => handleLocationCheck(1)}
                    >
                      <StyledMarkerIcon isSeoulCheck={isSeoulCheck}/>
                      <LocationText>서울</LocationText>
                    </LocationButton>
                    <LocationButton
                      isSeoulCheck={!isSeoulCheck}
                      onClick={() => handleLocationCheck(2)}
                    >
                      <StyledMarkerIcon isSeoulCheck={!isSeoulCheck}/>
                      <LocationText>경기/인천</LocationText>
                    </LocationButton>
                  </LocationButtonWrapper>

                  {/* 역 리스트 (폭만 100%로) */}
                  <div style={{ width: "100%" }}>
                    {stationList.map((station, index) => (
                      <StationList
                        key={index}
                        isSelected={selectedStationIndices[regionId] === index}
                        onClick={() => {
                          handleStationSelect(station);
                          setSelectedStationIndices({
                            [regionId]: index,
                            [regionId === 1 ? 2 : 1]: null,
                          });
                          // 필요시 선택 후 피크로 접기: sheetRef.current?.snapTo(0);
                        }}
                      >
                        <StationTitle>{station.zoneName}</StationTitle>
                        <ListEnterWrapper>
                          <StoreNumber>{station.storeCount}</StoreNumber>
                          <StyledArrowIcon />
                        </ListEnterWrapper>
                      </StationList>
                    ))}
                  </div>

                  {isStationCardVisible && <StationCard />}
                  {isStoreCardVisible && <StoreCard />}

                  {/* === 끝 === */}
                </SheetBody>
              </Sheet.Content>
            </Sheet.Container>

            {/* 바깥(딤) 탭 → 피크로 접힘 */}
            <Sheet.Backdrop
              onTap={() => sheetRef.current?.snapTo(PEEK_INDEX)}
              style={{ zIndex: 2990 }}
            />
          </Sheet>
        </>
      )}
    </PageWrapper>
  );
};

export default LocationPage;

// CSS
const PageWrapper = styled.div`
font-size: 0.6rem; // 임의로 지정
  margin-top: 5.625rem; // 헤더높이
  width: 100vw;
  height: calc(100vh - 5.625rem - 2.375rem); // 100vh-헤더-풋터
  position: absolute;
  display: flex;
`;

const OverlayWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const LocationButtonWrapper = styled.div`
font-size: 1.5em; // 임의로 지정
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  z-index: 300;
  pointer-events: auto;

  @media (max-width: 768px) {
    background: var(--RIU_Monochrome-30, #E7E8ED);
  }
`;

const LocationButton = styled.div`
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  width: 4.375em;
  height: 4.375em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  background: ${(props) => (props.isSeoulCheck ? "var(--RIU_Primary-100, #718FF2)" : "var(--RIU_Monochrome-10, #F9F9FB)")};
  color: ${(props) => (props.isSeoulCheck ? "var(--RIU_Monochrome-10, #F9F9FB)" : "var(--RIU_Monochrome-500, #515467)")};
  line-height: normal;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
`;

const StyledMarkerIcon = styled(MarkerIcon)`
  width: 1.875em;
  height: 1.875em;
  fill: ${(props) => (props.isSeoulCheck ? "var(--RIU_Monochrome-10, #F9F9FB)" : "var(--RIU_Primary-100, #718FF2)")};
  transition: all 0.2s ease-in-out;
`;

const LocationText = styled.div`
  font-family: 'Pretendard-Bold';
  font-size: 0.75em;
`;

const SideButtonWrapper = styled.div`
  margin-right: 1.875em;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
`;

const SideButton = styled.div`
font-size: 1.5em; // 임의로 지정
  border-radius: 0em 0.625em 0.625em 0em;
  display: flex;
  width: 1.25em;
  height: 4.375em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  background: #FFF;
`;

const SideButtonArrow = styled(ArrowIcon)`
  width: 0.9375em;
  height: 0.9375em;
  fill: var(--RIU_Primary-80, #8DA3FF);
  transform: rotate(${(props) => (props.openState ? "-180deg" : "0deg")});
  transition: all 0.3s ease;
`;

const StationListWrapper = styled.div`
font-size: 1.3em; // 임의로 지정
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--RIU_Monochrome-100, #818496);
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;

  transition: width 0.2s ease, transform 0.2s ease-out;

  width: ${(props) => (props.isVisible ? "15em" : "0")};
  transform: ${(props) => (props.isVisible ? "translateX(0)" : "translateX(-100%)")};
  pointer-events: ${(props) => (props.isVisible ? "auto" : "none")};

  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
    background: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 3em;
    background-color: #8DA3FF;
  }
`;

const StationList = styled.div`
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  padding: 0em 1.25em 0em 2.5em;
  box-sizing: border-box;
  display: flex;
  width: 15em;
  height: 3.125em;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: ${(props) =>
    props.isSelected ? "var(--RIU_Monochrome-10, #F9F9FB)" : "var(--RIU_Monochrome-20, #F0F0F4)"};
  line-height: normal;
  transition: background 0.2s ease;
  cursor: pointer;
`;

const StationTitle = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Medium';
  font-size: 1em;
`;

const ListEnterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
  cursor: pointer;
`;

const StoreNumber = styled.div`
  color: var(--RIU_Primary-80, #8DA3FF);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875em;
`;

const StyledArrowIcon = styled(ArrowIcon)`
  width: 0.9375em;
  height: 0.9375em;

  path {
    fill: var(--RIU_Monochrome-200, #717486);
  }
`;

// 모바일 시트
const HeaderDragHandle = styled.div`
  border-radius: 0.625em;
  margin: 0.625em auto;
  width: 6.25em;
  height: 0.375em;
  background-color: var(--RIU_Monochrome-40, #DFDFE6);
`;

const SheetBody = styled.div`
  height: 100%;
  // maxHeight: 80dvh;
  overflow: auto;
  WebkitOverflowScrolling: touch;
`;
