import { api } from '../../../app/API';

// 회원가입 api (레거시)
export const postLegacySignupAPI = async (data) => {
  try {
    console.log("회원가입 요청 데이터: ", data);
    const response = await api.post('v0/sign-up', data);
    console.log('회원가입 api 전체 응답:', response);

    return response.data;
  } catch (error) {
    console.error('회원가입 api 요청 중 오류 발생: ', error);
    throw error;
  }
};

// 회원가입 api
export const postSignupAPI = async (data) => {
  try {
    const response = await api.post('sign-up', data);
    console.log('회원가입 성공: ', response.data);
    return response.data;
  } catch (error) {
    console.error('회원가입 api 요청 중 오류 발생: ', error);
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
    console.error('로그인 api 요청 중 오류 발생: ', error);
    throw error;
  }
};

// 닉네임 중복검사 api
export const postNicknameAPI = async (data) => {
  try {
    console.log(data);
    const response = await api.post('sign-up/nickname', data);
    return response.data;
  } catch (error) {
    console.error('닉네임 중복검사 api 요청 중 오류 발생: ', error);
    throw error;
  }
};