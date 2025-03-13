import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import styled from "styled-components";
import ColorR from "../assets/icons/common/colorR.svg?react";
import MypageIcon from "../assets/icons/common/myPageIcon.svg?react"
import LogoutIcon from "../assets/icons/common/logoutIcon.svg?react";
import { useNavigate } from "react-router-dom";
import { getMemberInfoAPI } from "../../features/auth/api/memberAPI";

// 쿠키에서 accessToken 가져오는 함수
const getAccessTokenFromCookie = () => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="));
  return cookie ? cookie.split("=")[1] : null;
};

function HeaderProfileModal({ visible }) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = getAccessTokenFromCookie();
      setIsLoggedIn(!!token);
    };

    checkLoginStatus(); // 초기 상태 확인

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      // await axios.post("/auth/logout", {}, { withCredentials: true });
      // setIsLoggedIn(false);
      alert("로그아웃 되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 닉네임 가져오기 (로그인 상태일 때만 실행)
  useEffect(() => {
    if (isLoggedIn) {
      const fetchNickName = async () => {
        try {
          const response = await getMemberInfoAPI();
          setNickname(response.nickname);
        } catch (error) {
          console.error("닉네임 불러오는 중 오류 발생:", error);
        }
      };
      fetchNickName();
    }
  }, [isLoggedIn]);

  return (
    <ModalWrapper visible={visible}>
      <StyledColorR />
      <StyledText>{nickname} 님</StyledText>
      <StyledHr/>
      <ButtonWrapper>
        <StyledMypageIcon onClick={() => navigate('/mypage')}/>
        <StyledP onClick={() => navigate('/mypage')}>마이페이지</StyledP>
      </ButtonWrapper>
      <ButtonWrapper>
        <StyledLogoutIcon onClick={handleLogout}/>
        <StyledP onClick={handleLogout}>로그아웃</StyledP>
      </ButtonWrapper>
    </ModalWrapper>
  )
}

// PropTypes 정의 추가
HeaderProfileModal.propTypes = {
  visible: PropTypes.bool.isRequired,
};

export default HeaderProfileModal;

// CSS
const ModalWrapper = styled.div`
  border-radius: 0.46875rem;
  padding: 0.9375rem 0;
  width: 16.125rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 4.65625rem;
  right: 3.75rem;
  background: #F9F9FB;

  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
  transition: all 0.3s ease-in-out;
`;

const StyledColorR = styled(ColorR)`
  width: 2.0625rem;
`;

const StyledText = styled.p`
  color: #515467;
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 0.9375rem;
`;

const StyledHr = styled.hr`
  border: none;
  margin: 0 0 0.46875rem 0;
  width: 8.90625rem;
  height: 0.09375rem;
  background: #B9C3FF;
`;

const ButtonWrapper = styled.div`
  width: 13.3125rem;
  display: flex;
  align-items: center;
  gap: 7.0.46875rem;
  margin: 0.46875rem 0;
`;

const StyledMypageIcon = styled(MypageIcon)`
  width: 1.6875rem;
  cursor: pointer;
`;

const StyledLogoutIcon = styled(LogoutIcon)`
  width: 1.6875rem;
  cursor: pointer;
`;

const StyledP = styled.p`
  color: #515467;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  cursor: pointer;
`;