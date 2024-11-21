import { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { locationState, stationState, cafeState, themeState, backgroundVisible, locationVisible,
        stationVisible, cafeVisible, themeVisible, mapsLoadedState, locationCenterState } from '../recoil/atoms/locationAtom';
import styled from 'styled-components';
import MapImg from '../assets/images/locationPage/locationMap.png';
import LocationContent from '../components/location/LocationContent';
import GoogleMaps from '../components/location/map/GoogleMaps';
import LocationButton from '../assets/images/locationPage/locationButton.png';
import NoiseTexture from '../assets/images/locationPage/noiseTexture.png';

function LocationPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [isBackgroundVisible, setIsBackgroundVisible] = useRecoilState(backgroundVisible);
    const mapsLoaded = useRecoilValue(mapsLoadedState); // Google Maps API 로드 상태 확인용
    const [, setIsLocationState] = useRecoilState(locationState);
    const [, setIsStationState] = useRecoilState(stationState);
    const [, setIsCafeState] = useRecoilState(cafeState);
    const [, setIsThemeState] = useRecoilState(themeState);

    const [isLocationVisible, setIsLocationVisible] = useRecoilState(locationVisible);
    const [, setIsStationVisible] = useRecoilState(stationVisible);
    const [, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [, setIsThemeVisible] = useRecoilState(themeVisible);

    // 도시 중앙 위치 관리
    const [, setLocationCenter] = useRecoilState(locationCenterState);

    // Google Maps 로드가 완료되면, isBackgroundVisible을 업데이트
    useEffect(() => {
        if (mapsLoaded) {
            setIsBackgroundVisible(false); // 기본값을 false로 설정해 지도를 숨김
        }
    }, [mapsLoaded, setIsBackgroundVisible]);

    const handleVisibleContent = () => {
        setIsLocationState("");
        setIsStationState("");
        setIsCafeState("");
        setIsThemeState("");
        setIsVisible(true);
        setIsLocationVisible(true);
        setIsStationVisible(false);
        setIsCafeVisible(false);
        setIsThemeVisible(false);
    };

    const handleLocationState = (locationName) => {
        setIsLocationState(locationName);
        setIsLocationVisible(false);
        setIsStationVisible(true);
        setIsBackgroundVisible(true); // 위치 클릭 시 지도를 표시
        setLocationCenter({ lat: 37.5638934, lng: 126.9844558 })  // 도시 좌표 저장
    };

    return (
        <PageWrapper>
            <ImgWrapper isVisible={isVisible}>
                {/* GoogleMaps는 mapsLoaded와 isBackgroundVisible이 true일 때만 렌더링 */}
                {mapsLoaded && isBackgroundVisible ? (
                    <GoogleMaps />
                ) : (
                    <StyledMapImg src={MapImg} alt='map' isVisible={isVisible} onClick={handleVisibleContent} />
                )}
                <ContentWrapper isVisible={isVisible}>
                    <ButtonWrapper isVisible={isLocationVisible}>
                        <StyledButton>
                            {/* 2: 서울 */}
                            <Text onClick={() => handleLocationState('2')}>서울</Text>
                        </StyledButton>
                        <StyledButton>
                            <Text onClick={() => handleLocationState('수도권')}>수도권</Text>
                        </StyledButton>
                    </ButtonWrapper>
                    <LocationContent />
                </ContentWrapper>
            </ImgWrapper>
        </PageWrapper>
    );
};

export default LocationPage;

// CSS
const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const ImgWrapper = styled.div`
    width: ${(props) => (props.isVisible ? '53em' : '30em')};
    height: 38em;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 1s ease;
`;

const StyledMapImg = styled.img`
    width: 28em;
    z-index: 5;
    box-shadow: 0 0.5em 3em 0.1em black;
    transition: all 1s ease;
    cursor: pointer;
`;

const ContentWrapper = styled.div`
    margin-left: 3em;
    width: 24em;
    height: 32.88em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #353535;
    box-shadow: 0 0 1.5em 2em #353535;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
    transition: opacity 0.5s ease-in;
    transition-delay: 0.5s;
`;

const ButtonWrapper = styled.div`
     width: 100%;
    height: 100%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

const StyledButton = styled.div`
    border-radius: 0.4em;
    width: 100%;
    height: 6.2em;
    line-height: 6.2em;
    text-align: center;
    display: flex;
    background-image: url(${LocationButton});
    background-size: cover;
    font-family: 'Vitro-Core';
    font-size: 2.5em;
    color: white;
    box-shadow: 0 3px 2px #1D1D1D;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.2em);
        box-shadow: 0 0.3em 0.2em #1D1D1D;
    }
`;

const Text = styled.div`
    width: 100%;
    height: 100%;
    background-image: url(${NoiseTexture});
    background-size: cover;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
`;
