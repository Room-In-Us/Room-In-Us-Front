import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GoogleMap, MarkerF, OverlayView } from '@react-google-maps/api';
import MarkerIcon from '../../../../shared/assets/images/location/marker.png';
import { googleMapStyles } from './googleMapStyles.js';
import {
  stationVisible,
  themeVisible,
  mapsLoadedState,
  stationLatAndLngList,
  cafeLatAndLngList,
  locationCenterState,
} from '../../model/locationAtom';
import Loading from '../../../../shared/components/Loading';

function GoogleMaps() {
  // state 관리
  const [isStationVisible] = useRecoilState(stationVisible);
  const [isThemeVisible] = useRecoilState(themeVisible);
  const mapsLoaded = useRecoilValue(mapsLoadedState); // 전역 상태로 로딩 여부 확인
  const [customIcon, setCustomIcon] = useState(null);
  // 핀으로 표시할 위도,경도 리스트 (역, 카페)
  const stationLatAndLng = useRecoilValue(stationLatAndLngList);
  const cafeLatAndLng = useRecoilValue(cafeLatAndLngList);
  // 중앙 좌표
  const locationCenter = useRecoilValue(locationCenterState);

  // 지도 사이즈
  const containerStyle = {
    width: '26em',
    height: '35em',
  };

  const options = {
    styles: googleMapStyles, // 커스텀 ui
    zoomControl: true, // 확대 축소 버튼
    disableDefaultUI: true, // 기본 설정 초기화
  };

  useEffect(() => {
    if (mapsLoaded) {
      // API가 로드된 경우에만 아이콘 설정
      setCustomIcon({
        url: MarkerIcon,
        scaledSize: new window.google.maps.Size(50, 50),
      });
    }
  }, [mapsLoaded]);

  if (!mapsLoaded) return <Loading />; // API 로딩 중 상태 표시

  // Zoom 레벨 설정
  const zoomLevel = isThemeVisible ? 16 : isStationVisible ? 12 : 14;

  const latAndLngList = isStationVisible ? stationLatAndLng : cafeLatAndLng;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={locationCenter} zoom={zoomLevel} options={options}>
      {latAndLngList.map((location, index) => (
        <div key={index}>
          <MarkerF position={{ lat: location.lat, lng: location.lng }} icon={customIcon} />
          {!isStationVisible && (
            <OverlayView
              position={{ lat: location.lat, lng: location.lng }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CafeNameBox>
                <CafeNameText>{location.name}</CafeNameText>
              </CafeNameBox>
            </OverlayView>
          )}
        </div>
      ))}
    </GoogleMap>
  );
}

export default GoogleMaps;

// CSS
const CafeNameBox = styled.div`
  border: 1px solid white;
  border-radius: 5px;
  padding: 0.2em 0.7em;
  width: 8em;
  height: 2.5em;
  background-color: #333333;
  position: absolute;
  transform: translate(-50%, 20%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CafeNameText = styled.div`
  color: white;
  text-align: center;
  line-height: 1em;
  overflow: hidden;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
`;
