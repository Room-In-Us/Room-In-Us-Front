import styled from "styled-components";
import { useRecoilState } from "recoil";
import { stationState, stationVisible, cafeVisible } from "../../recoil/atoms/locationAtom";

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
        <ComponentWrapper onClick={() => handleStationState('가좌역')} isVisible={isStationVisible}>
            StationArea
        </ComponentWrapper>
    );
};

export default StationArea;

// CSS
const ComponentWrapper = styled.div`
    width: 100%;
    height: 105%;
    display: ${(props) => (props.isVisible ? 'flex' : 'none')};
`;
