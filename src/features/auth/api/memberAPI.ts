import { api } from "../../../app/API";
import type { MemberPreferenceResponse } from "../../../shared/types/preference";
import type { MemberIdPathParam, MemberInfoResponse } from "./types";

// 내 정보 조회 api
export const getMemberInfoAPI = async (): Promise<MemberInfoResponse> => {
  try {
    const response = await api.get<MemberInfoResponse>('members');
    console.log('내 정보 조회 api 요청 성공:', response);

    return response.data;
  } catch (error) {
    console.error('내 정보 조회 api 요청 실패:', error);
    throw error;
  }
};

// 유저 정보 조회 api
export const getUserInfoAPI = async (
  memberId: MemberIdPathParam,
): Promise<MemberPreferenceResponse> => {
  try {
    const response = await api.get<MemberPreferenceResponse>(`members/${memberId}/preferences`);
    console.log('유저 정보 조회 api 요청 성공:', response);

    return response.data;
  } catch (error) {
    console.error('유저 정보 조회 api 요청 실패:', error);
    throw error;
  }
};
