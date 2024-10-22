import axios from 'axios';

// localStorage에서 accessToken 가져오기
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

// localStorage에서 refreshToken 가져오기 (필요시 사용 가능)
export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

// 테스트용으로 환경변수에 저장된 Access Token (임시로 사용, 실제 배포 시에는 제거)
const testToken = import.meta.env.VITE_TEST_TOKEN;

// axios 인스턴스 생성
export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터를 사용해 매 요청마다 Authorization 헤더에 토큰 추가
api.interceptors.request.use(
    (config) => {
        let token = getAccessToken();  // 로컬스토리지에서 토큰 가져오기
        if (!token) {
            console.warn('Access token이 없어서 테스트 토큰을 사용합니다.');
            token = testToken;  // 로컬스토리지에 없으면 테스트 토큰 사용
        }
        config.headers['Authorization'] = `Bearer ${token}`;  // Authorization 헤더에 토큰 추가
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
