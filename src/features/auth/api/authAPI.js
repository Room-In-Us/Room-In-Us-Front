import { api } from '../../../app/API';

// 회원가입 api (레거시)
export const postSignupAPI = async (data) => {
  try {
    console.log(data);
    const response = await api.post('v0/sign-up', data);
    console.log('회원가입 api 전체 응답:', response);

    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};

// 로그인 api
export const postLoginAPI = async (data) => {
  try {
    console.log(data);
    const response = await api.post('login', data);
    console.log('로그인 api 전체 응답:', response);

    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
