import { Outlet, useLocation } from 'react-router-dom';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';
import styled from 'styled-components';
import useDevice from '../shared/hooks/useDevice';

function MainLayOut() {
  const location = useLocation();
  const { isMobile } = useDevice();
  const authPages = ['/login', '/signup', '/survey'];
  const isAuthPage = authPages.includes(location.pathname);
  const termsPages = ['/terms', '/privacy'];
  const isTermsPage = termsPages.includes(location.pathname);
  const landingPages = ['/landing'];
  const isLandingPage = landingPages.includes(location.pathname);

  return (
    <MainWrapper>
      {!(isAuthPage && !isMobile) && !isTermsPage && <Header />}
      <ContentWrapper hasMarginBottom={isAuthPage || isLandingPage}>
        <Outlet />
      </ContentWrapper>
      {!isMobile && !isTermsPage && !isLandingPage && <Footer />}
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
  margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? '0' : '3rem')};
  flex-grow: 1;
`;
