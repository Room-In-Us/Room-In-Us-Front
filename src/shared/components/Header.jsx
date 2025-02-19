import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useDevice from '../../shared/hooks/useDevice';
import MenuIcon from '../../shared/assets/icons/common/menuIcon.svg?react';
import CancelIcon from '../../shared/assets/icons/common/cancelIcon.svg?react';
import LogoIcon from '../../shared/assets/icons/common/logo.svg?react';
import LoginIcon from '../../shared/assets/icons/common/loginIcon.svg?react';
import ProfileIcon from '../../shared/assets/icons/common/profileIcon.svg?react';
import { getAccessToken } from '../../app/API';
import SearchInput from './SearchInput';
import HeaderProfileModal from './HeaderProfileModal';

function Header() {
  // state 관리
  const [isVisibleProfile, setIsVisibleProfile] = useState(false);
  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

  // navigate, location
  const navigate = useNavigate();
  const location = useLocation();

  // 페이지 이동
  const handleNavigation = (path) => {
    navigate(path);
    setIsVisibleMenu(false);
  };

  // 반응형 함수
  const { isDesktop, isTablet, isMobile } = useDevice();

  // 메뉴 열고 닫기
  const handleMenu = () => {
    setIsVisibleMenu(!isVisibleMenu);
  };

  // 화면 크기가 변경 시 메뉴를 닫기
  useEffect(() => {
    if (!isMobile) {
      setIsVisibleMenu(false);
    }
  }, [isMobile, isTablet, isDesktop]);

  // 메뉴바 참조를 위한 ref
  const menuRef = useRef(null);

  // 메뉴바 외부 클릭 시 메뉴를 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsVisibleMenu(false);
      }
    };

    if (isVisibleMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisibleMenu]);

  // 로그인 상태 확인
  const token = getAccessToken(); // 토큰 가져오기
  useEffect(() => {
    setIsLoggedIn(!!token); // 토큰 여부에 따라 상태 설정

    const handleStorageChange = () => {
      const token = getAccessToken();
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [token]);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // localStorage에서 토큰 제거
    localStorage.removeItem('refreshToken'); // 필요시 refreshToken도 제거
    setIsLoggedIn(false); // 상태 업데이트
    alert('로그아웃 되었습니다.');
    navigate('/login');
  };

  // 페이지 이동 시 프로필 모달 닫기
  useEffect(() => {
    setIsVisibleProfile(false);
  }, [location.pathname]);

  return (
    <>
      <HeaderWrapper>
        {/* PC 버전 */}
        {isDesktop && (
          <>
            <SectionWrapper>
              <StyledLogoIcon onClick={() => handleNavigation('/')} />
              <ButtonWrapper>
                <StyledButton
                  onClick={() => handleNavigation('/')}
                  isActive={location.pathname === '/'}
                >홈 피드</StyledButton>
                <StyledButton
                  onClick={() => handleNavigation('/location')}
                  isActive={location.pathname === '/location'}
                >지역 검색</StyledButton>
                <StyledButton
                  onClick={() => handleNavigation('/level')}
                  isActive={location.pathname === '/level'}
                >숙련도 검색</StyledButton>
                <StyledButton
                  onClick={() => handleNavigation('/genre')}
                  isActive={location.pathname === '/genre'}
                >장르 검색</StyledButton>
              </ButtonWrapper>
            </SectionWrapper>
            <SectionWrapper>
              {/* 검색 */}
              <SearchInput type="header"/>
              {/* 로그인, 프로필 */}
              {isLoggedIn ? (
                <ProfileWrapper>
                  <CircleButton onClick={() => setIsVisibleProfile(!isVisibleProfile)}>
                    <StyledProfileIcon/>
                  </CircleButton>
                  <HeaderProfileModal visible={isVisibleProfile}/>
                </ProfileWrapper>
              ) : (
                <CircleButton onClick={() => handleNavigation('/login')}>
                  <StyledLoginIcon/>
                </CircleButton>
              )}
            </SectionWrapper>
          </>
        )}

        {/* 태블릿 버전 */}
        {isTablet && (
          <>

          </>
        )}
        {isMobile && (
          <>
            <StyledLogoIcon onClick={() => handleNavigation('/')} />
            <StyledMenuIcon onClick={() => handleMenu()} />
          </>
        )}
      </HeaderWrapper>

      {isMobile && (
        // 메뉴바
        <MenuWrapper isVisible={isVisibleMenu} ref={menuRef}>
          <StyledCancelIcon onClick={() => handleMenu()} />
          <MobileSectionWrapper>
            <MobileButton onClick={() => handleNavigation('/')}>홈</MobileButton>
            <MobileButton onClick={() => handleNavigation('/location')}>지역</MobileButton>
            <MobileButton onClick={() => handleNavigation('/levelSearch')}>숙련도</MobileButton>
            <MobileButton onClick={() => handleNavigation('/genre')}>장르</MobileButton>
            <MobileButton onClick={() => handleNavigation('/mypage')}>마이페이지</MobileButton>
            {isLoggedIn ? (
              <MobileButton onClick={handleLogout}>로그아웃</MobileButton>
            ) : (
              <MobileButton onClick={() => handleNavigation('/login')}>로그인</MobileButton>
            )}
          </MobileSectionWrapper>
        </MenuWrapper>
      )}
    </>
  );
}

