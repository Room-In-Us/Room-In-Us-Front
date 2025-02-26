import { Outlet, useLocation } from 'react-router-dom';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import styled from 'styled-components';

function MainLayOut() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <MainWrapper>
      { !isLoginPage && <Header /> }
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </MainWrapper>
  );
}

export default MainLayOut;

// CSS
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
`;
