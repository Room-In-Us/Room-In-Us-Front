import MyMap from './MyMap';
import { Container as MapDiv } from 'react-naver-maps';

const NaverMapContainer = () => {
    return (
        <MapDiv style={{ width: '28em', height: '100%' }}>
            <MyMap />
        </MapDiv>

    )
}

export default NaverMapContainer;