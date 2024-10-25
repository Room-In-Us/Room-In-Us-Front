import { api } from "../API";

export const getGenresListAPI = async () => {
    try {
        const response = await api.get(`themes/genres`);
        console.log('전체 응답 :', response);
        return response.data;

    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error; 
    }
};