import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import styled from "styled-components";
import ColorR from "../assets/icons/common/colorR.svg?react";
import MypageIcon from "../assets/icons/common/myPageIcon.svg?react"
import LogoutIcon from "../assets/icons/common/logoutIcon.svg?react";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from '../../app/API';
import { getMemberInfoAPI } from "../../features/auth/api/memberAPI";

function HeaderProfileModal({ visible }) {
  const navigate = useNavigate();
  const [, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');

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

  // 닉네임 가져오기
  useEffect(() => {
    const fetchNickName = async () => {
      try {
        const response = await getMemberInfoAPI();
        console.log('api로 받은 닉네임:', response.nickname);
        setNickname(response.nickname);
      } catch (error) {
        console.error('닉네임 불러오는 중 오류 발생:', error);
      }
    };
    fetchNickName();
  }, []);

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