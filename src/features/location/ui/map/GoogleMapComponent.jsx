import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { storeLatAndLngList, centerLatAndLng, zoomLevel } from '../../model/locationAtom.jsx';
import { GoogleMap, MarkerF, OverlayView } from '@react-google-maps/api';
import { googleMapStyles } from './googleMapStyles.js';
import MarkerIcon from "../../../../shared/assets/images/location/marker.png";

function GoogleMapComponent() {
  // 중앙 좌표
  const centerState = useRecoilValue(centerLatAndLng);
  // 매장 리스트
  const storeList = useRecoilValue(storeLatAndLngList);
  // 줌 레벨
  const zoomLevelState = useRecoilValue(zoomLevel);

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

  return (
      <MapWrapper>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={centerState}
          zoom={zoomLevelState}
          options={options}
        >
          {
            storeList.map((store, index) => (
              <div key={index}>
                <MarkerF
                  position={{ lat: store.latitude, lng: store.longitude }}
                  icon={{
                    url: MarkerIcon,
                    scaledSize: new window.google.maps.Size(50, 50),
                  }}
                />
                <OverlayView
                  position={{ lat: store.latitude, lng: store.longitude }}
                  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                  <CafeNameBox>
                    <CafeNameText>{store.storeName}</CafeNameText>
                  </CafeNameBox>
                </OverlayView>
              </div>
            ))
          }
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
