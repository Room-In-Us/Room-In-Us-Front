import { atom } from "recoil";

// 모달 상태
export const reviewModalState = atom({
  key: 'reviewModalState',
  default: false,
});

// 후기 작성 섹션 상태
export const reviewSectionState = atom({
  key: 'reviewSectionState',
  default: 'first',
});

// 후기 작성 데이터 상태
export const reviewState = atom({
  key: "reviewState",
  default: {

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
  },
});