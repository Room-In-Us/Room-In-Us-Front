import styled from "styled-components";
import { useRecoilState } from "recoil";
import { cafeState, cafeVisible, themeVisible } from "../../recoil/atoms/locationAtom";

function CafeArea() {
    // state 관리
    const [isCafeState, setIsCafeState] = useRecoilState(cafeState);
    const [isCafeVisible, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);

    // 카페 선택 함수
    const handleCafeState = (cafe) => {
        setIsCafeState(cafe);
        setIsCafeVisible(false);
        setIsThemeVisible(true);
    };

    return (
        <ComponentWrapper onClick={() => handleCafeState('방탈출 단편선')} isVisible={isCafeVisible}>
            CafeArea
        </ComponentWrapper>
    )
}

export default CafeArea;

// CSS
const ComponentWrapper = styled.div`
    width: 100%;
    height: 105%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
`;