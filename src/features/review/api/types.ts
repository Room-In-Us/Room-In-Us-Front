export type PostReviewThemeIdPathParam = number | string;

export interface PostThemeReviewResponse {
  reviewId?: number;
}

export interface PostReviewSuccess {
  success: true;
  data: PostThemeReviewResponse;
}

export interface PostReviewFailure {
  success: false;
  message: string;
}

export type PostReviewResult = PostReviewSuccess | PostReviewFailure;
