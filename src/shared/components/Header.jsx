import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useDevice from '../../shared/hooks/useDevice';
import MenuIcon from '../../shared/assets/icons/common/menuIcon.svg?react';
import LogoIcon from '../../shared/assets/icons/common/logo.svg?react';
import LoginIcon from '../../shared/assets/icons/common/loginIcon.svg?react';
import ProfileIcon from '../../shared/assets/icons/common/profileIcon.svg?react';
import SearchInput from './SearchInput';
import HeaderProfileModal from './HeaderProfileModal';
import TextLogo from '../assets/icons/common/textLogo.svg?react';
import InstagramIcon from '../assets/icons/common/instagramIcon.svg?react';
import EmailIcon from '../assets/icons/common/emailIcon.svg?react';
import InquiryIcon from '../assets/icons/common/inquiryIcon.svg?react';
import LeftArrowIcon from '../assets/icons/common/arrow/leftArrow.svg?react';
import { postLogoutAPI } from '../../features/auth/api/authAPI';
import useAuthSession from '../hooks/useAuthSession';

function Header() {
  // navigate, location
  const navigate = useNavigate();
  const location = useLocation();

  // state 관리
  const [isVisibleProfile, setIsVisibleProfile] = useState(false);
  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isScrolledBeyond, setIsScrolledBeyond] = useState(false);
  const [headerKeyword, setHeaderKeyword] = useState('');

  // 토큰 호출
  const isLoggedIn = useAuthSession();

  // 페이지 이동
  const handleNavigation = (path) => {
    navigate(path);
    setIsVisibleMenu(false);
  };

  // 검색 함수
  const handleHeaderSearch = (value) => {
    console.log('[검색 실행]', value);
    if (!value) return;
    navigate('/search', { state: { keyword: value } });
  };


  // 반응형 함수
  const { isDesktop, isTablet, isMobile } = useDevice();

  // 로고 색상 변경을 위한 페이지 정리
  const authPages = ['/login', '/signup', '/survey'];
  const isAuthPage = authPages.includes(location.pathname);

  // 테마상세/후기상세 페이지 여부
  const isDetailPage = location.pathname.startsWith('/theme/');

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

  // 페이지 이동 시 프로필 모달 닫기
  useEffect(() => {
    setIsVisibleProfile(false);
  }, [location.pathname]);

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setHasScrolled(scrollY > 10);
      setIsScrolledBeyond(location.pathname === '/' && isMobile && scrollY > 350);  // 히어로 영역 벗어나면 true
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, isMobile]);

  // 로그아웃 함수
  const handleLogout = async () => {
    try {
      // 서버 로그아웃
      await postLogoutAPI();
    } catch (error) {
      console.error("로그아웃 API 요청 실패:", error);
    } finally {
      // 프론트 토큰 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userCode");
      alert("로그아웃 되었습니다.");
      window.location.replace('/login');
    }
  };

  return (
    <>
      {/* PC, 태블릿 버전 */}
      {(isDesktop || isTablet) && (
        <HeaderWrapper hasScrolled={hasScrolled} isLocation={location.pathname === '/location'}>
          <SectionWrapper>
            <StyledLogoIcon onClick={() => handleNavigation('/')} location={location}/>
            <ButtonWrapper isDesktop={isDesktop} isTablet={isTablet}>
              <StyledButton
                onClick={() => handleNavigation('/')}
                isActive={location.pathname === '/'}
                isDesktop={isDesktop}
                isTablet={isTablet}
              >홈 피드</StyledButton>
              <StyledButton
                onClick={() => handleNavigation('/location')}
                isActive={location.pathname === '/location'}
                isDesktop={isDesktop}
                isTablet={isTablet}
              >지역 검색</StyledButton>
              <StyledButton
                onClick={() => handleNavigation('/level')}
                isActive={location.pathname === '/level'}
                isDesktop={isDesktop}
                isTablet={isTablet}
              >숙련도 검색</StyledButton>
              <StyledButton
                onClick={() => handleNavigation('/genre')}
                isActive={location.pathname === '/genre'}
                isDesktop={isDesktop}
                isTablet={isTablet}
              >장르 검색</StyledButton>
            </ButtonWrapper>
          </SectionWrapper>
          <SectionWrapper>
            {/* 검색 */}
            <SearchInputWrapper>
              {location.pathname !== '/search' && (
                <SearchInput
                  type="header"
                  keyword={headerKeyword}
                  setKeyword={setHeaderKeyword}
                  onSearch={handleHeaderSearch}
                />
              )}
            </SearchInputWrapper>
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
        </HeaderWrapper>
      )}

      {/* 모바일 버전 */}
      {isMobile && (
        <>
          <MobileHeaderWrapper  hasScrolled={hasScrolled}>
            {isDetailPage ? (
              <StyledLeftArrowIcon onClick={() => navigate(-1)} />
            ) : (
              <StyledMenuIcon onClick={() => handleMenu()} />
            )}
            <StyledLogoIcon
              isScrolledBeyond={isScrolledBeyond}
              onClick={() => handleNavigation('/')}
              location={location}
              isAuthPage={isAuthPage}
            />
          </MobileHeaderWrapper>

          {/* 메뉴바 */}
          <MenuWrapper isVisible={isVisibleMenu} ref={menuRef}>
            <MenuTopWrapper>
              <MobileSearchInputWrapper>
                <SearchInput
                  type="header-mobile" 
                  keyword={headerKeyword}
                  setKeyword={setHeaderKeyword}
                  onSearch={handleHeaderSearch}
                />
              </MobileSearchInputWrapper>
              <MobileButtonWrapper>
                <MobileButton
                  onClick={() => handleNavigation('/')}
                  isActive={location.pathname === '/'}
                >홈 피드</MobileButton>
                <MobileButton
                  onClick={() => handleNavigation('/location')}
                  isActive={location.pathname === '/location'}
                >지역 검색</MobileButton>
                <MobileButton
                  onClick={() => handleNavigation('/level')}
                  isActive={location.pathname === '/level'}
                >숙련도 검색</MobileButton>
                <MobileButton
                  onClick={() => handleNavigation('/genre')}
                  isActive={location.pathname === '/genre'}
                >장르 검색</MobileButton>
              </MobileButtonWrapper>
              <ProfileButtonWrapper>
                {isLoggedIn ? (
                  <>
                    <ProfileButton onClick={() => handleNavigation('/mypage')}>마이페이지</ProfileButton>
                    <ProfileButton onClick={handleLogout}>로그아웃</ProfileButton>
                  </>
                ) : (
                  <ProfileButton onClick={() => handleNavigation('/login')}>로그인</ProfileButton>
                )}
              </ProfileButtonWrapper>
            </MenuTopWrapper>
            <MenuBottomWrapper>
              <StyledTextLogo/>
              <IconWrapper>
                <StyledInstagramIcon onClick={() => window.open('https://www.instagram.com/room.in.us_official/', '_blank')}/>
                <StyledEmailIcon onClick={() => window.open('mailto:roominus.official@gmail.com')}/>
              </IconWrapper>
              <LegalNoticesText onClick={() => window.open('/terms', '_blank', 'width=600,height=800')}>이용약관</LegalNoticesText>
              <LegalNoticesText onClick={() => window.open('/privacy', '_blank', 'width=600,height=800')}>개인정보처리방침</LegalNoticesText>
              <InquiryButton onClick={() => window.open('https://www.notion.so/2da2f8c6055280bf9b9cee64427d1468?pvs=106', '_blank')}><StyledInquiryIcon/>문의하기</InquiryButton>
            </MenuBottomWrapper>
          </MenuWrapper>
        </>
      )}
    </>
  );
}

