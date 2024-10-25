import { useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import MarkerIcon from "../../assets/images/mapPage/marker.png";
import { goolgleMapStyles } from "./googleMap";

function GoogleMapPage() {
    // state 관리
    const [mapLoaded, setMapLoaded] = useState(false);
    const [customIcon, setCustomIcon] = useState(null);

    const containerStyle = {
        width: '700px',
        height: '400px'
    };

    // 표시될 위치(위도, 경도)
    const center = {
        lat: 37.5638934,
        lng: 126.9844558
    };

    // Google Map에 옵션을 설정
    const options = {
        styles: goolgleMapStyles, // 스타일 적용
        disableDefaultUI: true, // 기본 UI 요소 비활성화
    };

    // Google Maps API가 로드된 후 아이콘 크기 설정
    const handleOnLoad = () => {
        setCustomIcon({
            url: MarkerIcon,
            scaledSize: new window.google.maps.Size(40, 40),
        });
        setMapLoaded(true); // 지도 API가 로드되었음을 표시
    };

    return (
        <div>
        <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={handleOnLoad} // 스크립트 로드 완료 시 호출
        >
        {mapLoaded && (
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                options={options}
            >
                <MarkerF position={center} icon={customIcon}></MarkerF>
            </GoogleMap>
        )}
        </LoadScript>
    </div>
  );
}

export default GoogleMapPage;


// import { useState } from 'react';
// import { useRecoilState } from 'recoil';
// import { locationState, initialState, stationState, cafeState, themeState, backgroundVisible,
//         locationVisible, initialVisible, stationVisible, cafeVisible, themeVisible } from '../../recoil/atoms/locationAtom';
// import styled from 'styled-components';
// // import MapImg from '../assets/images/locationPage/locationMap.png';
// import LocationContent from '../../components/location/LocationContent';
// import NaverMapContainer from '../../components/map/NaverMapContainer';
// import { NavermapsProvider } from 'react-naver-maps';

// function GoogleMapPage() {
//     // state 관리
//     const [isVisible, setIsVisible] = useState(false);
//     const [isLocationState, setIsLocationState] = useRecoilState(locationState);
//     const [, setIsInitialState] = useRecoilState(initialState);
//     const [, setIsStationState] = useRecoilState(stationState);
//     const [, setIsCafeState] = useRecoilState(cafeState);
//     const [, setIsThemeState] = useRecoilState(themeState);

//     const [, setIsBackgroundVisible] = useRecoilState(backgroundVisible);
//     const [isLocationVisible, setIsLocationVisible] = useRecoilState(locationVisible);
//     const [, setIsInitialVisible] = useRecoilState(initialVisible);
//     const [, setIsStationVisible] = useRecoilState(stationVisible);
//     const [, setIsCafeVisible] = useRecoilState(cafeVisible);
//     const [, setIsThemeVisible] = useRecoilState(themeVisible);

//     // 내용 나타내기 + 처음으로 이동
//     const handleVisibleContent = () => {
//         setIsLocationState("서울/수도권");
//         setIsInitialState("");
//         setIsStationState("");
//         setIsCafeState("");
//         setIsThemeState("");
//         setIsVisible(true);
//         setIsBackgroundVisible(false);
//         setIsLocationVisible(true);
//         setIsInitialVisible(false);
//         setIsStationVisible(false);
//         setIsCafeVisible(false);
//         setIsThemeVisible(false);

//         if (isLocationState !== "서울/수도권") {
//             setTimeout(() => {
//                 setIsLocationVisible(false);
//                 setIsInitialVisible(true);
//                 setIsBackgroundVisible(true);
//             }, 1000);
//         } else {
//             setIsLocationVisible(false);
//             setIsInitialVisible(true);
//             setIsBackgroundVisible(true);
//         }
//     };

//     return (
//         <PageWrapper>
//             <ImgWrapper isVisible={isVisible}>
//                 {/* 지도 이미지 영역 */}
//                 {/* <StyledMapImg src={MapImg} alt='map' isVisible={isVisible} onClick={() => handleVisibleContent()} /> */}
//                 <NavermapsProvider
//                     ncpClientId={import.meta.env.VITE_NAVER_MAPS_CLIENT_ID}
//                 >
//                     <NaverMapContainer/>
//                 </NavermapsProvider>
//                 <button onClick={() => handleVisibleContent()} style={{ height: '10px', border: 'none', backgroundColor: '#353535' }}></button>
                
//                 {/* 콘텐츠 영역 */}
//                 <ContentWrapper isVisible={isVisible}>
//                     <ButtonWrapper isVisible={isLocationVisible}>

//                     </ButtonWrapper>

//                     {/* 지역 이름 초성 화면 */}
//                     <LocationContent/>
                    
//                 </ContentWrapper>
//             </ImgWrapper>
//         </PageWrapper>
//     );
// };

// export default GoogleMapPage;

// // CSS
// const PageWrapper = styled.div`
//     display: flex;
//     justify-content: center;
// `;

// const ImgWrapper = styled.div`
//     width: ${(props) => (props.isVisible ? '53em' : '30em')};
//     height: 38em;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     transition: all 1s ease;
// `;

// const StyledMapImg = styled.img`
//     width: 28em;
//     z-index: 5;
//     box-shadow: 0 0.5em 3em 0.1em black;
//     transition: all 1s ease;
//     cursor: pointer;
// `;

// const ContentWrapper = styled.div`
//     margin-left: 3em;
//     width: ${(props) => (props.isVisible ? '24em' : 0)};
//     height: 32.88em;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background-color: #353535;
//     box-shadow: 0 0 1.5em 2em #353535;
//     opacity: ${(props) => (props.isVisible ? 1 : 0)};
//     transition: opacity 0.5s ease-in;
//     transition-delay: 0.5s;
// `;

// const ButtonWrapper = styled.div`
//     width: 100%;
//     height: 100%;
//     display: ${(props) => (props.isVisible ? 'inline-block' : 'none')};
// `;
