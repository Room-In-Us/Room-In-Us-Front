import { useRecoilState } from 'recoil';
import { initialState, stationState, cafeState, themeState,
        initialVisible, stationVisible, cafeVisible, themeVisible } from '../../recoil/atoms/locationAtom';
import styled from "styled-components";
import NoiseTexture from '../../assets/images/locationPage/noiseTexture.png';
import Pettern1 from '../../assets/images/locationPage/pettern1.png';
import Pettern2 from '../../assets/images/locationPage/pettern2.png';
import Pettern3 from '../../assets/images/locationPage/pettern3.png';
import Pettern4 from '../../assets/images/locationPage/pettern4.png';
import Pettern5 from '../../assets/images/locationPage/pettern5.png';
import Pettern6 from '../../assets/images/locationPage/pettern6.png';
import Pettern7 from '../../assets/images/locationPage/pettern7.png';
import Pettern8 from '../../assets/images/locationPage/pettern8.png';

function InitialArea() {
    // state 관리
    const [isInitialState, setIsInitialState] = useRecoilState(initialState);
    const [isStationState, setIsStationState] = useRecoilState(stationState);
    const [isCafeState, setIsCafeState] = useRecoilState(cafeState);
    const [isThemeState, setIsThemeState] = useRecoilState(themeState);
    
    const [isInitialVisible, setIsInitialVisible] = useRecoilState(initialVisible);
    const [isStationVisible, setIsStationVisible] = useRecoilState(stationVisible);
    const [isCafeVisible, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);
    
    // 초성 선택 함수
    const handleInitialState = (initial) => {
        setIsInitialState(initial);
        setIsInitialVisible(false);
        setIsStationVisible(true);
    };

    return (
        <ComponentWrapper isVisible={isInitialVisible}>
            <Button1 onClick={() => handleInitialState('ㄱ')}>
                <Text>ㄱ</Text>
            </Button1>
            <Button1 onClick={() => handleInitialState('ㄴ')}>
                <Text>ㄴ</Text>
            </Button1>
            <Button1 onClick={() => handleInitialState('ㄷ')}>
                <Text>ㄷ</Text>
            </Button1>
            <Button2 onClick={() => handleInitialState('ㄹ,ㅁ')}>
                <Text>ㄹ,ㅁ</Text>
            </Button2>
            <Button3 onClick={() => handleInitialState('ㅂ')}>
                <Text>ㅂ</Text>
            </Button3>
            <Button4 onClick={() => handleInitialState('ㅅ')}>
                <Text>ㅅ</Text>
            </Button4>
            <Button5 onClick={() => handleInitialState('ㅇ')}>
                <Text>ㅇ</Text>
            </Button5>
            <Button6 onClick={() => handleInitialState('ㅈ')}>
                <Text>ㅈ</Text>
            </Button6>
            <Button7 onClick={() => handleInitialState('ㅊ,ㅋ,ㅌ')}>
                <Text>ㅊ,ㅋ,ㅌ</Text>
            </Button7>
            <Button8 onClick={() => handleInitialState('ㅍ,ㅎ')}>
                <Text>ㅍ,ㅎ</Text>
            </Button8>
        </ComponentWrapper>
    );
};

export default InitialArea;

// CSS
const ComponentWrapper = styled.div`
    padding: 1.5em 0;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`;

const Button1 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern1});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button2 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern2});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button3 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern3});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button4 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern4});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button5 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern5});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button6 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern6});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button7 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern7});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
    }
`;
const Button8 = styled.div`
    margin: 0.5em;
    border-radius: 1em;
    width: 10em;
    height: 4em;
    line-height: 4.5em;
    text-align: center;
    display: inline-block;
    background-image: url(${Pettern8});
    background-size: cover;
    box-shadow: 0 3px 2px #322F35;
    cursor: pointer;
    transition: all 0.3s ease;
    &:hover {
        transform: translateY(-0.5em);
        box-shadow: 0 0.5em 0.5em #322F35;
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
    font-family: 'Vitro-Core';
    font-size: 2.3em;
`;