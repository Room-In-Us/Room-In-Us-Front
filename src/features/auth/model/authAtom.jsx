import { atom } from "recoil";

// 회원가입 섹션 상태
export const signupSectionState = atom({
  key: 'signupSectionState',
  default: 'nickname',
});
