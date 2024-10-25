import { useState } from "react";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import MarkerIcon from "../../../assets/images/locationPage/marker.png";
import { goolgleMapStyles } from "./googleMapStyles";

function GoogleMaps() {
    // state 관리
    const [mapLoaded, setMapLoaded] = useState(false);
    const [customIcon, setCustomIcon] = useState(null);

    const containerStyle = {
        width: '26em',
        height: '35em'  // 기본: 36.8788em
    };

    // 표시될 위치(위도, 경도)
    const center = {
        lat: 37.5638934,
        lng: 126.9844558
    };

    // Google Map에 옵션을 설정
    const options = {
        styles: goolgleMapStyles, // 스타일 적용
        zoomControl: true,
        disableDefaultUI: true, // 기본 UI 요소 비활성화
    };

    // Google Maps API가 로드된 후 아이콘 크기 설정
    const handleOnLoad = () => {
        setCustomIcon({
            url: MarkerIcon,
            scaledSize: new window.google.maps.Size(50, 50),
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
                    zoom={12}
                    options={options}
                >
                    <MarkerF position={center} icon={customIcon}></MarkerF>
                </GoogleMap>
            )}
            </LoadScript>
        </div>
  );
}

export default GoogleMaps;
