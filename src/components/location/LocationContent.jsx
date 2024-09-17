import { useRecoilState, useRecoilValue } from 'recoil';
import { locationState, initialState, stationState, cafeState, themeState, backgroundVisible,
        initialVisible, stationVisible, cafeVisible, themeVisible } from '../../recoil/atoms/locationAtom';
import { initialAndStationVisible } from '../../recoil/selectors/locationSelector';
import styled from 'styled-components';
import InitialBackground from '../../assets/images/locationPage/initialBackground.png';
import NoiseTexture from '../../assets/images/locationPage/noiseTexture.png';
import InitialArea from './InitialArea';
import StationArea from './StationArea';
import CafeArea from './CafeArea';
import ThemeArea from './ThemeArea';

function LocationContent() {
    // state 관리
    const [isLocationState, setIsLocationState] = useRecoilState(locationState);
    const [isInitialState, setIsInitialState] = useRecoilState(initialState);
    const [isStationState, setIsStationState] = useRecoilState(stationState);
    const [isCafeState, setIsCafeState] = useRecoilState(cafeState);
    const [isThemeState, setIsThemeState] = useRecoilState(themeState);
    
    const [isBackgroundVisible, setIsBackgroundVisible] = useRecoilState(backgroundVisible);
    const [isInitialVisible, setIsInitialVisible] = useRecoilState(initialVisible);
    const [isStationVisible, setIsStationVisible] = useRecoilState(stationVisible);
    const [isCafeVisible, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);

    // 초성, 역이름 버튼 텍스트
    const initialAndStationState = useRecoilValue(initialAndStationVisible);
    
    // 초성 화면로 이동
    const handleMoveInitial = () => {
        setIsInitialState("");
        setIsStationState("");
        setIsCafeState("");
        setIsThemeState("");
        setIsInitialVisible(true);
        setIsStationVisible(false);
        setIsCafeVisible(false);
        setIsThemeVisible(false);
    };
    
    // 역이름, 카페이름 화면로 이동
    const handleMoveStation = () => {
        if (isCafeState) {
            setIsCafeState("");
            setIsThemeState("");
            setIsCafeVisible(true);
            setIsThemeVisible(false);
        } else {
            setIsStationState("");
            setIsCafeState("");
            setIsThemeState("");
            setIsStationVisible(true);
            setIsCafeVisible(false);
            setIsThemeVisible(false);
        }
    };

    
    return (
        <ComponentWrapper isVisible={isBackgroundVisible}>
            {/* 타이틀 영역 */}
            <TitleWrapper>

                {/* 지역 버튼 */}
                <TitleButton onClick={() => handleMoveInitial()} isVisible={isLocationState}>
                    <TitleText>{isLocationState}</TitleText>
                </TitleButton>
                {/* 초성, 역 버튼 */}
                <TitleButton onClick={() => handleMoveStation()} isVisible={isInitialState}>
                    <TitleText>{initialAndStationState}</TitleText>
                </TitleButton>
                {/* 카페 버튼 */}
                <TitleButton isVisible={isCafeState}>
                    <TitleText>{isCafeState}</TitleText>
                </TitleButton>
                
            </TitleWrapper>

            {/* 콘텐츠 영역 */}
            <ContentWrapper>

                {/* 초성 영역 */}
                <InitialArea />
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
    width: 100%;
    height: 105%;
    display: ${(props) => (props.isVisible ? 'inline-block' : 'none')};
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
    background-image: url(${InitialBackground});
    background-size: cover;
`;
