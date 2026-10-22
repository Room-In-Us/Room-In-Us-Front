import { atom } from 'recoil';

export type SignupSection = 'nickname' | 'agree' | 'complete';

// 회원가입 섹션 상태
export const signupSectionState = atom<SignupSection>({
  key: 'signupSectionState',
  default: 'nickname',
});

// 회원가입 시 닉네임 저장
export const nicknameBackupState = atom<string>({
  key: 'nicknameBackupState',
  default: '',
});

// 유저 정보 모달 상태
export const userInfoModalState = atom<boolean>({
  key: 'userInfoModalState',
  default: false,
});

// 정보 조회용 유저 ID
export const userInfoIdState = atom<number | string | null>({
  key: 'userInfoIdState',
  default: null,
});

// 정보 조회용 유저 이름
export const userInfoNameState = atom<string | null>({
  key: 'userInfoNameState',
  default: null,
});
