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