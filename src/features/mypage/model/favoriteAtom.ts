import { atom } from 'recoil';

export const headCountState = atom<number>({
  key: 'headCountState',
  default: 2,
});
