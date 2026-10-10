export type ThemeGenre =
  | 'SENTIMENTAL'
  | 'HORROR'
  | 'THRILLER'
  | 'DETECTIVE'
  | 'COMIC'
  | 'MYSTERY'
  | 'FANTASY'
  | 'ADVENTURE'
  | 'ESCAPE'
  | 'DRAMA'
  | 'ROMANCE'
  | 'SF'
  | 'HISTORY'
  | 'FAIRY_TALE'
  | 'ARCADE'
  | 'SURVIVAL'
  | 'PROBLEM'
  | 'ACTION'
  | 'ADULT'
  | 'OUTDOOR'
  | 'ETC';

export type ThemeProficiency = 'BEGINNER' | 'JUNIOR' | 'SENIOR' | 'MASTER';

export type ThemeSortOption =
  | 'HIGH_SATISFACTION_LEVEL'
  | 'MANY_REVIEW'
  | 'LOW_PRICE'
  | 'HIGH_LEVEL'
  | 'HIGH_HORROR_LEVEL'
  | 'HIGH_ACTIVITY_LEVEL';

export interface ThemeResponse {
  themeId: number;
  locationName: string;
  awardsYear: number | null;
  img: string;
  satisfactionLevel: number | null;
  level: number;
  playTime: number;
  storeName: string;
  themeName: string;
  isLiked: boolean;
  genreList: ThemeGenre[] | null;
  price: number | null;
  maxHeadcount: number | null;
}
