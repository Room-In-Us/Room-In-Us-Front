import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDevice from "../../shared/hooks/useDevice";
import MenuIcon from "../../shared/assets/icons/common/menuIcon.svg?react";
import CancelIcon from "../../shared/assets/icons/common/cancelIcon.svg?react";
import LogoIcon from "../../shared/assets/icons/common/logo.svg?react";
import { getAccessToken } from "../../app/API";

function Header() {
    // state 관리
    const [isVisibleMenu, setIsVisibleMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
    
    // navigate
    const navigate = useNavigate();

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
    }
    
    // 화면 크기가 변경 시 메뉴를 닫기
    useEffect(() => {
        if (!isMobile) {
            setIsVisibleMenu(false);
        }
    }, [isMobile, isTablet, isDesktop]);;
    
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
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
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
    
        window.addEventListener("storage", handleStorageChange);
    
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [token]);

    // 로그아웃 처리 함수
    const handleLogout = () => {
        localStorage.removeItem("accessToken"); // localStorage에서 토큰 제거
        localStorage.removeItem("refreshToken"); // 필요시 refreshToken도 제거
        setIsLoggedIn(false); // 상태 업데이트
        alert("로그아웃 되었습니다.");
        navigate("/login");
    };

    return (
        <>
        <HeaderWrapper>
            { isDesktop &&
                <>
                    <StyledLogoIcon onClick={() => handleNavigation("/")}/>
                    <ButtonWrapper>
                        <StyledButton onClick={() => handleNavigation("/")}>홈</StyledButton>
                        <StyledButton onClick={() => handleNavigation("/board")}>게시판</StyledButton>
                        <StyledButton onClick={() => handleNavigation("/mypage")}>마이페이지</StyledButton>
                        {isLoggedIn ? (
                            <StyledButton onClick={handleLogout}>로그아웃</StyledButton>
                        ) : (
                            <StyledButton onClick={() => handleNavigation("/login")}>로그인</StyledButton>
                        )}
                    </ButtonWrapper>
                </>
            }
            { isTablet &&
                <>
                    <StyledLogoIcon onClick={() => handleNavigation("/")}/>
                    <ButtonWrapper>
                        <StyledButton onClick={() => handleNavigation("/")}>홈</StyledButton>
                        <StyledButton onClick={() => handleNavigation("/board")}>게시판</StyledButton>
                        <StyledButton onClick={() => handleNavigation("/mypage")}>마이페이지</StyledButton>
                        {isLoggedIn ? (
                            <StyledButton onClick={handleLogout}>로그아웃</StyledButton>
                        ) : (
                            <StyledButton onClick={() => handleNavigation("/login")}>로그인</StyledButton>
                        )}
                    </ButtonWrapper>
                </>
            }
            { isMobile &&
                <>
                    <StyledLogoIcon onClick={() => handleNavigation("/")}/>
                    <StyledMenuIcon onClick={() => handleMenu()}/>
                </>
            }
            
        </HeaderWrapper>
        
        { isMobile &&
            // 메뉴바
            <MenuWrapper isVisible={isVisibleMenu} ref={menuRef}>
                <StyledCancelIcon onClick={() => handleMenu()}/>
                <MobileButtonWrapper>
                    <MobileButton onClick={() => handleNavigation("/")}>홈</MobileButton>
                    <MobileButton onClick={() => handleNavigation("/board")}>게시판</MobileButton>
                    <MobileButton onClick={() => handleNavigation("/mypage")}>마이페이지</MobileButton>
                    {isLoggedIn ? (
                        <MobileButton onClick={handleLogout}>로그아웃</MobileButton>
                    ) : (
                        <MobileButton onClick={() => handleNavigation("/login")}>로그인</MobileButton>
                    )}
                </MobileButtonWrapper>
            </MenuWrapper>
        }
        </>
    )
}

export default Header;

// CSS
const HeaderWrapper = styled.div`
    position: fixed;
    padding: 0 3em;
    width: 100%;
    height: 6em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #1A1A1A;
    background-color: rgba(26,26,26,0.9);
    backdrop-filter: blur(15px);
    z-index: 2000;
    box-sizing: border-box;
    
    @media (max-width: 1024px) {  // 태블릿
        padding-left: 2.5em;
    }
    @media (max-width: 768px) {  // 모바일
        padding-left: 1em;
    }
`;

const StyledLogoIcon = styled(LogoIcon)`
    height: 4.5em;
    cursor: pointer;

    @media (max-width: 1024px) {  // 태블릿
        height: 3.8em;
    }
    @media (max-width: 768px) {  // 모바일
        height: 3em;
    }
`;

const ButtonWrapper = styled.div`
    height: 2em;
    line-height: 2em;
    display: flex;
`;

const StyledButton = styled.div`
    margin-left: 4em;
    color: white;
    font-family: 'Pretendard-SemiBold';
    font-size: 1.2em;
    font-weight: 600;
    cursor: pointer;

     @media (max-width: 1024px) {  // 태블릿
        font-size: 1em;
    }
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
    background-color: rgba(26,26,26,0.7);
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

const MobileButtonWrapper = styled.div`
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