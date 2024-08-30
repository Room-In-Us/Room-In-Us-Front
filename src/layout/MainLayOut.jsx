import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import styled from "styled-components";

function MainLayOut() {
    return (
        <>
            <Header/>
            <Padding>
                <Outlet/>
            </Padding>
    
        </>
    )
}

export default MainLayOut;

// CSS
const Padding = styled.div`
    padding-top: 135px;
`;