import {api} from '../../../app/API';

// 후기 작성 api
export const postReviewAPI = async (themeId, reviewData) => {
  try {
    const response = await api.post(`themes/${themeId}/reviews`, reviewData);
    console.log('후기 작성 api 요청 성공:', response.data);

    return {
      success: true,
      data: response.data
    };

  } catch (error) {
    let serverMessage = '알 수 없는 오류가 발생했습니다.';

    if (error.response) {
      serverMessage = error.response.data?.message ?? serverMessage;
      console.error('후기 작성 api 요청 실패:', serverMessage);
    } else if (error.request) {
      serverMessage = '서버로부터 응답이 없습니다.';
    } else {
      serverMessage = `요청 오류: ${error.message}`;
    }

    return {
      success: false,
      message: serverMessage
    };
  }
};