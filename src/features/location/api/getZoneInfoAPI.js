import { api } from '../../../app/API';

export const getZoneInfoAPI = async (regionId, zoneId) => {
      try {
        const response = await api.get(`location/regions/${regionId}/zones/${zoneId}/zone-info`);
        console.log('전체 응답:', response.data);
        return {
          data: response.data,
        };
      } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error;
      }
    };