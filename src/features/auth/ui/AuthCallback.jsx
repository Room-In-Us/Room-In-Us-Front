import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userCode = searchParams.get('userCode'); // URL에서 유저코드 추출
  const accessToken = searchParams.get('accessToken'); // URL에서 토큰 추출

  useEffect(() => {
    if (userCode) {
      localStorage.setItem("userCode", userCode);
      // URL 정리
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/signup');
    } else if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      // URL 정리
      window.history.replaceState({}, document.title, window.location.pathname);
      navigate('/');
    }
  }, [userCode, accessToken, navigate]);

  return null;
};

export default AuthCallback;