// 네트워크 모듈과 분리해 Axios와 React가 같은 인증 상태를 참조한다.
type AuthSessionStatus = boolean | null;

let status: AuthSessionStatus = null;
let generation = 0;
let checkedAt: number | null = null;
let knownAccessToken = localStorage.getItem('accessToken');
let expiredGeneration: number | null = null;
const listeners = new Set<() => void>();

export const getAuthSessionSnapshot = (): AuthSessionStatus => status;
export const getAuthSessionGeneration = (): number => generation;
export const getAuthSessionCheckedAt = (): number | null => checkedAt;
export const isAuthSessionCurrent = (expected: number): boolean => generation === expected;
export const hasAuthSessionExpired = (expected: number): boolean => expiredGeneration === expected;

export const subscribeAuthSessionState = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notify = () => listeners.forEach((listener) => listener());

export const beginAuthSession = (): number => {
  generation += 1;
  status = null;
  checkedAt = null;
  knownAccessToken = localStorage.getItem('accessToken');
  expiredGeneration = null;
  notify();
  return generation;
};

export const invalidateAuthSession = (reason: 'changed' | 'expired' = 'changed'): void => {
  expiredGeneration = reason === 'expired' ? generation : null;
  generation += 1;
  status = false;
  checkedAt = Date.now();
  knownAccessToken = localStorage.getItem('accessToken');
  notify();
};

// storage 이벤트보다 응답이 먼저 도착해도 이전 계정의 결과를 적용하지 않는다.
export const synchronizeAuthSessionToken = (): boolean => {
  const token = localStorage.getItem('accessToken');
  if (token === knownAccessToken) return false;
  if (token === null) invalidateAuthSession();
  else beginAuthSession();
  return true;
};

export const recordRefreshedAuthSessionToken = (expected: number, token: string): boolean => {
  if (!isAuthSessionCurrent(expected)) return false;
  knownAccessToken = token;
  return true;
};

export const completeAuthSessionCheck = (
  expected: number,
  authenticated: boolean,
  completedAt: number | null = Date.now(),
): boolean => {
  if (!isAuthSessionCurrent(expected)) return false;
  status = authenticated;
  checkedAt = completedAt;
  notify();
  return true;
};
