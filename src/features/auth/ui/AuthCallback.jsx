import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkAuthSession } from '../../../shared/auth/authSession';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userCode = searchParams.get('userCode'); // URL에서 유저코드 추출
  const accessToken = searchParams.get('accessToken'); // URL에서 토큰 추출

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (userCode) {
        localStorage.setItem('userCode', userCode);
        // URL 정리
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/signup');
        return;
      }

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);

        try {
          const memberInfo = await checkAuthSession({ force: true });
          if (!memberInfo) return;
        } catch (error) {
          console.error('로그인 사용자 정보 조회 실패:', error);
        }

        // URL 정리
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/home');
      }
    };

    handleAuthCallback();
  }, [userCode, accessToken, navigate]);

  return null;
};

export default AuthCallback;
