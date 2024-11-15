import { atom } from "recoil";

// 지역 상태
export const locationState = atom({
    key: "locationState",
    default: ""
});
export const locationVisible = atom({
    key: "locationVisible",
    default: false
});


// 배경
export const backgroundVisible = atom({
    key: "backgroundVisible",
    default: false
});


// 역 상태
export const stationState = atom({
    key: "stationState",
    default: ""
});
export const stationVisible = atom({
    key: "stationVisible",
    default: false
});
export const stationNameState = atom({
    key: 'stationNameState',
    default: '',
});


// 카페 상태
export const cafeState = atom({
    key: "cafeState",
    default: ""
});
export const cafeVisible = atom({
    key: "cafeVisible",
    default: false
});
export const cafeNameState = atom({
    key: 'cafeNameState',
    default: '',
});


// 테마 상태
export const themeState = atom({
    key: "themeState",
    default: ""
});
export const themeVisible = atom({
    key: "themeVisible",
    default: false
});


// 구글 맵
export const mapsLoadedState = atom({
    key: 'mapsLoadedState',
    default: false,
});


// 위치별 위도, 경도 리스트
export const stationLatAndLngList = atom({
    key: 'stationLatAndLngList',
    default: [],
});
export const cafeLatAndLngList = atom({
    key: 'cafeLatAndLngList',
    default: [],
});

// 위치별 중앙 좌표
export const locationCenterState = atom({
    key: 'locationCenterState',
    default: {},
});

// 역 중앙 좌표
export const stationCenterState = atom({
    key: 'stationCenterState',
    default: {},
});