import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { stationState, cafeState, cafeVisible, cafeNameState, themeVisible, cafeLatAndLngList } from "../../recoil/atoms/locationAtom";
import ArrowIcon from "../../assets/icons/locationPage/arrowIcon.svg?react";
import { getLocationListAPI } from "../../apis/theme/getLocationListAPI";

function CafeArea() {
    // state 관리
    const [, setIsCafeState] = useRecoilState(cafeState);
    const [isCafeVisible, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [, setIsThemeVisible] = useRecoilState(themeVisible);
    const [isStationState,] = useRecoilState(stationState);  // 파라미터(value)
    const [category,] = useState('Station');  // 파라미터(category)
    const [page,] = useState('1');  // 파라미터(page)
    const [contents, setContents] = useState([]);  // 리스트

    const [, setCafeName] = useRecoilState(cafeNameState);

    const [, setLatAndLngList] = useRecoilState(cafeLatAndLngList);

    // 카페 선택 함수
    const handleCafeState = (cafe) => {
        setIsCafeState(cafe.id);  // 방탈출 id 저장
        setCafeName(cafe.name);  // 방탈출 이름 저장
        setIsCafeVisible(false);
        setIsThemeVisible(true);
    };

    // 방탈출 리스트 불러오기
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response = await getLocationListAPI(category, isStationState, page);
                console.log('받은 데이터:', response);
                setContents(response.contents);  // 역별 방탈출 리스트

                // 카페의 위도,경도 리스트 저장
                const latAndLng = response.contents.map(station => ({
                    lat: station.latitude,
                    lng: station.longitude
                }));
                setLatAndLngList(latAndLng); // Recoil 상태에 저장
            } catch (error) {
                console.error('카페 목록 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchStudies();
    }, [category, isStationState, page, setLatAndLngList]);
    
    return (
        <ComponentWrapper isVisible={isCafeVisible}>
            {contents.map((cafe) => (
                <StyledList key={cafe.id} onClick={() => handleCafeState(cafe)}>
                    <StationName>{cafe.name}</StationName>
                    <StyledArrowIcon/>
                </StyledList>
            ))}
        </ComponentWrapper>
    );
}

export default CafeArea;

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
