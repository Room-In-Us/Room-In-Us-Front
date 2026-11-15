import { atom } from 'recoil';
import type { ThemeGenre } from '../../../shared/types/theme';

export const activeGenreState = atom<ThemeGenre>({
  key: 'activeGenreState',
  default: 'SENTIMENTAL',
});
