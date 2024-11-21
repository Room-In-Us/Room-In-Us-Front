import { useState, useEffect } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { locationState, stationState, stationVisible, stationNameState, cafeVisible,
        stationLatAndLngList, locationCenterState, stationCenterState } from "../../recoil/atoms/locationAtom";
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

    // 역 위도, 경도, 중앙 위치 관리
    const [, setStationName] = useRecoilState(stationNameState);
    const [, setLatAndLngList] = useRecoilState(stationLatAndLngList);
    const [, setLocationCenter] = useRecoilState(locationCenterState);
    const [, setStationCenter] = useRecoilState(stationCenterState);
    
    // 역 선택 함수
    const handleStationState = (station) => {
        setIsStationState(station.id);  // 역 id 저장
        setStationName(station.name);  // 역 이름 저장
        setIsStationVisible(false);
        setIsCafeVisible(true);
        setLocationCenter({ lat: station.latitude, lng: station.longitude })  // 역 좌표 저장
        setStationCenter({ lat: station.latitude, lng: station.longitude })  // 역 좌표 저장
    };

    // 역 리스트 불러오기
    useEffect(() => {
        const fetchStationList = async () => {
            try {
                const response = await getLocationListAPI(category, isLocationState, page);
                console.log('받은 데이터:', response);
                setContents(response.contents);  // 지역별 역 리스트

                // 역의 위도,경도 리스트 저장
                const latAndLng = response.contents.map(station => ({
                    lat: station.latitude,
                    lng: station.longitude,
                }));
                setLatAndLngList(latAndLng); // Recoil 상태에 저장
            } catch (error) {
                console.error('역 목록 데이터를 불러오는 중 오류 발생:', error);
            }
        };
        fetchStationList();
    }, [category, isLocationState, page, setLatAndLngList]);
    
    return (
        <ComponentWrapper isVisible={isStationVisible}>
            {contents.map((station) => (
                <StyledList key={station.id} onClick={() => handleStationState(station)}>
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
