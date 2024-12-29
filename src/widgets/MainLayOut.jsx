import { Outlet } from "react-router-dom";
import Header from "../shared/components/Header";
import styled from "styled-components";

function MainLayOut() {
    return (
        <>
            <Header/>
            <ContentWrapper>
                <Outlet/>
            </ContentWrapper>
    
        </>
    )
}

export default MainLayOut;

// CSS
const ContentWrapper = styled.div`
    padding-top: 6em;
`;