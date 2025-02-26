import { api } from "../../../app/API";

// 내 정보 조회 api
export const getMemberInfoAPI = async () => {
  try {
    const response = await api.get('members');
    console.log('내 정보 조회 api 전체 응답:', response);

    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};