import { api } from '../../../app/API';

export const getMyReservationsAPI = async (year, month) => {
  try {
    const params = {
      year,
      month,
    };

    const response = await api.get('members/reservations', { params });
    console.log('예약한 방탈출 목록 api 전체 응답: ', response);

    return response.data;
  } catch (error) {
    console.error('예약한 방탈출 목록 api 요청 중 오류 발생: ', error);
    throw error;
  }
}