export default Header;

// CSS
const HeaderWrapper = styled.div`
  padding: 0 3.75rem;
  box-sizing: border-box;
  width: 100%;
  height: 5.625rem;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem;
  z-index: 1900;
  background: ${({ isLocation, hasScrolled }) =>
    isLocation ? '#E7E8ED' : (hasScrolled ? 'rgba(255, 255, 255, 0.3)' : 'transparent')};
  backdrop-filter: ${({ isLocation, hasScrolled }) =>
    isLocation ? 'none' : (hasScrolled ? 'blur(15px)' : 'none')};
  transition: all 0.3s ease-in-out;
`;

const SectionWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const StyledLogoIcon = styled(LogoIcon)`
  margin-right: 0.9375rem;
  width: 3.75rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  @media (max-width: 768px) {
    width: 2.5rem;
    path#Vector_2 {
      fill: ${({ isScrolledBeyond, location, isAuthPage }) =>
        isAuthPage
          ? "#E8EAFF"
          : location.pathname === '/'
          ? (isScrolledBeyond ? "#718FF2" : "#E8EAFF")
          : "#718FF2"};
    }
  }
`;

const ButtonWrapper = styled.div`
  border-radius: 1.40625rem;
  padding: 0 0.5625rem;
  box-sizing: border-box;
  width: ${(props) => (props.isDesktop ? "34.6875rem" : "26.25rem")};
  height: 2.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFF;
`;

