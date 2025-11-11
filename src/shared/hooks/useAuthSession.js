import { useEffect, useState } from 'react';
import { api } from '../../app/API';

// 로그인 상태 관리 훅
export default function useAuthSession() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const check = async () => {
    const onLogin = window.location.pathname === '/login';
  
    // 로그인 페이지에서는 members 호출 방지
    if (onLogin) {
      setIsLoggedIn(false);
      return;
    }
  
    try {
      const res = await api.get('members', {
        validateStatus: () => true,
      });
      setIsLoggedIn(res.status === 200);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    check();
    const onFocus = () => check();
    const onVis = () => document.visibilityState === 'visible' && check();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return isLoggedIn;
}