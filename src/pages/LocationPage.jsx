import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { locationState, initialState, stationState, cafeState, themeState, backgroundVisible,
        locationVisible, initialVisible, stationVisible, cafeVisible, themeVisible } from '../recoil/atoms/locationAtom';
import styled from 'styled-components';
import MapImg from '../assets/images/locationPage/locationMap.png';
import RectangleImg from '../assets/images/locationPage/spotRectangle.png';
import SquareImg1 from '../assets/images/locationPage/spotSquare1.png';
import SquareImg2 from '../assets/images/locationPage/spotSquare2.png';
import NoiseTexture from '../assets/images/locationPage/noiseTexture.png';
import LocationContent from '../components/location/LocationContent';

function LocationPage() {
    // state 관리
    const [isVisible, setIsVisible] = useState(false);
    const [isLocationState, setIsLocationState] = useRecoilState(locationState);
    const [isInitialState, setIsInitialState] = useRecoilState(initialState);
    const [isStationState, setIsStationState] = useRecoilState(stationState);
    const [isCafeState, setIsCafeState] = useRecoilState(cafeState);
    const [isThemeState, setIsThemeState] = useRecoilState(themeState);

    const [isBackgroundVisible, setIsBackgroundVisible] = useRecoilState(backgroundVisible);
    const [isLocationVisible, setIsLocationVisible] = useRecoilState(locationVisible);
    const [isInitialVisible, setIsInitialVisible] = useRecoilState(initialVisible);
    const [isStationVisible, setIsStationVisible] = useRecoilState(stationVisible);
    const [isCafeVisible, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);

    // 내용 나타내기 + 처음으로 이동
    const handleVisibleContent = () => {
        setIsLocationState("");
        setIsInitialState("");
        setIsStationState("");
        setIsCafeState("");
        setIsThemeState("");
        setIsVisible(true);
        setIsBackgroundVisible(false);
        setIsLocationVisible(true);
        setIsInitialVisible(false);
        setIsStationVisible(false);
        setIsCafeVisible(false);
        setIsThemeVisible(false);
    };
    
    // 지역 선택 함수
    const handleLocationState = (locationName) => {
        setIsLocationState(locationName);
        setIsLocationVisible(false);
        setIsInitialVisible(true);
        setIsBackgroundVisible(true);
    };
    
    return (
        <PageWrapper>
            <ImgWrapper isVisible={isVisible}>
                {/* 지도 이미지 영역 */}
                <StyledMapImg src={MapImg} alt='map' isVisible={isVisible} onClick={() => handleVisibleContent()} />

                {/* 콘텐츠 영역 */}
                <ContentWrapper isVisible={isVisible}>
                    <ButtonWrapper isVisible={isLocationVisible}>

                        {/* 지역별 선택 화면 */}
                        <RectangleButton>
                            <Text onClick={()=>handleLocationState('서울/수도권')}>
                                서울/수도권
                            </Text>
                        </RectangleButton>
                        <SquareButtonLeft1>
                            <Text onClick={()=>handleLocationState('전라')}>
                                전라
                            </Text>
                        </SquareButtonLeft1>
                        <SquareButtonRight1>
                            <Text onClick={()=>handleLocationState('충청')}>
                                충청
                            </Text>
                        </SquareButtonRight1>
                        <SquareButtonLeft2>
                            <Text onClick={()=>handleLocationState('경북')}>
                                경북
                            </Text>
                        </SquareButtonLeft2>
                        <SquareButtonRight2>
                            <Text onClick={()=>handleLocationState('경남')}>
                                경남
                            </Text>
                        </SquareButtonRight2>
                    </ButtonWrapper>

                    {/* 지역 이름 초성 화면 */}
                    <LocationContent/>
                    
                </ContentWrapper>
            </ImgWrapper>
        </PageWrapper>
    );
};

export default LocationPage;

//CSS
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
    width: ${(props) => (props.isVisible ? '24em' : 0)};
    height: 32.88em;
    display: flex;
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
    display: ${(props) => (props.isVisible ? 'inline-block' : 'none')};
`;

const RectangleButton = styled.div`
    margin-bottom: 0.8em;
    border-radius: 0.4em;
    width: 100%;
    height: 3.8em;
    line-height: 3.8em;
    text-align: center;
    display: inline-block;
    background-image: url(${RectangleImg});
    background-size: cover;
    font-family: 'Vitro-Core';
    font-size: 2.5em;
    color: white;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.1em);
        box-shadow: 0 0.1em 0.1em #322F35;
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

const SquareButtonLeft1 = styled.div`
    margin-bottom: 0.8em;
    border-radius: 0.4em;
    width: 48%;
    height: 3.8em;
    line-height: 3.8em;
    text-align: center;
    display: inline-block;
    float: left;
    background-image: url(${SquareImg1});
    background-size: cover;
    font-family: 'Vitro-Core';
    font-size: 2.5em;
    color: white;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.2em);
        box-shadow: 0 0.1em 0.1em #322F35;
    }
`;

const SquareButtonRight1 = styled.div`
    margin-bottom: 0.8em;
    border-radius: 0.4em;
    width: 48%;
    height: 3.8em;
    line-height: 3.8em;
    text-align: center;
    display: inline-block;
    float: right;
    background-image: url(${SquareImg1});
    background-size: cover;
    font-family: 'Vitro-Core';
    font-size: 2.5em;
    color: white;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.2em);
        box-shadow: 0 0.1em 0.1em #322F35;
    }
`;

const SquareButtonLeft2 = styled.div`
    margin-bottom: 0.8em;
    border-radius: 0.4em;
    width: 48%;
    height: 3.8em;
    line-height: 3.8em;
    text-align: center;
    display: inline-block;
    float: left;
    background-image: url(${SquareImg2});
    background-size: cover;
    font-family: 'Vitro-Core';
    font-size: 2.5em;
    color: white;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.2em);
        box-shadow: 0 0.1em 0.1em #322F35;
    }
`;

const SquareButtonRight2 = styled.div`
    margin-bottom: 0.8em;
    border-radius: 0.4em;
    width: 48%;
    height: 3.8em;
    line-height: 3.8em;
    text-align: center;
    display: inline-block;
    float: right;
    background-image: url(${SquareImg2});
    background-size: cover;
    font-family: 'Vitro-Core';
    font-size: 2.5em;
    color: white;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.2em);
        box-shadow: 0 0.1em 0.1em #322F35;
    }
`;
