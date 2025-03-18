import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userCode = searchParams.get('userCode'); // URL에서 인가코드 가져오기

  useEffect(() => {
    if (userCode) {
      localStorage.setItem("userCode", userCode); // 로컬 스토리지에 인가코드 저장
      console.log("userCode 저장:", userCode);
    }

    navigate('/signup');
  }, [userCode, navigate]);

  return null;
};

export default AuthCallback;
