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
    // Authorization 헤더를 제외해야 하는 경로 리스트
    // const noAuthPaths = [
    //   '/themes/proficiency',
    //   '/themes/genre',
    // ];

    // noAuthPaths 제외하고 Authorization 헤더를 추가할 필요가 없음 (쿠키 기반 인증)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);