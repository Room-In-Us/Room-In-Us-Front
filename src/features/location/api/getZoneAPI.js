import { api } from '../../../app/API';

export const getZoneAPI = async (regionId) => {
  try {
    const response = await api.get(`location/regions/${regionId}/zones`);
    console.log('전체 응답:', response.data);
    return {
      data: response.data,
    };
  } catch (error) {
    console.error('API 요청 중 오류 발생:', error);
    throw error;
  }
};
