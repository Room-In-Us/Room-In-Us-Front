import { api } from '../../../app/API';
import type {
  DeleteReservationParams,
  GetMyReservationsQuery,
  GetThemeReservationListResponse,
  PatchThemeReservationInput,
  PatchThemeReservationRequest,
  PostThemeReservationInput,
  PostThemeReservationResponse,
  ReservationMutationResponse,
  ReservationPathParam,
  ReservationRequestDateTimeInput,
} from './types';

export const getMyReservationsAPI = async (
  year: GetMyReservationsQuery['year'],
  month: GetMyReservationsQuery['month'],
): Promise<GetThemeReservationListResponse> => {
  try {
    const params: GetMyReservationsQuery = {
      year,
      month,
    };

    const response = await api.get<GetThemeReservationListResponse>('members/reservations', { params });
    console.log('예약한 방탈출 목록 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 api 요청 실패: ', error);
    throw error;
  }
}

export const addReservationsAPI = async (
  themeId: ReservationPathParam,
  reservedAt: ReservationRequestDateTimeInput,
): Promise<PostThemeReservationResponse> => {
  try {
    const params: PostThemeReservationInput = {
      reservedAt,
    };

    const response = await api.post<PostThemeReservationResponse>(`themes/${themeId}/reservations`, params);
    console.log('방탈출 테마 예약 생성 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('방탈출 테마 예약 생성 api 요청 실패: ', error);
    throw error;
  }
}

export const deleteReservationAPI = async (
  themeId: ReservationPathParam,
  reservationId: ReservationPathParam,
): Promise<ReservationMutationResponse> => {
  try {
    const params: DeleteReservationParams = {
      themeId,
      reservationId,
    };

    const response = await api.delete<ReservationMutationResponse>(
      `themes/${themeId}/reservations/${reservationId}`,
      {params},
    );
    console.log('예약한 방탈출 목록 삭제 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 삭제 실패: ', error);
    throw error;
  }
}

export const patchReservationAPI = async (
  themeId: ReservationPathParam,
  reservationId: ReservationPathParam,
  reservedAt: ReservationRequestDateTimeInput,
  newThemeId: PatchThemeReservationRequest['themeId'],
): Promise<ReservationMutationResponse> => {
  try {
    const body: PatchThemeReservationInput = { themeId: newThemeId, reservedAt };
    const response = await api.patch<ReservationMutationResponse>(
      `themes/${themeId}/reservations/${reservationId}`,
      body,
    );
    console.log('예약한 방탈출 목록 수정 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 수정 실패: ', error);
    throw error;
  }
}
