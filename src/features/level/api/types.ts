import type { ThemeProficiency, ThemeSortOption } from '../../../shared/types/theme';

export type ZoneIdListInput = number | number[] | null | undefined;

export interface LevelThemeListQuery {
  proficiency: ThemeProficiency;
  headcount: number;
  page: number;
  size: number;
  sortOption?: ThemeSortOption;
  keyword?: string;
  regionId?: number;
  zoneIdList?: string;
}
