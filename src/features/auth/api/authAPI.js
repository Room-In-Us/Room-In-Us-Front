import { api } from '../../../app/API';

// 회원가입 api
export const postSignupAPI = async (data) => {
  try {
    console.log(data);
    const response = await api.post('sign-up', data);
    console.log('전체 응답:', response);

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
    console.log('전체 응답:', response);

    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
