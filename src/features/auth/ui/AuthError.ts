import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AuthError() {
  const navigate = useNavigate();
  const hasRun = useRef(false); // useRef를 이용한 플래그 변수

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true; // 첫 실행 후 플래그 변경
      alert("에러가 발생하였습니다.");
      navigate('/login');
    }
  }, [navigate]);

  return null;
}

export default AuthError;
