import { atom } from "recoil";

// 성향조사 섹션 상태
export const surveySectionState = atom({
  key: 'surveySectionState',
  default: 'proficiency',
});

// 성향조사 데이터 상태
export const surveyState = atom({
  key: 'surveyState',
  default: {
    proficiency: null,
    preferredGenreList: [],
    preferredHeadcount: null,
    preferredElementList: [],
    preferredActivity: null,
    preferredDevice: null,
    horrorPos: null,
    preference: null,
  },
});