const StyledButton = styled.div`
  border-radius: 1.40625rem;
  width: ${(props) => (props.isDesktop ? "7.5rem" : "5.625rem")};
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
`;

const SearchInputWrapper = styled.div`
  margin-right: 1.25rem;
  width: 100%;
  display: flex;
  justify-content: end;
`;

const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CircleButton = styled.div`
  border-radius: 30px;
  width: 2.8125rem;
  height: 2.8125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
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
const MobileHeaderWrapper = styled.div`
  padding: 0 1.25rem;
  box-sizing: border-box;
  width: 100%;
  height: 4.375rem;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 3000;
  background: ${({ hasScrolled }) => (hasScrolled ? 'rgba(255, 255, 255, 0.3)' : 'transparent')};
  backdrop-filter: ${({ hasScrolled }) => (hasScrolled ? 'blur(15px)' : 'none')};
  transition: all 0.3s ease-in-out;
`;

const StyledMenuIcon = styled(MenuIcon)`
  width: 1.5625rem;
  height: 1.5625rem;
  cursor: pointer;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.5625rem;
`;

const MenuWrapper = styled.div`
  padding: 1.25rem;
  box-sizing: border-box;
  width: 15rem;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--RIU_Primary-Gradient-03, linear-gradient(180deg, #E7E8ED 53.14%, #334EAB 100%));
  backdrop-filter: blur(15px);
  transform: ${({ isVisible }) => (isVisible ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease;
  z-index: 3000;
`;

const MenuTopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const MobileSearchInputWrapper = styled.div`
  display: flex;
  justify-content: center;

  div {
    width: 100%;
    height: 1.875rem;
  }
  svg {
    width: 0.9375rem;
  }
`;

const MobileButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

const MobileButton = styled.div`
  border-bottom: 1px solid var(--RIU_Primary-200, #6680DF);
  padding: 0.75rem 1.25rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
  align-self: stretch;
  color: ${({ isActive }) => (isActive ? '#303281' : '#515DBA')};
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;
  cursor: pointer;
  &:hover {
    transform: translateX(0.25rem);
  }
  transition: all 0.3s ease;
`;

const ProfileButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.125rem;
`;

const ProfileButton = styled.div`
  color: var(--RIU_Primary-700, #1B1C5C);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.75rem;
  line-height: 150%;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;
`;

const MenuBottomWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTextLogo = styled(TextLogo)`
  width: 8.75rem;
  height: 3.78125rem;
  fill: #4648A7;
  line {
    stroke: #4648A7;
  }
`;

const IconWrapper = styled.div`
  margin: 0.875rem 0;
  display: flex;
  gap: 0.5625rem;
`;

const StyledInstagramIcon = styled(InstagramIcon)`
  width: 1.25rem;
  color: #4648A7;
  cursor: pointer;
`;
const StyledEmailIcon = styled(EmailIcon)`
  width: 1.25rem;
  color: #4648A7;
  cursor: pointer;
`;

const LegalNoticesText = styled.p`
  margin: 0 0 0.625rem 0;
  width: fit-content;
  color: var(--RIU_Primary-0, #E8EAFF);
  font-family: 'Pretendard-Bold';
  font-size: 0.625rem;
  line-height: 150%;
  cursor: pointer;
`;

const InquiryButton = styled.div`
  border-radius: 0.625rem;
  width: 4.625rem;
  height: 1.6875rem;
  background: var(--RIU_Primary-80, #8DA3FF);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: var(--RIU_Primary-0, #E8EAFF);
  font-family: 'Pretendard-Bold';
  font-size: 0.625rem;
  line-height: 150%;
  cursor: pointer;
`;

const StyledInquiryIcon = styled(InquiryIcon)`
  width: 0.9375rem;
`;