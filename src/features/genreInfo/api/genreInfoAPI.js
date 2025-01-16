import { api } from '../../../app/API';

export const getGenreRoomListAPI = async (genre, page) => {
  try {
    const response = await api.get('themes/home/genre', {
      params: {
        genre,
        page,
      },
    });
    console.log('전체 응답 :', response);
    return response.data;
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
