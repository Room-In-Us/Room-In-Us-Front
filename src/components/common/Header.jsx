import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import LogoImg from "../../assets/images/common/logo.png";
import { useNavigate } from "react-router-dom";
import useDevice from "../../hooks/useDevice";
import MenuIcon from "../../assets/icons/common/menuIcon.svg?react";
import CancelIcon from "../../assets/icons/common/cancelIcon.svg?react";

function Header() {
    // state 관리
    const [isVisibleMenu, setIsVisibleMenu] = useState(false);
    
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

    return (
        <>
        <HeaderWrapper>
            { isDesktop &&
                <>
                    <DeskTopLogoImg src={LogoImg} alt="logo image" onClick={() => handleNavigation("/")}/>
                    <ButtonWrapper>
                        <DeskTopButton onClick={() => handleNavigation("/")}>홈</DeskTopButton>
                        <DeskTopButton onClick={() => handleNavigation("/board")}>게시판</DeskTopButton>
                        <DeskTopButton onClick={() => handleNavigation("/mypage")}>마이페이지</DeskTopButton>
                        <DeskTopButton onClick={() => handleNavigation("/login")}>로그인</DeskTopButton>
                    </ButtonWrapper>
                </>
            }
            { isTablet &&
                <>
                    <TabletLogoImg src={LogoImg} alt="logo image" onClick={() => handleNavigation("/")}/>
                    <ButtonWrapper>
                        <TabletButton onClick={() => handleNavigation("/")}>홈</TabletButton>
                        <TabletButton onClick={() => handleNavigation("/board")}>게시판</TabletButton>
                        <TabletButton onClick={() => handleNavigation("/mypage")}>마이페이지</TabletButton>
                        <TabletButton onClick={() => handleNavigation("/login")}>로그인</TabletButton>
                    </ButtonWrapper>
                </>
            }
            { isMobile &&
                <>
                    <MobileLogoImg src={LogoImg} alt="logo image" onClick={() => handleNavigation("/")}/>
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
                    <MobileButton onClick={() => handleNavigation("/login")}>로그인</MobileButton>
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
    z-index: 2000;
    box-sizing: border-box;
`;

const DeskTopLogoImg = styled.img`
    height: 4.5em;
    cursor: pointer;
`;

const ButtonWrapper = styled.div`
    height: 2em;
    line-height: 2em;
    display: flex;
`;

const DeskTopButton = styled.div`
    margin-left: 4em;
    color: white;
    font-family: 'Pretendard-SemiBold';
    font-size: 1.2em;
    font-weight: 600;
    cursor: pointer;
`;

// 태블릿 반응형
const TabletLogoImg = styled.img`
    height: 3.8em;
    cursor: pointer;
`;

const TabletButton = styled.div`
    margin-left: 4em;
    color: white;
    font-family: 'Pretendard-SemiBold';
    font-weight: 600;
    cursor: pointer;
`;

// 모바일 반응형
const MobileLogoImg = styled.img`
    height: 2.8em;
    cursor: pointer;
`;

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