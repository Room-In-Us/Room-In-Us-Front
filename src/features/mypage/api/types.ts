export interface FavoriteThemesQuery {
  headcount: number;
  page: number;
  size: number;
}

export interface PatchNicknameRequest {
  nickname: string;
}

export type PatchNicknameResponse = string;
