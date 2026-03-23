import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMemberInfoAPI } from '../api/memberAPI';
import { pushLoginSuccessUserId } from '../../../shared/utils/analytics';

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
          const memberInfo = await getMemberInfoAPI();
          pushLoginSuccessUserId(memberInfo.memberId);
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
