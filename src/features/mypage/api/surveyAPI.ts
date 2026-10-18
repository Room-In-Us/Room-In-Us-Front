import { api } from '../../../app/API';
import type {
  MemberPreferenceResponse,
  PatchMemberPreferenceRequest,
  PatchMemberPreferenceResponse,
} from '../../../shared/types/preference';

// 방탈출 성향 조회 api
export const getPreferencesAPI = async (): Promise<MemberPreferenceResponse> => {
  try {
    const response = await api.get<MemberPreferenceResponse>('members/preferences');
    console.log('성향조회 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('성향조회 api 요청 실패: ', error);
    throw error;
  }
};

// 방탈출 성향 작성 api
export const patchPreferencesAPI = async (
  data: PatchMemberPreferenceRequest,
): Promise<PatchMemberPreferenceResponse> => {
  try {
    console.log("성향작성 요청 데이터: ", data);
    const response = await api.patch<PatchMemberPreferenceResponse>('members/preferences', data);
    console.log('성향작성 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('성향작성 api 요청 실패: ', error);
    throw error;
  }
};
