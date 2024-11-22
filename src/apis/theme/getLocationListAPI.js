import { api } from "../API";

// 지역 목록 조회 api
// export const getStationListAPI = async () => {
//     try {
//         const response = await api.get(`themes/stations`);
//         console.log('전체 응답:', response);
//         return {
//             stationList: response.data  // 역 리스트
//         };

//     } catch (error) {
//         console.error('API 요청 중 오류 발생:', error);
//         throw error; 
//     }
// };

// 지역 목록 조회 api
export const getLocationListAPI = async (category, value, page) => {
    try {
        const response = await api.get(`themes/home/location`, {
            params: {
                category: category,  // 카테고리(City, Station, Point)
                value: value,  // 아이디 값
                page: page,  // 페이지
            },
        });
        console.log('전체 응답:', response);
        return {
            contents: response.data.contents  // 리스트(id, name, address, longitude, latitude)
        };

    } catch (error) {
        console.error('API 요청 중 오류 발생:', error);
        throw error; 
    }
};