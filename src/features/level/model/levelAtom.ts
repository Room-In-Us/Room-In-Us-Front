import { atom } from 'recoil';
import type { ThemeProficiency } from '../../../shared/types/theme';

export const activeLevelState = atom<ThemeProficiency>({
  key: 'activeLevelState',
  default: 'BEGINNER',
});
