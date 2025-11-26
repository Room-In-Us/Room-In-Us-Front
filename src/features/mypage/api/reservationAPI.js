import { api } from '../../../app/API';

export const getMyReservationsAPI = async (year, month) => {
  try {
    const params = {
      year,
      month,
    };

    const response = await api.get('members/reservations', { params });
    console.log('예약한 방탈출 목록 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 api 요청 실패: ', error);
    throw error;
  }
}

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

export const deleteReservationAPI = async (themeId, reservationId) => {
  try {
    const params = {
      themeId,
      reservationId,
    };

    const response = await api.delete(`themes/${themeId}/reservations/${reservationId}`, {params});
    console.log('예약한 방탈출 목록 삭제 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 삭제 실패: ', error);
    throw error;
  }
}

export const patchReservationAPI = async (themeId, reservationId, reservedAt, newThemeId) => {
  try {
    const body = { themeId: newThemeId, reservedAt };
    const response = await api.patch(`themes/${themeId}/reservations/${reservationId}`, body);
    console.log('예약한 방탈출 목록 수정 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 수정 실패: ', error);
    throw error;
  }
}