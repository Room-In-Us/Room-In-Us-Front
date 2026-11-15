import { atom } from 'recoil';
import type { PreferenceDraft } from '../../../shared/types/preferenceDraft';

export type SurveySection = 'proficiency' | 'genre' | 'headcount' | 'preference' | 'position' | 'info' | 'complete';

// 성향조사 섹션 상태
export const surveySectionState = atom<SurveySection>({
  key: 'surveySectionState',
  default: 'proficiency',
});

// 성향조사 데이터 상태
export const surveyState = atom<PreferenceDraft>({
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

// 모달 상태
export const modalState = atom<boolean>({
  key: 'modalState',
  default: false,
});
