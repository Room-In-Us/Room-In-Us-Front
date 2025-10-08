import axios from 'axios';
import { postRefreshTokenAPI } from '../features/auth/api/authAPI';

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
    const token = localStorage.getItem("accessToken");
    // const token = import.meta.env.VITE_TEST_TOKEN; // 임시로 테스트 토큰 사용
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/* 토큰 재발급 인터셉터(에러 발생 시 수정) */
let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response) return Promise.reject(error);

    // 401 처리
    if (response.status === 401 && !config._retry) {
      config._retry = true;

      // 이미 토큰 재발급 중이면 큐에 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(api(config));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        // 토큰 재발급
        const data = await postRefreshTokenAPI();
        const newToken = data.accessToken;
        localStorage.setItem('accessToken', newToken);

        // 대기 중 요청 처리
        queue.forEach((cb) => cb(newToken));
        queue = [];

        // 현재 요청 다시 실행
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        // 재발급 실패
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userCode');
        window.location.replace('/login');
        queue.forEach((cb) => cb(null));
        queue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
