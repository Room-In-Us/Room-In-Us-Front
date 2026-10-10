export interface SignUpRequest {
  code: string | null;
  nickname: string;
  isTermAgreed: boolean;
  isPrivacyAgreed: boolean;
  isMarketingAgreed: boolean;
}

export interface SignUpResponse {
  memberId?: number;
  accessToken?: string;
  refreshToken?: string;
}

export interface NicknameRequest {
  nickname: string;
}

export interface NicknameResponse {
  isAvailable?: boolean;
}

export type LogoutResponse = string;

export interface RefreshTokenResponse {
  accessToken?: string;
  refreshToken?: string;
}
