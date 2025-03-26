import styled from 'styled-components';
import NoiseFilter from '../shared/assets/icons/login/loginNoiseFilter.svg';
import TextLogo from '../shared/assets/icons/common/textLogo.svg?react'
import LogoIcon from '../shared/assets/icons/common/logo.svg?react';
import KakaoLogo from '../shared/assets/icons/login/kakaoLogo.svg?react';
import GoogleLogo from '../shared/assets/icons/login/googleLogo.svg?react';

function LoginPage() {
  // 카카오 로그인
  const handleKakaoLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL_API}oauth2/authorization/kakao`;
  };

  // 구글 로그인
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_SERVER_URL_API}oauth2/authorization/google`;
  };

  return (
    <PageWrapper>
      <StyledTextLogo/>
        <ContentWrapper>
          {/* 로고 영역 */}
          <StyledLogo/>
          <DescriptionWrapper>
            방탈출 후기와 예약을 한 눈에 살필 수 있는
            <BoldText>루미너스</BoldText>
          </DescriptionWrapper>

          <ButtonSection>
            {/* 카카오 로그인 */}
            <SocialLoginButton
              type='kakao'
              onClick={handleKakaoLogin}
            >
              <StyledKakaoLogo />
              <LoginText type='social'>카카오 계정으로 로그인</LoginText>
            </SocialLoginButton>

            {/* 구글 로그인 */}
            <SocialLoginButton
              type='google'
              onClick={handleGoogleLogin}
            >
              <StyledGoogleLogo />
              <LoginText type='social'>구글 계정으로 로그인</LoginText>
            </SocialLoginButton>
          </ButtonSection>
      </ContentWrapper>
    </PageWrapper>
  );
}

export default LoginPage;

const PageWrapper = styled.div`
font-size: 0.75rem;
  width: 100vw;
  height: calc(100vh - 2.375rem);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6.25em;
  position: relative;
  z-index: 0;
  
  background-color:hsla(231,100%,89%,1);
  background-image:
    radial-gradient(at 0% 49%, hsla(212,19%,78%,1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(216,38%,77%,1) 0px, transparent 50%),
    radial-gradient(at 51% 100%, hsla(228,28%,65%,1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(232,33%,55%,1) 0px, transparent 50%),
    radial-gradient(at 100% 44%, hsla(239,57%,59%,1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(235,68%,66%,1) 0px, transparent 50%),
    radial-gradient(at 52% 0%, hsla(228,60%,81%,1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(213,20%,80%,1) 0px, transparent 50%);

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${NoiseFilter});
    background-repeat: repeat;
    background-size: cover;
    opacity: 0.5;
    pointer-events: none;
  }
`;

const StyledTextLogo = styled(TextLogo)`
  width: 35em;
  height: 15.1em;
  z-index: 1;
`;

const ContentWrapper = styled.div`
  border-radius: 1.875em;
  padding: 1.875em 2.5em;
  box-sizing: border-box;
  width: 32.5em;
  height: 48.75em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5em;
  background-color: #FFF;
  z-index: 1;
`;

const StyledLogo = styled(LogoIcon)`
  width: 10.5em;
  height: 10.5em;
  flex-shrink: 0;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625em;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Regular';
  font-size: 0.875em;
  line-height: normal;
`;

const BoldText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.25em;
  line-height: normal;
`;

const ButtonSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const LoginText = styled.div`
  color: ${({type}) => (type == 'social' ? '#000' : '#FFF')};
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
`;

const SocialLoginButton = styled.div`
  border: ${({type}) => (type == 'kakao' ? 'none' : '1px solid #B7C1D4')};
  display: flex;
  width: 100%;
  height: 3.125em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  border-radius: 2.5em;
  background: ${({type}) => (type == 'kakao' ? '#FEE500' : '#FFF')};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    opacity: 0;
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0.2;
  }
`;

const StyledKakaoLogo = styled(KakaoLogo)`
  width: 1.5625em;
  height: 1.458125em;
  z-index: 1;
`;

const StyledGoogleLogo = styled(GoogleLogo)`
  width: 1.5625em;
  height: 1.5625em;
  z-index: 1;
`;

