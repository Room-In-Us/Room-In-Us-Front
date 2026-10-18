import { api } from '../../../app/API';
import type { PatchNicknameRequest, PatchNicknameResponse } from './types';

// 닉네임 수정 api
export const patchNicknameAPI = async (
  nickname: PatchNicknameRequest['nickname'],
): Promise<PatchNicknameResponse> => {
  try {
    const response = await api.patch<PatchNicknameResponse>('/members/nickname', {
      nickname,
    } satisfies PatchNicknameRequest);
    console.log('닉네임 수정 api 요청 성공: ', response);
    return response.data;
  } catch (error) {
    console.error("닉네임 수정 api 요청 실패: ", error);
    throw error;
  }
};
