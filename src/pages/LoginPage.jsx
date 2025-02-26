import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import NoiseFilter from '../shared/assets/icons/login/loginNoiseFilter.svg';
import TextLogo from '../shared/assets/icons/common/textLogo.svg?react'
import EyeSlashIcon from '../shared/assets/icons/login/eyeSlashIcon.svg?react';
import EyeIcon from '../shared/assets/icons/login/eyeIcon.svg?react';
import KakaoLogo from '../shared/assets/icons/login/kakaoLogo.svg?react';
import GoogleLogo from '../shared/assets/icons/login/googleLogo.svg?react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../features/auth/model/authSchema';
import { postLoginAPI } from '../features/auth/api/authAPI';

function LoginPage() {
  // state 관리
  const [isPasswordHide, setIsPasswordHide] = useState(true);
  const [isCheck, setIsCheck] = useState(false);

  // navigate
  const navigate = useNavigate();

  // 비밀번호 숨기기
  const handlePasswordHide = () => {
    setIsPasswordHide(!isPasswordHide);
  }

  // 로그인 상태 유지 함수
  const handleCheckBox = () => {
    setIsCheck(!isCheck);
  };

  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  // 폼 제출 핸들러
  const onSubmit = async (data) => {
    try {
      console.log('로그인 데이터:', data);
      const response = await postLoginAPI(data);
      console.log('로그인 성공:', response);

      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken); // 서버에서 반환된 accessToken 저장
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken); // 필요 시 refreshToken도 저장
      }

      alert('로그인에 성공했습니다.');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error.response?.data || error.message);
      alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <PageWrapper>
      <StyledTextLogo/>
        <ContentWrapper>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <InputSection>

              {/* 이메일 */}
              <InputWrapper>
                <InputText>이메일</InputText>
                <StyledInput
                  {...register('email')}
                  placeholder='이메일을 입력하세요.'
                />
              </InputWrapper>
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}

              {/* 비밀번호 */}
              <InputWrapper>
                <InputText>비밀번호</InputText>
                <PassWordInputWrapper>
                  <StyledInput
                    type={isPasswordHide ? 'password' : 'text'}
                    {...register('password')}
                    placeholder='비밀번호를 입력하세요.'
                  />
                  {isPasswordHide ? (
                    <StyledEyeSlashIcon onClick={handlePasswordHide} />
                  ) : (
                    <StyledEyeIcon onClick={handlePasswordHide} />
                  )}  
                </PassWordInputWrapper>
              </InputWrapper>
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}

              {/* 로그인 상태 유지 */}
              <LoginStateWrapper>
                <StyledCheckbox onClick={handleCheckBox} isCheck={isCheck}>
                  ✓
                </StyledCheckbox>
                <CheckboxText onClick={handleCheckBox}>자동으로 로그인하기</CheckboxText>
              </LoginStateWrapper>
            </InputSection>

            <ButtonSection>
              {/* 로그인 버튼 */}
              <LoginButton type="submit">
                <LoginText>로그인</LoginText>
              </LoginButton>

              {/* 카카오 로그인 */}
              <SocialLoginButton
                type='kakao'
                onClick={() => navigate('/')}
              >
                <StyledKakaoLogo />
                <LoginText type='social'>카카오 계정으로 로그인</LoginText>
              </SocialLoginButton>

              {/* 구글 로그인 */}
              <SocialLoginButton
                type='google'
                onClick={() => navigate('/')}
              >
                <StyledGoogleLogo />
                <LoginText type='social'>구글 계정으로 로그인</LoginText>
              </SocialLoginButton>
            </ButtonSection>

            {/* 회원가입 섹션 */}
            <SignupSection>
              <SignupText onClick={() => navigate('/signup')}>루미너스 회원이 아니신가요?</SignupText>
              <SignupText onClick={() => navigate('/signup')}>비밀번호 찾기</SignupText>
            </SignupSection>
          </Form>
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 4.375em;
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

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 2.5em;
  }
