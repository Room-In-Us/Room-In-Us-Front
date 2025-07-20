import { api } from '../../../app/API';

// 방탈출 성향 작성 api
export const patchPreferencesAPI = async (data) => {
  try {
    console.log("성향작성 요청 데이터: ", data);
    const response = await api.patch('members/preferences', data);
    console.log('성향작성 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('성향작성 api 요청 실패: ', error);
    throw error;
  }
};