export default Header;

// CSS
const HeaderWrapper = styled.div`
border: 1px solid red;
  padding: 0 3.75rem;
  box-sizing: border-box;
  width: 100%;
  height: 5.625rem;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1900;
  // backdrop-filter: blur(15px);

  @media (max-width: 1024px) {
    // 태블릿
    padding-left: 2.5em;
  }
  @media (max-width: 768px) {
    // 모바일
    padding-left: 1em;
  }
`;

const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLogoIcon = styled(LogoIcon)`
  margin-right: 0.9375rem;
  width: 3.75rem;
  cursor: pointer;

  @media (max-width: 1024px) {
    // 태블릿
    height: 3.8em;
  }
  @media (max-width: 768px) {
    // 모바일
    height: 3em;
  }
`;

const ButtonWrapper = styled.div`
  border-radius: 1.40625rem;
  padding: 0 0.5625rem;
  box-sizing: border-box;
  width: 34.6875rem;
  height: 2.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
`;

const StyledButton = styled.div`
  border-radius: 1.40625rem;
  width: 7.5rem;
  height: 1.875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ isActive }) => (isActive ? '#E8EAFF' : 'transparent')};
  color: ${({ isActive }) => (isActive ? '#6680DF' : '#515467')};
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover{
    background-color: #E7E8ED;
    font-weight: 700;
  }

  @media (max-width: 1024px) {
    // 태블릿
    font-size: 1em;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CircleButton = styled.div`
  border-radius: 30px;
  margin-left: 1.25rem;
  width: 2.8125rem;
  height: 2.8125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F9F9FB;
  cursor: pointer;
  &:hover {
    background: linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%);
  }
  &:hover svg {
    fill: #F9F9FB;
  }
`;

const StyledLoginIcon = styled(LoginIcon)`
  width: 1.40625rem;
`;
const StyledProfileIcon = styled(ProfileIcon)`
  width: 1.40625rem;
`;

// 모바일 반응형
const StyledMenuIcon = styled(MenuIcon)`
  width: 2em;
  height: 2em;
  cursor: pointer;
`;

const MenuWrapper = styled.div`
  width: 15em;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background-color: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(15px);
  transform: ${({ isVisible }) => (isVisible ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease;
  z-index: 3000;
`;

const StyledCancelIcon = styled(CancelIcon)`
  margin: 2.5em 1em 1em 1em;
  width: 2.3em;
  height: 2.3em;
  cursor: pointer;
`;

const MobileSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const MobileButton = styled.div`
  margin-left: 3em;
  margin-bottom: 1.5em;
  color: white;
  font-family: 'Pretendard-SemiBold';
  font-size: 1.2em;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    transform: translateX(5px);
  }
  transition: all 0.3s ease;
`;
