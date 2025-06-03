import { api } from '../../../app/API';

// 방탈출 성향 조회 api
export const getPreferencesAPI = async () => {
  try {
    const response = await api.get('members/preferences');
    console.log('성향조회 api 전체 응답: ', response);

    return response.data;
  } catch (error) {
    console.error('성향조회 api 요청 중 오류 발생: ', error);
    throw error;
  }
};

// 방탈출 성향 작성 api
export const patchPreferencesAPI = async (data) => {
  try {
    console.log("성향작성 요청 데이터: ", data);
    const response = await api.patch('members/preferences', data);
    console.log('성향작성 api 전체 응답: ', response);

    return response.data;
  } catch (error) {
    console.error('성향작성 api 요청 중 오류 발생: ', error);
    throw error;
  }
};
