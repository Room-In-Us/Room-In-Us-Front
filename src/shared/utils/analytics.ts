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
