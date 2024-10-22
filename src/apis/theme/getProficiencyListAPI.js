import { api } from "../API";

export const getProficiencyListAPI = async (proficiency, page) => {
    try {
        const response = await api.get(`themes/home/proficiency`, {
            params: {
                proficiency: proficiency,  // 레벨
                page: page,  // 페이지
            },
        });
        console.log('전체 응답:', response);
        return {
            profName: response.data.profName,  // 레벨
            profDescription: response.data.profDescription,  // 설명
            contents: response.data.proficiencyDataList.contents  // 리스트
        };

    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error; 
    }
};