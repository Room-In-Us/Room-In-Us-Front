import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { locationState, stationState, stationVisible, cafeVisible } from "../../recoil/atoms/locationAtom";
import ArrowIcon from "../../assets/icons/locationPage/arrowIcon.svg?react";
import { getLocationListAPI } from "../../apis/theme/getLocationListAPI";

function StationArea() {
    // state 관리
    const [, setIsStationState] = useRecoilState(stationState);
    const [isStationVisible, setIsStationVisible] = useRecoilState(stationVisible);
    const [, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [isLocationState, ] = useRecoilState(locationState);  // 파라미터(value)
    const [category,] = useState('City');  // 파라미터(category)
    const [page,] = useState('1');  // 파라미터(page)
    const [contents, setContents] = useState([]);  // 리스트
    
    // 역 선택 함수
    const handleStationState = (station) => {
        setIsStationState(station);  // 역 id 저장
        setIsStationVisible(false);
        setIsCafeVisible(true);
    };

    // 지역 리스트 불러오기
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response = await getLocationListAPI(category, isLocationState, page);
                console.log('받은 데이터:', response);
                setContents(response.contents);  // 지역별 역 리스트
            } catch (error) {
                console.error('카페 목록 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchStudies();
    }, [category, isLocationState, page]);
    
    return (
        <ComponentWrapper isVisible={isStationVisible}>
            {contents.map((station) => (
                <StyledList key={station.id} onClick={() => handleStationState(station.id)}>
                    <StationName>{station.name}</StationName>
                    <StyledArrowIcon/>
                </StyledList>
            ))}
        </ComponentWrapper>
    );
};

export default StationArea;

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
    // 말줄임표
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
`;

const StyledArrowIcon = styled(ArrowIcon)`
    width: 0.5em;
`;
