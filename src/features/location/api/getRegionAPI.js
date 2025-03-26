import { api } from '../../../app/API';

export const getRegionAPI = async () => {
    try {
        const response = await api.get(`location/regions`);
        console.log('전체 응답:', response.data);
        return {
          contents: response.data,
        };
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error;
      }
}
