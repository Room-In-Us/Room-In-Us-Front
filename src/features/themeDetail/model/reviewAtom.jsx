import { atom, atomFamily } from "recoil";

// 모달 상태
export const reviewModalState = atom({
  key: 'reviewModalState',
  default: false,
});

// 선택된 테마 정보 상태
export const selectedThemeDataState = atom({
  key: 'selectedThemeDataState',
  default: null,
});

// 후기 작성 섹션 상태
export const reviewSectionState = atom({
  key: 'reviewSectionState',
  default: 'first',
});

// 초기 후기 작성 데이터
const defaultReviewValue = {

  satisfactionLevel: null,
  review: "",
  reviewComment: "",

  playedAt: null,
  participantList: [
    {
      proficiency: '',
      remark: '',
      isOwner: true,
    },
    {
      proficiency: '',
      remark: '',
      isOwner: false,
    },
  ],
  isEscaped: true,
  remainingTime: '00:00:00',
  failReason: null,
  hasViewedEnding: null,
  usedHint: null,
  minRecommendedHeadcount: null,
  maxRecommendedHeadcount: null,
  reviewTagList: [],

  lockRatio: null,
  level: null,
  levelComment: "",
  horrorLevel: null,
  horrorComment: "",
  activityLevel: null,
  activityComment: "",
  recommendedCloth: "",
  storyLevel: null,
  storyComment: "",
  interiorLevel: null,
  interiorComment: ""
};

// 후기 작성 데이터 상태
export const reviewStateFamily = atomFamily({
  key: 'reviewStateFamily',
  default: defaultReviewValue,
});