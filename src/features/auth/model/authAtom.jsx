import { atom } from "recoil";

// 회원가입 섹션 상태
export const signupSectionState = atom({
  key: 'signupSectionState',
  default: 'nickname',
});

// 회원가입 시 닉네임 저장
export const nicknameBackupState = atom({
  key: 'nicknameBackupState',
  default: '',
});