`;

const StyledTextLogo = styled(TextLogo)`
  width: 35em;
  height: 15.125em;
  z-index: 1;

  @media (max-width: 768px) {
    width: 17.5em;
    height: 7.5625em;
  }
`;

const ContentWrapper = styled.div`
  border-radius: 1.875em;
  padding: 1.875em 2.5em;
  box-sizing: border-box;
  width: 32.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background-color: #FFF;
  z-index: 1;

  @media (max-width: 768px) {
    border-radius: 0.9375em;
    width: 19.6875em;
    padding: 1.25em;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.875em;

  @media (max-width: 768px) {
    gap: 1.25em;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25em;

  @media (max-width: 768px) {
    gap: 0.9375em;
  }
`;

const InputWrapper = styled.div`
  border-bottom: 1px solid var(--Grayscale-900, #383846);
  display: flex;
  flex-direction: column;
`;

const InputText = styled.div`
  color: var(--Grayscale-1000, #1E1E2B);
  font-family: 'Pretendard-Bold';
  font-size: 0.875em;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const StyledInput = styled.input`
  border: none;
  width: 90%;
  height: 2em;
  outline: none;

  &::placeholder {
    color: var(--Grayscale-200, #C6C5D7);
    font-family: 'Pretendard-Medium';
    line-height: 130%;
  }

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const PassWordInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledEyeSlashIcon = styled(EyeSlashIcon)`
  width: 1em;
  height: 1em;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 0.75em;
    height: 0.75em;
  }
`;
const StyledEyeIcon = styled(EyeIcon)`
  width: 1em;
  height: 1em;
  cursor: pointer;

  @media (max-width: 768px) {
    width: 0.75em;
    height: 0.75em;
  }
`;

const LoginStateWrapper = styled.div`
  display: flex;
  flex-directon: column;
  align-items: center;
  justify-content: end;
`;

const StyledCheckbox = styled.div`
  border: ${(props) => (props.isCheck ? '1px solid #718FF2' : '1px solid #1E1E2B')};
  border-radius: 0.2em;
  width: 0.75em;
  height: 0.75em;
  line-height: 0.9em;
  text-align: center;
  background-color: ${(props) => (props.isCheck ? '#718FF2' : 'transparent')};
  color: ${(props) => (props.isCheck ? '#FFF' : 'transparent')};
  transition: all 0.2s ease;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.65625em;
  }
`;

const CheckboxText = styled.div`
  padding-left: 0.4em;
  color: var(--Grayscale-1000, #1E1E2B);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.65625em;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const LoginButton = styled.button`
  all: unset;
  border: none;
  display: flex;
  height: 3.125em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  border-radius: 2.5em;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
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
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    height: 2.25em;
    gap: 0.46875em;
  }
`;

const LoginText = styled.div`
  color: ${({type}) => (type == 'social' ? '#000' : '#FFF')};;
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const SocialLoginButton = styled.div`
  border: ${({type}) => (type == 'kakao' ? 'none' : '1px solid #B7C1D4')};
  display: flex;
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
  
  @media (max-width: 768px) {
    height: 2.25em;
    gap: 0.46875em;
  }
`;

const StyledKakaoLogo = styled(KakaoLogo)`
  width: 1.5625em;
  height: 1.458125em;
  z-index: 1;

  @media (max-width: 768px) {
    width: 1.171875em;
    height: 1.09375em;
  }
`;

const StyledGoogleLogo = styled(GoogleLogo)`
  width: 1.5625em;
  height: 1.5625em;
  z-index: 1;

  @media (max-width: 768px) {
    width: 1.171875em;
    height: 1.171875em;
  }
`;

const SignupSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625em;

  @media (max-width: 768px) {
    gap: 0.46875em;
  }
`;

const SignupText = styled.div`
  color: var(--Grayscale-1000, #1E1E2B);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.65625em;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8em;

  @media (max-width: 768px) {
    font-size: 0.65625em;
  }
`;
