import styled from "styled-components";
import { useRecoilState } from "recoil";
import { themeVisible } from "../../recoil/atoms/locationAtom";

function ThemeArea() {
    // state 관리
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);

    return (
        <ComponentWrapper isVisible={isThemeVisible}>
            ThemeArea
        </ComponentWrapper>
    )
}

export default ThemeArea;

// CSS
const ComponentWrapper = styled.div`
    width: 100%;
    height: 105%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
`;