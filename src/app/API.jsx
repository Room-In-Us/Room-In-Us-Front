import axios from 'axios';

// axios 인스턴스 생성
export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL_API,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 포함 설정
});

// 요청 인터셉터 (이제 Authorization 헤더는 사용하지 않음)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("accessToken");
    const token = import.meta.env.VITE_TEST_TOKEN; // 임시로 테스트 토큰 사용
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
