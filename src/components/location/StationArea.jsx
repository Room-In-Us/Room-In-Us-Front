import styled from "styled-components";
import { useRecoilState } from "recoil";
import { stationState, stationVisible, cafeVisible } from "../../recoil/atoms/locationAtom";
import ArrowIcon from "../../assets/icons/locationPage/arrowIcon.svg?react";
import { stationDummy } from "./LocationDummy";

function StationArea() {
    // state 관리
    const [isStationState, setIsStationState] = useRecoilState(stationState);
    const [isStationVisible, setIsStationVisible] = useRecoilState(stationVisible);
    const [isCafeVisible, setIsCafeVisible] = useRecoilState(cafeVisible);
    
    // 역 선택 함수
    const handleStationState = (station) => {
        setIsStationState(station);
        setIsStationVisible(false);
        setIsCafeVisible(true);
    };
    
    return (
        <ComponentWrapper isVisible={isStationVisible}>
            {stationDummy.map((station) => (
                <StyledList key={station.id}>
                    <StationName onClick={() => handleStationState(station.name)}>{station.name}</StationName>
                    <StyledArrowIcon onClick={() => handleStationState(station.name)}/>
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
