import type { PatchMemberPreferenceRequest } from '../types/preference';
import type { ThemeGenre, ThemeResponse } from '../types/theme';

const LAST_TRACKED_USER_ID_KEY = 'ga:lastTrackedUserId';

export const pushLoginSuccessUserId = (memberId: number | null | undefined): void => {
  if (memberId === null || memberId === undefined) return;

  const normalizedUserId = String(memberId);
  const lastTrackedUserId = sessionStorage.getItem(LAST_TRACKED_USER_ID_KEY);

  if (lastTrackedUserId === normalizedUserId) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'login_success',
    user_id: normalizedUserId,
  });

  sessionStorage.setItem(LAST_TRACKED_USER_ID_KEY, normalizedUserId);
};

export const clearTrackedUserId = (): void => {
  sessionStorage.removeItem(LAST_TRACKED_USER_ID_KEY);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'logout',
    user_id: null,
  });
};

type AnalyticsValue = string | number | boolean | null | undefined;

export function track(event: string, params: Record<string, AnalyticsValue> = {}, sourcePage?: string): void {
  if (typeof window === 'undefined') return;
  const values = Object.fromEntries(Object.entries(params).filter(([, value]) => value != null && value !== ''));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ...values, event, source_page: sourcePage ?? window.location?.pathname });
}

export function navigateAfterAnalytics(navigate: () => void): void {
  setTimeout(navigate, 120);
}

const genreCodes: Record<ThemeGenre, string> = {
  SENTIMENTAL: 'emotional', HORROR: 'horror', THRILLER: 'thriller', DETECTIVE: 'mystery',
  COMIC: 'comic', MYSTERY: 'mystery', FANTASY: 'fantasy', ADVENTURE: 'adventure', ESCAPE: 'escape',
  DRAMA: 'drama', ROMANCE: 'romance', SF: 'sf', HISTORY: 'history', FAIRY_TALE: 'fairytale',
  ARCADE: 'arcade', SURVIVAL: 'survival', PROBLEM: 'puzzle', ACTION: 'action', ADULT: 'adult',
  OUTDOOR: 'outdoor', ETC: 'etc',
};

export function trackGenreSelection(genre: ThemeGenre): void {
  track('select_genre', { genre_name: genreCodes[genre] });
}

export function trackThemeSelection(theme: ThemeResponse, listName: string, listPosition: number): void {
  const genre = theme.genreList?.[0];
  track('select_theme', {
    theme_id: theme.themeId,
    theme_name: theme.themeName,
    cafe_name: theme.storeName,
    region_name: theme.locationName,
    genre_name: genre && genreCodes[genre],
    level_name: theme.level,
    list_name: listName,
    list_position: listPosition,
  });
}

export function trackFavorite(themeId: number, adding: boolean, result: 'success' | 'fail' | 'need_login', sourcePage?: string): void {
  track('toggle_favorite', { theme_id: themeId, action: adding ? 'add' : 'remove', result }, sourcePage);
}

export function trackSearch(term: string, resultCount: number): void {
  const searchTerm = term.trim()
    .replace(/[\w.+-]+@[\w.-]+\.[\w-]+/g, '[email]')
    .replace(/(?:\+82[\s.-]?\(?|\(?0)(?:1[016789]|2|[3-6][1-5]|70)\)?[\s.-]?\d{3,4}[\s.-]?\d{4}/g, '[phone]')
    .slice(0, 100);
  if (!searchTerm) return;
  track('search_submit', { search_term: searchTerm, result_count: resultCount });
  if (resultCount === 0) track('search_no_result', { search_term: searchTerm });
}

export function trackListFilter(listName: string, filter: 'price_basis' | 'sort' | 'region', value: string | number): void {
  track('list_filter_change', { list_name: listName, filter_key: filter, filter_value: String(value) });
}

export function trackPreferences(preference: PatchMemberPreferenceRequest): void {
  if (typeof window === 'undefined') return;
  const genres = preference.preferredGenreList.map((genre) => genreCodes[genre]);
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'set_user_properties',
    user_level: preference.proficiency,
    pref_genres: genres.join(','),
    pref_member_count: preference.preferredHeadcount,
    pref_factors: preference.preferredElementList.join(','),
    pref_device_lock: preference.preferredDevice,
    pref_activity: preference.preferredActivity,
    horror_position: preference.horrorPos,
  });
  track('preference_submit', {
    level_name: preference.proficiency,
    genre_count: genres.length,
    member_count: preference.preferredHeadcount,
    horror_position: preference.horrorPos,
    has_free_text: Boolean(preference.preference?.trim()),
  });
}

type ReservableTheme = { themeId?: number; themeName?: string; storeInfo?: { storeName: string; storeReservationUrl: string } };

export function openTrackedReservation(theme: ReservableTheme): void {
  const url = theme.storeInfo?.storeReservationUrl;
  if (!url) return;
  let outboundDomain: string | undefined;
  try {
    outboundDomain = new URL(url, window.location.href).hostname;
  } catch {
    outboundDomain = undefined;
  }
  track('click_reserve', {
    theme_id: theme.themeId,
    theme_name: theme.themeName,
    cafe_name: theme.storeInfo?.storeName,
    outbound_domain: outboundDomain,
  });
  window.open(url, '_blank', 'noopener');
}
