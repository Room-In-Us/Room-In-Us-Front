import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { postRefreshTokenAPI } from '../features/auth/api/authAPI';
import {
  getAuthSessionGeneration,
  invalidateAuthSession,
  isAuthSessionCurrent,
  recordRefreshedAuthSessionToken,
  synchronizeAuthSessionToken,
} from '../shared/auth/sessionState';
import type { ApiErrorResponse } from '../shared/types/api';

import axios from 'axios';

type RefreshQueueCallback = (newToken: string | null) => void;
type RefreshContext = {
  generation: number;
  queue: RefreshQueueCallback[];
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL_API,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const onLoginPage = () => window.location.pathname === '/login';
const sessionChangedError = () => new axios.CanceledError('Authentication session changed');

const isStaleRequest = (config: InternalAxiosRequestConfig) =>
  config.__authSessionGeneration !== undefined && !isAuthSessionCurrent(config.__authSessionGeneration);

// 요청 인터셉터: 로컬스토리지 토큰이 있으면 Authorization 추가
api.interceptors.request.use(
  (config) => {
    if (config.__skipAuth) return config;

    synchronizeAuthSessionToken();
    config.__authSessionGeneration ??= getAuthSessionGeneration();
    if (isStaleRequest(config)) throw sessionChangedError();

    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: unknown) => {
    throw error;
  },
  { synchronous: true },
);

// 이전 세션의 재발급 결과가 새 세션의 대기 요청을 처리하지 않도록 분리합니다.
const refreshContexts = new Map<number, RefreshContext>();

const drainRefreshQueue = (context: RefreshContext, newToken: string | null) => {
  const callbacks = context.queue;
  context.queue = [];
  callbacks.forEach((callback) => callback(newToken));
};

const isRefreshOrLogout = (url = '') => url.startsWith('access-token') || url.startsWith('members/logout');

api.interceptors.response.use(
  (res) => {
    synchronizeAuthSessionToken();
    if (isStaleRequest(res.config)) throw sessionChangedError();
    return res;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const { response, config } = error;
    if (!config) return Promise.reject(error);
    synchronizeAuthSessionToken();
    if (isStaleRequest(config)) return Promise.reject(sessionChangedError());
    if (!response) return Promise.reject(error);

    const status = response.status;
    const url = (config?.url || '').toString();

    const hasBearer = !!localStorage.getItem('accessToken');

    // 재발급 금지 조건들
    const skip =
      onLoginPage() || // 로그인 화면에서는 절대 재발급 금지
      config.__skipRefresh === true || // 명시적 스킵
      isRefreshOrLogout(url); // 재발급/로그아웃 API는 재발급 시도하지 않음

    if (skip) {
      return Promise.reject(error);
    }

    // 보호 API에서만 401 처리
    if (status === 401 && !config._retry && hasBearer) {
      config._retry = true;
      const generation = config.__authSessionGeneration ?? getAuthSessionGeneration();

      // 이미 재발급 중이면 큐 대기
      const pendingRefresh = refreshContexts.get(generation);
      if (pendingRefresh) {
        return new Promise((resolve, reject) => {
          pendingRefresh.queue.push((newToken) => {
            if (!isAuthSessionCurrent(generation)) {
              reject(sessionChangedError());
            } else if (newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(config));
            } else {
              reject(error);
            }
          });
        });
      }

      const context: RefreshContext = { generation, queue: [] };
      refreshContexts.set(generation, context);
      try {
        const data = await postRefreshTokenAPI();
        if (!isAuthSessionCurrent(generation)) throw sessionChangedError();
        const newToken = data?.accessToken;
        if (!newToken) throw new Error('no accessToken in refresh response');

        localStorage.setItem('accessToken', newToken);
        recordRefreshedAuthSessionToken(generation, newToken);
        window.dispatchEvent(new Event('accessTokenRefreshed'));
        if (!isAuthSessionCurrent(generation)) throw sessionChangedError();

        drainRefreshQueue(context, newToken);

        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (e) {
        // 현재 세션의 재발급 실패만 로그아웃으로 반영합니다.
        if (isAuthSessionCurrent(generation)) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userCode');
          invalidateAuthSession('expired');
        }
        drainRefreshQueue(context, null);
        return Promise.reject(e);
      } finally {
        if (refreshContexts.get(generation) === context) {
          refreshContexts.delete(generation);
        }
      }
    }

    return Promise.reject(error);
  },
);
