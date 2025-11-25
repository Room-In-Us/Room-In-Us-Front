import { postRefreshTokenAPI } from '../features/auth/api/authAPI';

import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const onLoginPage = () => window.location.pathname === '/login';

// 요청 인터셉터: 로컬스토리지 토큰이 있으면 Authorization 추가
api.interceptors.request.use((config) => {
  if (config.__skipAuth) return config;

  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 재발급 큐/락
let isRefreshing = false;
let queue = [];

const isRefreshOrLogout = (url = '') =>
  url.startsWith('access-token') || url.startsWith('members/logout');

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;
    if (!response) return Promise.reject(error);

    const status = response.status;
    const url = (config?.url || '').toString();

    const hasBearer = !!localStorage.getItem('accessToken');

    // 재발급 금지 조건들
    const skip =
      onLoginPage() ||                      // 로그인 화면에서는 절대 재발급 금지
      config.__skipRefresh === true ||      // 명시적 스킵
      isRefreshOrLogout(url);               // 재발급/로그아웃 API는 재발급 시도하지 않음

    if (skip) {
      return Promise.reject(error);
    }

    // 보호 API에서만 401 처리
    if (status === 401 && !config._retry && hasBearer) {
      config._retry = true;

      // 이미 재발급 중이면 큐 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(config));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      try {
        const data = await postRefreshTokenAPI();
        const newToken = data?.accessToken;
        if (!newToken) throw new Error('no accessToken in refresh response');

        localStorage.setItem('accessToken', newToken);
        window.dispatchEvent(new Event('accessTokenRefreshed'));

        queue.forEach((cb) => cb(newToken));
        queue = [];

        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (e) {
        // 재발급 실패 -> 완전 로그아웃
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userCode');
        queue.forEach((cb) => cb(null));
        queue = [];
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);