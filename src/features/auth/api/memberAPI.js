import { api } from "../../../app/API";

// 내 정보 조회 api
export const getMemberInfoAPI = async () => {
  try {
    const response = await api.get('members');
    console.log('내 정보 조회 api 요청 성공:', response);

    return response.data;
  } catch (error) {
    console.error('내 정보 조회 api 요청 실패:', error);
    throw error;
  }
};

// 유저 정보 조회 api
export const getUserInfoAPI = async (memberId) => {
  try {
    const response = await api.get(`members/${memberId}/preferences`);
    console.log('유저 정보 조회 api 요청 성공:', response);

    return response.data;
  } catch (error) {
    console.error('유저 정보 조회 api 요청 실패:', error);
    throw error;
  }
};
