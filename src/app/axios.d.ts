import 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    __skipAuth?: boolean;
    __skipRefresh?: boolean;
    _retry?: boolean;
  }
}

export {};
