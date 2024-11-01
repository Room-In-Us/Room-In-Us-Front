import { api } from "../API";

export const getStationListAPI = async () => {
    try {
        const response = await api.get(`themes/stations`);
        console.log('전체 응답:', response);
        return {
            stationList: response.data  // 역 리스트
        };

    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error; 
    }
};