import { api } from "../../../app/API";

export const getThemesAPI = async ({keyword, page, size}) => {
  try {

    const params = {
      keyword, 
      page,
      size, 
    };

    if (keyword) params.keyword = keyword;
    
    const response = await api.get('themes', { params });
    console.log('전체 검색 api 요청 결과:', response);
    return response.data;
  } catch (error) {
    console.error('전체 검색 중 오류 발생: ', error);
    throw error;
  }
};