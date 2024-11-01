import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { stationState, stationVisible, cafeVisible } from "../../recoil/atoms/locationAtom";
import ArrowIcon from "../../assets/icons/locationPage/arrowIcon.svg?react";
import { getStationListAPI } from "../../apis/theme/getLocationListAPI";

function StationArea() {
    // state 관리
    const [, setIsStationState] = useRecoilState(stationState);
    const [isStationVisible, setIsStationVisible] = useRecoilState(stationVisible);
    const [, setIsCafeVisible] = useRecoilState(cafeVisible);
    const [stationList, setStationList] = useState([]);
    
    // 역 선택 함수
    const handleStationState = (station) => {
        setIsStationState(station);
        setIsStationVisible(false);
        setIsCafeVisible(true);
    };

    // 방탈출 정보 불러오기
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response = await getStationListAPI();
                console.log('받은 데이터:', response);
                setStationList(response.stationList);  // 역 리스트
            } catch (error) {
                console.error('카페 목록 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchStudies();
    }, []);
    
    return (
        <ComponentWrapper isVisible={isStationVisible}>
            {stationList.map((station) => (
                <StyledList key={station.stationId} onClick={() => handleStationState(station.station)}>
                    <StationName>{station.station}</StationName>
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
