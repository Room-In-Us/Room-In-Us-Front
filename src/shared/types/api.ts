export interface ApiErrorResponse {
  code?: number;
  message?: string;
}

export interface PageResponse<T> {
  contents: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNextPage: boolean;
}
