import { atom } from 'recoil';
import type { PreferenceDraft } from '../../../shared/types/preferenceDraft';

// 성향조사 데이터 상태
export const surveyState = atom<PreferenceDraft>({
  key: 'myPageSurveyState',
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
