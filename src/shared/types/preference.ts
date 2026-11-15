import type { ThemeGenre, ThemeProficiency } from './theme';

export type PreferenceElement =
  | 'STORY'
  | 'INTERIOR'
  | 'DIRECTION'
  | 'VOLUME'
  | 'PROBLEM'
  | 'PRICE';

export type PreferenceActivity = 'HIGH' | 'LOW' | 'NO_MATTER';

export type PreferenceDevice = 'DEVICE' | 'LOCK' | 'NO_MATTER';

export type PreferenceHorrorPosition =
  | 'FEARLESS'
  | 'FEARFUL_TANK'
  | 'RELUCTANT_TANK'
  | 'NERVOUS'
  | 'SCARED'
  | 'EXTREME_SCARED';

export interface MemberPreferenceResponse {
  memberId?: number;
  proficiency?: ThemeProficiency | null;
  preferredGenreList?: ThemeGenre[] | null;
  preferredHeadcount?: number | null;
  preferredElementList?: PreferenceElement[] | null;
  preferredActivity?: PreferenceActivity | null;
  preferredDevice?: PreferenceDevice | null;
  horrorPos?: PreferenceHorrorPosition | null;
  preference?: string | null;
}

export interface PatchMemberPreferenceRequest {
  proficiency: ThemeProficiency | null;
  preferredGenreList: ThemeGenre[];
  preferredHeadcount: number | null;
  preferredElementList: PreferenceElement[];
  preferredActivity: PreferenceActivity | null;
  preferredDevice: PreferenceDevice | null;
  horrorPos: PreferenceHorrorPosition | null;
  preference: string | null;
}

export type PatchMemberPreferenceResponse = string;
