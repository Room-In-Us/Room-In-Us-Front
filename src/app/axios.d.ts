import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    __skipAuth?: boolean;
    __skipRefresh?: boolean;
    __authSessionGeneration?: number;
    _retry?: boolean;
  }
}

export {};
