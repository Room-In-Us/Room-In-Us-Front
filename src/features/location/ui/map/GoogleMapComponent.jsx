import styled from 'styled-components';
import { GoogleMap, MarkerF, OverlayView } from '@react-google-maps/api';
import { googleMapStyles } from './googleMapStyles.js';
import MarkerIcon from "../../../../shared/assets/images/location/marker.png";

function GoogleMapComponent() {
  // 지도 사이즈
  const containerStyle = {
    width: '100%',
    height: '100%',
  };

  const options = {
    styles: googleMapStyles, // 커스텀 ui
    zoomControl: true, // 확대 축소 버튼
    disableDefaultUI: true, // 기본 설정 초기화
  };

  // 표시될 위치(위도, 경도)
  const center = {
    lat: 37.5642135,
    lng: 127.0016985
  };

  // Zoom 레벨 설정
  const zoomLevel = 12;

  return (
      <MapWrapper>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoomLevel}
          options={options}
        >
          <MarkerF
            position={center}
            icon={{
              url: MarkerIcon,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
          <OverlayView
            position={center}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div>
              
            </div>
          </OverlayView>
        </GoogleMap>
      </MapWrapper>
  )
}

export default GoogleMapComponent;

// CSS
const MapWrapper = styled.div`
  width: 100vw;
  height: calc(100vh - 5.625rem - 2.375rem); // 100vh-헤더-풋터
  position: absolute;
`;