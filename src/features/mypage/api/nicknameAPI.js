import { api } from '../../../app/API';

// 닉네임 수정 api
export const patchNicknameAPI = async (nickname) => {
  try {
    const response = await api.patch('/members/nickname', {
      nickname,
    });
    console.log('닉네임 수정 api 요청 성공: ', response);
    return response.data;
  } catch (error) {
    console.error("닉네임 수정 api 요청 실패: ", error);
    throw error;
  }
};
