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

// 유저 정보 모달 상태
export const userInfoModalState = atom({
  key: 'userInfoModalState',
  default: false,
});

// 정보 조회용 유저 ID
export const userInfoIdState = atom({
  key: 'userInfoIdState',
  default: null,
});

// 정보 조회용 유저 이름
export const userInfoNameState = atom({
  key: 'userInfoNameState',
  default: null,
});