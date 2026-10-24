import { getMemberInfoAPI } from '../../features/auth/api/memberAPI';
import type { MemberInfoResponse } from '../../features/auth/api/types';
import { pushLoginSuccessUserId } from '../utils/analytics';
import {
  completeAuthSessionCheck,
  getAuthSessionCheckedAt,
  getAuthSessionGeneration,
  getAuthSessionSnapshot,
  hasAuthSessionExpired,
  invalidateAuthSession,
  isAuthSessionCurrent,
  subscribeAuthSessionState,
  synchronizeAuthSessionToken,
} from './sessionState';

const REVALIDATE_AFTER_MS = 60_000;
let subscriberCount = 0;
let inFlight: {
  generation: number;
  promise: Promise<MemberInfoResponse | null>;
} | null = null;

export const checkAuthSession = ({ force = false }: { force?: boolean } = {}): Promise<MemberInfoResponse | null> => {
  synchronizeAuthSessionToken();
  const generation = getAuthSessionGeneration();

  if (window.location.pathname === '/login') {
    if (getAuthSessionSnapshot() === null) completeAuthSessionCheck(generation, false, null);
    return Promise.resolve(null);
  }

  if (inFlight?.generation === generation) return inFlight.promise;

  const checkedAt = getAuthSessionCheckedAt();
  if (!force && checkedAt !== null && Date.now() - checkedAt < REVALIDATE_AFTER_MS) {
    return Promise.resolve(null);
  }

  const promise = Promise.resolve()
    .then(() => {
      if (!isAuthSessionCurrent(generation)) return null;
      return getMemberInfoAPI();
    })
    .then((member) => {
      synchronizeAuthSessionToken();
      if (!member || !completeAuthSessionCheck(generation, true) || !isAuthSessionCurrent(generation)) return null;
      pushLoginSuccessUserId(member.memberId);
      return member;
    })
    .catch((error: unknown) => {
      synchronizeAuthSessionToken();
      if (!completeAuthSessionCheck(generation, false) && !hasAuthSessionExpired(generation)) return null;
      throw error;
    })
    .finally(() => {
      if (inFlight?.promise === promise) inFlight = null;
    });

  inFlight = { generation, promise };
  return promise;
};

const checkInBackground = () => {
  void checkAuthSession().catch(() => {
    // 실패 상태와 확인 시각은 checkAuthSession에서 공유 상태에 반영한다.
  });
};

const onVisible = () => {
  if (document.visibilityState === 'visible') checkInBackground();
};

const onStorage = (event: StorageEvent) => {
  if (event.storageArea !== localStorage || (event.key !== 'accessToken' && event.key !== null)) return;
  if (!synchronizeAuthSessionToken()) return;
  if (localStorage.getItem('accessToken') !== null) checkInBackground();
};

export const subscribeAuthSession = (listener: () => void): (() => void) => {
  const unsubscribe = subscribeAuthSessionState(() => {
    listener();
    if (getAuthSessionSnapshot() === null) checkInBackground();
  });
  subscriberCount += 1;
  if (subscriberCount === 1) {
    window.addEventListener('focus', onVisible);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('storage', onStorage);
  }

  synchronizeAuthSessionToken();
  if (getAuthSessionCheckedAt() === null) checkInBackground();

  return () => {
    unsubscribe();
    subscriberCount -= 1;
    if (subscriberCount === 0) {
      window.removeEventListener('focus', onVisible);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('storage', onStorage);
    }
  };
};

export const clearAuthSession = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userCode');
  invalidateAuthSession();
};
