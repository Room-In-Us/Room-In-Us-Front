import { api } from '../../../app/API';

// 방탈출 테마 좋아요 api
export const postThemeLikeAPI = async (themeId) => {
  try {
    const response = await api.post(`themes/${themeId}/like`);
    console.log('방탈출 테마 좋아요 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('방탈출 테마 좋아요 api 요청 실패: ', error);
    throw error;
  }
};

// 방탈출 테마 좋아요 취소 api
export const deleteThemeLikeAPI = async (themeId) => {
  try {
    const response = await api.delete(`themes/${themeId}/like`);
    console.log('방탈출 테마 좋아요 취소 api 요청 성공: ', response);

    return response.data;
  } catch (error) {
    console.error('방탈출 테마 좋아요 취소 api 요청 실패: ', error);
    throw error;
  }
};