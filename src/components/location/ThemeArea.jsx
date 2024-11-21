import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { cafeState, themeState, themeVisible } from "../../recoil/atoms/locationAtom";
import ArrowIcon from "../../assets/icons/locationPage/arrowIcon.svg?react";
import { useNavigate } from "react-router-dom";
import { getLocationListAPI } from "../../apis/theme/getLocationListAPI";

function ThemeArea() {
    // state 관리
    const [, setIsThemeState] = useRecoilState(themeState);
    const [isThemeVisible, setIsThemeVisible] = useRecoilState(themeVisible);
    const [isCafeState,] = useRecoilState(cafeState);  // 파라미터(value)
    const [category,] = useState('Point');  // 파라미터(category)
    const [page,] = useState('1');  // 파라미터(page)
    const [contents, setContents] = useState([]);  // 리스트

    // navigate
    const navigate = useNavigate();
    
    // 테마 선택 함수
    const handleThemeState = (theme) => {
        setIsThemeState(theme);
        setIsThemeVisible(false);
        navigate("/");
        alert("상세정보 페이지는 구현 중입니다");
    };

    // 테마 리스트 불러오기
    useEffect(() => {
        const fetchThemeList = async () => {
            try {
                const response = await getLocationListAPI(category, isCafeState, page);
                console.log('받은 데이터:', response);
                setContents(response.contents);  // 방탈출별 테마 리스트
            } catch (error) {
                console.error('테마 목록 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchThemeList();
    }, [category, isCafeState, page]);

    return (
        <ComponentWrapper isVisible={isThemeVisible}>
            {contents.map((theme) => (
                <StyledList key={theme.id} onClick={() => handleThemeState(theme.id)}>
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
