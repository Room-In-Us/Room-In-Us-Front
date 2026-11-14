import { useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { checkAuthSession } from '../../../shared/auth/authSession';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userCode = searchParams.get('userCode'); // URL에서 유저코드 추출
  const accessToken = searchParams.get('accessToken'); // URL에서 토큰 추출
  const mountedCallback = useRef(false);
  const callbackGeneration = useRef(0);

  useLayoutEffect(() => {
    mountedCallback.current = true;
    callbackGeneration.current += 1;
    return () => {
      mountedCallback.current = false;
      callbackGeneration.current += 1;
    };
  }, [userCode, accessToken, navigate]);

  useEffect(() => {
    const generation = callbackGeneration.current;
    let active = true;
    const handleAuthCallback = async () => {
      const isCurrent = () => active && mountedCallback.current && callbackGeneration.current === generation;
      if (!isCurrent()) return;
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
          if (!isCurrent() || !memberInfo) return;
        } catch (error) {
          if (!isCurrent()) return;
          console.error('로그인 사용자 정보 조회 실패:', error);
        }

        // URL 정리
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/home');
      }
    };

    handleAuthCallback();
    return () => { active = false; };
  }, [userCode, accessToken, navigate]);

  return null;
};

export default AuthCallback;
