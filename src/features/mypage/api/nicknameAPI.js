import { api } from '../../../app/API';

// 닉네임 수정 api
export const patchNicknameAPI = async (nickname) => {
  try {
    const response = await api.patch('/members/nickname', {
      nickname,
    });
    return response.data;
  } catch (error) {
    console.error("닉네임 수정 api 요청 중 오류 발생: ", error);
    throw error;
  }
};
