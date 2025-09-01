import { api } from '../../../app/API';

export const addReservationsAPI = async (themeId, reservedAt) => {
  try {
    const params = {
      reservedAt,
    };

    const response = await api.post(`themes/${themeId}/reservations`, params);
    console.log('방탈출 테마 예약 생성 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('방탈출 테마 예약 생성 api 요청 실패: ', error);
    throw error;
  }
}