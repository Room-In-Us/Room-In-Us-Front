import styled from "styled-components";
import { useRecoilState } from "recoil";
import { themeState, themeVisible } from "../../recoil/atoms/locationAtom";
import ArrowIcon from "../../assets/icons/locationPage/arrowIcon.svg?react";
import { themeDummy } from "./LocationDummy";
import { useNavigate } from "react-router-dom";

function ThemeArea() {
    // state 관리
    const [isThemeState, setIsThemeState] = useRecoilState(themeState);
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);

    // navigate
    const navigate = useNavigate();
    
    // 카페 선택 함수
    const handleThemeState = (theme) => {
        setIsThemeState(theme);
        setIsThemeVisible(false);
        navigate("/");
        alert("상세정보 페이지는 구현 중입니다");
    };

    return (
        <ComponentWrapper isVisible={isThemeVisible}>
            {themeDummy.map((theme) => (
                <StyledList key={theme.id} onClick={() => handleThemeState(theme.name)}>
                    <StationName>{theme.name}</StationName>
                    <StyledArrowIcon/>
                </StyledList>
            ))}
        </ComponentWrapper>
    );
}

export default ThemeArea;

// CSS
const ComponentWrapper = styled.div`
    border-radius: 0.5em;
    width: 100%;
    height: 100%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
    flex-direction: column;
    overflow: auto;
    // 스크롤
    &::-webkit-scrollbar {
        width: 5px;
        height: 8x;
        background: none;
    }
    &:hover::-webkit-scrollbar-thumb {
        border-radius: 30px;
        background-color: darkgray;
    }
`;

const StyledList = styled.div`
    border-bottom: 2px solid rgba(210, 210, 210, 0.3);
    padding: 0.4em 0.7em;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.1s ease;
    &:hover {
        background-color: rgba(0,0,0,0.2);
    }
`;

const StationName = styled.div`
    max-width: 18em;
    color: white;
    font-size: 0.9em;
    font-family: "esamanru-Light";
    cursor: pointer;
    // 말줄임표
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;

const StyledArrowIcon = styled(ArrowIcon)`
    width: 0.5em;
    cursor: pointer;
`;
