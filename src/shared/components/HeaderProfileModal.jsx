import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import styled from "styled-components";
import ColorR from "../assets/icons/common/colorR.svg?react";
import MypageIcon from "../assets/icons/common/myPageIcon.svg?react"
import LogoutIcon from "../assets/icons/common/logoutIcon.svg?react";
import { useNavigate } from "react-router-dom";
import { getMemberInfoAPI } from "../../features/auth/api/memberAPI";
import { postLogoutAPI } from "../../features/auth/api/authAPI";

function HeaderProfileModal({ visible }) {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        const me = await getMemberInfoAPI();
        if (!cancelled) setNickname(me.nickname);
      } catch {
        if (!cancelled) setNickname('');
      }
    })();
    return () => { cancelled = true; };
  }, [visible]);

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
    <ModalWrapper visible={visible}>
      <StyledColorR />
      <StyledText>{nickname} 님</StyledText>
      <StyledHr/>
      <ButtonWrapper>
        <StyledMypageIcon onClick={() => navigate('/mypage')}/>
        <StyledButtonText onClick={() => navigate('/mypage')}>마이페이지</StyledButtonText>
      </ButtonWrapper>
      <ButtonWrapper>
        <StyledLogoutIcon onClick={handleLogout}/>
        <StyledButtonText onClick={handleLogout}>로그아웃</StyledButtonText>
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

const StyledButtonText = styled.p`
  color: #515467;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  cursor: pointer;
`;