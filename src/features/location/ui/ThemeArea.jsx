import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { cafeState, themeVisible } from "../model/locationAtom";
import { getLocationListAPI } from "../api/getLocationListAPI";
import ThemeInfo from "./ThemeInfo";

function ThemeArea() {
    // state 관리
    const [isThemeVisible,] = useRecoilState(themeVisible);
    const [isCafeState,] = useRecoilState(cafeState);  // 파라미터(value)
    const [category,] = useState('Point');  // 파라미터(category)
    const [page,] = useState('1');  // 파라미터(page)
    const [contents, setContents] = useState([]);  // 리스트

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
                // <StyledList key={theme.id} onClick={() => handleThemeState(theme.id)}>
                //     <StationName>{theme.name}</StationName>
                //     <StyledArrowIcon/>
                // </StyledList>
                <ThemeInfo key={theme.id} themeId={theme.id}/>
            ))}
        </ComponentWrapper>
    );
}

export default ThemeArea;

// CSS
const ComponentWrapper = styled.div`
    border-radius: 0.5em;
    width: 100%;
    height: 27em;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
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