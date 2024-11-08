import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from 'recoil';
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import MarkerIcon from "../../../assets/images/locationPage/marker.png";
import { goolgleMapStyles } from "./googleMapStyles";
import { stationVisible, mapsLoadedState, stationLatAndLngList, cafeLatAndLngList } from '../../../recoil/atoms/locationAtom';
import Loading from "../../common/Loading";

function GoogleMaps() {
    // state 관리
    const [isStationVisible,] = useRecoilState(stationVisible);
    const mapsLoaded = useRecoilValue(mapsLoadedState);  // 전역 상태로 로딩 여부 확인
    const [customIcon, setCustomIcon] = useState(null);
    // 핀으로 표시할 위도,경도 리스트 (역, 카페)
    const stationLatAndLng = useRecoilValue(stationLatAndLngList);
    const cafeLatAndLng = useRecoilValue(cafeLatAndLngList);

    // 지도 사이즈
    const containerStyle = {
        width: '26em',
        height: '35em'
    };

    // 중앙 위치
    const center = {
        lat: 37.5638934,
        lng: 126.9844558
    };

    const options = {
        styles: goolgleMapStyles,  // 커스텀 ui
        zoomControl: true,  // 확대 축소 버튼
        disableDefaultUI: true,  // 기본 설정 초기화
    };

    useEffect(() => {
        if (mapsLoaded) { // API가 로드된 경우에만 아이콘 설정
            setCustomIcon({
                url: MarkerIcon,
                scaledSize: new window.google.maps.Size(50, 50),
            });
        }
    }, [mapsLoaded]);

    if (!mapsLoaded) return <Loading/>; // API 로딩 중 상태 표시

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={options}
        >
            {(isStationVisible ? stationLatAndLng : cafeLatAndLng).map((list, index) => (
                <MarkerF
                    key={index}
                    position={list}
                    icon={customIcon}
                />
            ))}
        </GoogleMap>
    );
}

export default GoogleMaps;
