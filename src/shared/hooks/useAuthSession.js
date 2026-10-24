import { useSyncExternalStore } from 'react';
import { subscribeAuthSession } from '../auth/authSession';
import { getAuthSessionSnapshot } from '../auth/sessionState';

// 로그인 상태 관리 훅
export default function useAuthSession() {
  return useSyncExternalStore(subscribeAuthSession, getAuthSessionSnapshot, getAuthSessionSnapshot);
}
