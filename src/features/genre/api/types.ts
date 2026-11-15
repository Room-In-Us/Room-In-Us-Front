import type { ThemeGenre, ThemeSortOption } from '../../../shared/types/theme';

export type ZoneIdListInput = number | number[] | null | undefined;

export interface GenreThemeListQuery {
  genre: ThemeGenre;
  headcount: number;
  page: number;
  size: number;
  sortOption?: ThemeSortOption;
  keyword?: string;
  regionId?: number;
  zoneIdList?: string;
}
