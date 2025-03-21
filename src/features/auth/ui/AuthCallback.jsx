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
      console.log("userCode:", userCode);
      navigate('/signup');
    } else {
      localStorage.setItem("accessToken", accessToken);
      console.log("accessToken:", accessToken);
      navigate('/');
    }
  }, [userCode, accessToken, navigate]);

  return null;
};

export default AuthCallback;