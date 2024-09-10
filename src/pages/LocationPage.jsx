import React, { useState } from 'react';
import styled from 'styled-components';
import MapImg from '../assets/images/locationPage/locationMap.png';
import RectangleImg from '../assets/images/locationPage/spotRectangle.png';
import SquareImg1 from '../assets/images/locationPage/spotSquare1.png';
import SquareImg2 from '../assets/images/locationPage/spotSquare2.png';
import NoiseTexture from '../assets/images/locationPage/noiseTexture.png';

function LocationPage() {
    // state 관리
    const [isVisible, setIsVisible] = useState(false);

    // 내용 나타내기 함수
    const handleVisibleContent = () => {
        setIsVisible(true);
    };
    
    return (
        <PageWrapper>
            <ImgWrapper isVisible={isVisible}>
                {/* 지도 이미지 영역 */}
                <StyledMapImg src={MapImg} alt='map' isVisible={isVisible} onClick={handleVisibleContent} />

                {/* 콘텐츠 영역 */}
                <ContentWrapper isVisible={isVisible}>
                    <ButtonWrapper>
                        <RectangleButton>
                            <Text>
                                서울/수도권
                            </Text>
                        </RectangleButton>
                        <SquareButtonLeft1>
                            <Text>
                                전라
                            </Text>
                        </SquareButtonLeft1>
                        <SquareButtonRight1>
                            <Text>
                                충청
                            </Text>
                        </SquareButtonRight1>
                        <SquareButtonLeft2>
                            <Text>
                                경북
                            </Text>
                        </SquareButtonLeft2>
                        <SquareButtonRight2>
                            <Text>
                                경남
                            </Text>
                        </SquareButtonRight2>
                    </ButtonWrapper>
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
    cursor: ${(props) => (props.isVisible ? 'normal' : 'pointer')};
`;

const ContentWrapper = styled.div`
    margin-left: 3em;
    width: ${(props) => (props.isVisible ? '24em' : 0)};
    height: 32.88em;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #393939;
    box-shadow: 0 0 1.5em 2em #393939;
    opacity: ${(props) => (props.isVisible ? 1 : 0)};
    transition: opacity 0.5s ease-in;
    transition-delay: 0.5s;
`;

const ButtonWrapper = styled.div`
    width: 100%;
    height: 100%;
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
`;