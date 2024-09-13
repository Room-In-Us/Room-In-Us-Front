import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import InitialBackground from '../../assets/images/locationPage/initialBackground.png';
import NoiseTexture from '../../assets/images/locationPage/noiseTexture.png';
import InitialArea from '../location/InitialArea';

function LocationContent({ isLocationState }) {
    // state 관리
    const [isInitialState, setIsInitialState] = useState("");
    
    // 초성 값 업데이트 함수
    const handleInitialChange = (initial) => {
        setIsInitialState(initial);  // 하위 컴포넌트에서 선택된 값을 업데이트
    };

    // 지역 단위로 이동 함수
    const handleMoveLocation = () => {
        setIsInitialState("");
    };
    
    return (
        <ComponentWrapper isLocationState={isLocationState}>
            {/* 타이틀 영역 */}
            <TitleWrapper>
                {/* 지역 단위 */}
                <LocationNameWrapper onClick={() => handleMoveLocation()}>
                    <LocationName>{isLocationState}</LocationName>
                </LocationNameWrapper>
                {/* 초성 단위 */}
                <InitialWrapper isInitialState={isInitialState}>
                    <LocationName>{isInitialState}</LocationName>
                </InitialWrapper>
                {/* 역 단위 */}
                
            </TitleWrapper>

            {/* 콘텐츠 영역 */}
            <ContentWrapper>
                {/* 초성 영역 */}
                <InitialArea handleInitialChange={handleInitialChange} />
                {/* 역 영역 */}

                {/* 방탈출 영역 */}

            </ContentWrapper>
        </ComponentWrapper>
    );
};

// ESLint 경고 방지를 위한 PropTypes 검증
LocationContent.propTypes = {
    isLocationState: PropTypes.string.isRequired,
};

export default LocationContent;

// CSS
const ComponentWrapper = styled.div`
    width: 100%;
    height: 105%;
    display: ${(props) => (props.isLocationState ? 'inline-block' : 'none')};
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

const LocationNameWrapper = styled.div`
    border-radius: 0.5em;
    width: 100%;
    height: 100%;
    background-color: #940000;
    box-shadow: inset 0 3px 1px 1px #7F0000;
    cursor: pointer;
    flex-grow: 1;
    transition: all 0.3s ease;
    // 말줄임표
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;

const LocationName = styled.div`
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

const InitialWrapper = styled.div`
    border-radius: 0.5em;
    width: 100%;
    height: 100%;
    background-color: #940000;
    box-shadow: inset 0 3px 1px 1px #7F0000;
    cursor: pointer;
    flex-grow: 1;
    transition: all 0.3s ease;
    display: ${(props) => (props.isInitialState ? 'flex' : 'none')};
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
