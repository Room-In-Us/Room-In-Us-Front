import type { ThemeSortOption } from '../../../shared/types/theme';

export interface LocationThemeListQuery {
  storeId: number;
  headcount: number;
  page: number;
  size: number;
  sortOption?: ThemeSortOption;
}
