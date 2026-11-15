import type { PreferenceActivity, PreferenceDevice, PreferenceElement, PreferenceHorrorPosition } from './preference';
import type { ThemeGenre, ThemeProficiency } from './theme';

// 가입 설문과 마이페이지에서 각각 편집하는 UI 상태. API 응답 DTO와 구분한다.
export interface PreferenceDraft {
  proficiency: ThemeProficiency | null;
  preferredGenreList: ThemeGenre[];
  preferredHeadcount: number | null;
  preferredElementList: PreferenceElement[];
  preferredActivity: PreferenceActivity | null;
  preferredDevice: PreferenceDevice | null;
  horrorPos: PreferenceHorrorPosition | null;
  preference: string | null;
}
