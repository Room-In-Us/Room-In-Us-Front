import { useState } from "react";
import styled from "styled-components";
import GoogleMapComponent from "../features/location/ui/map/GoogleMapComponent";
import MarkerIcon from "../shared/assets/icons/location/markerIcon.svg?react";
import ArrowIcon from "../shared/assets/icons/location/arrowIcon.svg?react";
import StationCard from "../features/location/ui/StationCard";
import StoreCard from "../features/location/ui/StoreCard";
import { useRecoilState } from "recoil";
import { stationCardVisible, storeCardVisible } from "../features/location/model/locationAtom";

function LocationPage() {
  // 상태 관리
  const [isSeoulCheck, setIsSeoulCheck] = useState(true);
  const [isStationListVisible, setIsStationListVisible] = useState(true);
  const [isStationCardVisible, setIsStationCardVisible] = useRecoilState(stationCardVisible);
  const [isStoreCardVisible, setIsStoreCardVisible] = useRecoilState(storeCardVisible);
  // const [isStationCheck, setIsStationCheck] = useState(false);

  // 임시 역 리스트
  const stationList = [
    "강남", "홍대", "건대", "신촌", "대학로", "잠실",
    "신림", "종각", "노원", "성수", "신사", "성신여대",
    "서울대입구", "명동", "영등포", "수유", "그 외 지역",
  ];

  // 지역 선택 핸들러
  const handleLocationCheck = () => {
    setIsSeoulCheck(!isSeoulCheck);
    setIsStationListVisible(true);
  };

  // 역 선택 핸들러
  const handleStationSelect = () => {
    setIsStationCardVisible(true);
    setIsStoreCardVisible(false);
  };

  return (
    <PageWrapper>
      {/* 지도 영역 */}
      <GoogleMapComponent />

      <OverlayWrapper>
        {/* 지역 선택 영역 */}
        <LocationButtonWrapper>
          <LocationButton
            isSeoulCheck={isSeoulCheck}
            onClick={handleLocationCheck}
          >
            <StyledMarkerIcon isSeoulCheck={isSeoulCheck}/>
            <LocationText>
              서울
            </LocationText>
          </LocationButton>
          <LocationButton
            isSeoulCheck={!isSeoulCheck}
            onClick={handleLocationCheck}
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
              onClick={handleStationSelect}
            >
              <StationTitle>
                {station}
              </StationTitle>
              <ListEnterWrapper>
                <StoreNumber>
                  99
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
font-size: 1.155em; // 임의로 지정
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
  background: var(--RIU_Monochrome-20, #F0F0F4);
  line-height: normal;
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
`;

// import { useState, useEffect } from 'react';
// import { useRecoilState, useRecoilValue } from 'recoil';
// import {
//   locationState,
//   stationState,
//   cafeState,
//   themeState,
//   backgroundVisible,
//   locationVisible,
//   stationVisible,
//   cafeVisible,
//   themeVisible,
//   mapsLoadedState,
//   locationCenterState,
// } from '../features/location/model/locationAtom';
// import styled from 'styled-components';
// import MapImg from '../shared/assets/images/location/locationMap.png';
// import LocationContent from '../features/location/ui/LocationContent';
// import GoogleMaps from '../features/location/ui/map/GoogleMaps';
// import LocationButton from '../shared/assets/images/location/locationButton.png';
// import NoiseTexture from '../shared/assets/images/location/noiseTexture.png';

// function LocationPage() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isBackgroundVisible, setIsBackgroundVisible] = useRecoilState(backgroundVisible);
//   const mapsLoaded = useRecoilValue(mapsLoadedState); // Google Maps API 로드 상태 확인용
//   const [, setIsLocationState] = useRecoilState(locationState);
//   const [, setIsStationState] = useRecoilState(stationState);
//   const [, setIsCafeState] = useRecoilState(cafeState);
//   const [, setIsThemeState] = useRecoilState(themeState);

//   const [isLocationVisible, setIsLocationVisible] = useRecoilState(locationVisible);
//   const [, setIsStationVisible] = useRecoilState(stationVisible);
//   const [, setIsCafeVisible] = useRecoilState(cafeVisible);
//   const [, setIsThemeVisible] = useRecoilState(themeVisible);

//   // 도시 중앙 위치 관리
//   const [, setLocationCenter] = useRecoilState(locationCenterState);

//   // Google Maps 로드가 완료되면, isBackgroundVisible을 업데이트
//   useEffect(() => {
//     if (mapsLoaded) {
//       setIsBackgroundVisible(false); // 기본값을 false로 설정해 지도를 숨김
//     }
//   }, [mapsLoaded, setIsBackgroundVisible]);

//   const handleVisibleContent = () => {
//     setIsLocationState('');
//     setIsStationState('');
//     setIsCafeState('');
//     setIsThemeState('');
//     setIsVisible(true);
//     setIsLocationVisible(true);
//     setIsStationVisible(false);
//     setIsCafeVisible(false);
//     setIsThemeVisible(false);
//   };

//   const handleLocationState = (locationName) => {
//     setIsLocationState(locationName);
//     setIsLocationVisible(false);
//     setIsStationVisible(true);
//     setIsBackgroundVisible(true); // 위치 클릭 시 지도를 표시
//     setLocationCenter({ lat: 37.5638934, lng: 126.9844558 }); // 도시 좌표 저장
//   };

//   return (
//     <PageWrapper>
//       <ImgWrapper isVisible={isVisible}>
//         {/* GoogleMaps는 mapsLoaded와 isBackgroundVisible이 true일 때만 렌더링 */}
//         {mapsLoaded && isBackgroundVisible ? (
//           <GoogleMaps />
//         ) : (
//           <StyledMapImg src={MapImg} alt="map" isVisible={isVisible} onClick={handleVisibleContent} />
//         )}
//         <ContentWrapper isVisible={isVisible}>
//           <ButtonWrapper isVisible={isLocationVisible}>
//             <StyledButton>
//               {/* 2: 서울 */}
//               <Text onClick={() => handleLocationState('2')}>서울</Text>
//             </StyledButton>
//             <StyledButton>
//               <Text onClick={() => handleLocationState('수도권')}>수도권</Text>
//             </StyledButton>
//           </ButtonWrapper>
//           <LocationContent />
//         </ContentWrapper>
//       </ImgWrapper>
//     </PageWrapper>
//   );
// }

// export default LocationPage;

// // CSS
// const PageWrapper = styled.div`
//   display: flex;
//   justify-content: center;
// `;

// const ImgWrapper = styled.div`
//   width: ${(props) => (props.isVisible ? '53em' : '30em')};
//   height: 38em;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   transition: all 1s ease;
// `;

// const StyledMapImg = styled.img`
//   width: 28em;
//   z-index: 5;
//   box-shadow: 0 0.5em 3em 0.1em black;
//   transition: all 1s ease;
//   cursor: pointer;
// `;

// const ContentWrapper = styled.div`
//   margin-left: 3em;
//   width: 24em;
//   height: 32.88em;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   background-color: #353535;
//   box-shadow: 0 0 1.5em 2em #353535;
//   opacity: ${(props) => (props.isVisible ? 1 : 0)};
//   transition: opacity 0.5s ease-in;
//   transition-delay: 0.5s;
// `;

// const ButtonWrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   display: ${(props) => (props.isVisible ? 'flex' : 'none')};
//   flex-direction: column;
//   justify-content: space-between;
//   align-items: center;
// `;

// const StyledButton = styled.div`
//   border-radius: 0.4em;
//   width: 100%;
//   height: 6.2em;
//   line-height: 6.2em;
//   text-align: center;
//   display: flex;
//   background-image: url(${LocationButton});
//   background-size: cover;
//   font-family: 'Vitro-Core';
//   font-size: 2.5em;
//   color: white;
//   box-shadow: 0 3px 2px #1d1d1d;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   &:hover {
//     transform: translateY(-0.2em);
//     box-shadow: 0 0.3em 0.2em #1d1d1d;
//   }
// `;

// const Text = styled.div`
//   width: 100%;
//   height: 100%;
//   background-image: url(${NoiseTexture});
//   background-size: cover;
//   background-clip: text;
//   -webkit-background-clip: text;
//   color: transparent;
// `;
