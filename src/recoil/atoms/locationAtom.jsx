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


// 초성 상태
export const initialState = atom({
    key: "initialState",
    default: ""
});
export const initialVisible = atom({
    key: "initialVisible",
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


// 카페 상태
export const cafeState = atom({
    key: "cafeState",
    default: ""
});
export const cafeVisible = atom({
    key: "cafeVisible",
    default: false
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