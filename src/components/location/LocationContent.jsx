import { useRecoilState } from 'recoil';
import { locationState, stationState, stationNameState, cafeState, cafeNameState, themeState, backgroundVisible,
        stationVisible, cafeVisible, themeVisible, locationCenterState, stationCenterState } from '../../recoil/atoms/locationAtom';
import styled from 'styled-components';
import LocationBackground from '../../assets/images/locationPage/locationBackground.png';
import NoiseTexture from '../../assets/images/locationPage/noiseTexture.png';
import StationArea from './StationArea';
import CafeArea from './CafeArea';
import ThemeArea from './ThemeArea';

function LocationContent() {
    // state 관리
    const [isLocationState, ] = useRecoilState(locationState);
    const [isStationState, setIsStationState] = useRecoilState(stationState);
    const [isCafeState, setIsCafeState] = useRecoilState(cafeState);
    const [, setIsThemeState] = useRecoilState(themeState);
    
    const [isBackgroundVisible, ] = useRecoilState(backgroundVisible);
    const [, setIsStationVisible] = useRecoilState(stationVisible);
    const [, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [, setIsThemeVisible] = useRecoilState(themeVisible);

    const [stationName,] = useRecoilState(stationNameState);
    const [cafeName,] = useRecoilState(cafeNameState);

    const [, setLocationCenter] = useRecoilState(locationCenterState);
    const [stationCenter, ] = useRecoilState(stationCenterState);
    
    // 지역 화면(역 선택)으로 이동
    const handleMoveLocation = () => {
        setIsStationState("");
        setIsCafeState("");
        setIsThemeState("");
        setIsStationVisible(true);
        setIsCafeVisible(false);
        setIsThemeVisible(false);
        setLocationCenter({ lat: 37.5638934, lng: 126.9844558 })  // 도시 좌표 저장
    };
    
    // 역 화면(카페 선택)으로 이동
    const handleMoveStation = () => {
        setIsCafeState("");
        setIsThemeState("");
        setIsCafeVisible(true);
        setIsThemeVisible(false);
        setLocationCenter(stationCenter)  // 역 좌표 저장
    };

    return (
        <ComponentWrapper isVisible={isBackgroundVisible}>
            {/* 타이틀 영역 */}
            <TitleWrapper>

                {/* 지역 버튼 */}
                <TitleButton onClick={() => handleMoveLocation()} isVisible={isLocationState}>
                    <TitleText>{isLocationState === "2" ? "서울" : "수도권"}</TitleText>
                </TitleButton>
                {/* 역 버튼 */}
                <TitleButton onClick={() => handleMoveStation()} isVisible={isStationState}>
                    <TitleText>{stationName}</TitleText>
                </TitleButton>
                {/* 카페 버튼 */}
                <TitleButton isVisible={isCafeState}>
                    <TitleText>{cafeName}</TitleText>
                </TitleButton>
                
            </TitleWrapper>

            {/* 콘텐츠 영역 */}
            <ContentWrapper>

                {/* 역 영역 */}
                <StationArea />
                {/* 카페 영역 */}
                <CafeArea />
                {/* 테마 영역 */}
                <ThemeArea />

            </ContentWrapper>
        </ComponentWrapper>
    );
};


export default LocationContent;

// CSS
const ComponentWrapper = styled.div`
    padding: 1em;
    border-radius: 0.7em;
    width: 105%;
    height: 105%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
    flex-direction: column;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
    transition: all 1s ease-out;
    background-image: url(${LocationBackground});
    background-size: cover;
    box-sizing: border-box;
`;

const TitleWrapper = styled.div`
    width: 100%;
    height: 2.3em;
    line-height: 2.5em;
    text-align: center;
    display: flex;
    justify-content: space-between;
    gap: 0.7em;
`;

const TitleButton = styled.div`
    border-radius: 0.5em;
    width: 100%;
    height: 100%;
    background-color: #940000;
    box-shadow: inset 0 3px 1px 1px #7F0000;
    cursor: pointer;
    flex-grow: 1;
    transition: all 0.3s ease;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
    &:hover {
        background-color: #830000;
        box-shadow: inset 0 3px 1px 1px #770000;
    }
    // 말줄임표
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;

const TitleText = styled.div`
    padding: 0 0.3em;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-image: url(${NoiseTexture});
    background-size: cover;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-family: 'esamanru-Medium';
    font-size: 1.25em;
    // 말줄임표
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;

const ContentWrapper = styled.div`
    border-radius: 0.5em;
    margin-top: 1em;
    width: 100%;
    height: 90%;
`;
