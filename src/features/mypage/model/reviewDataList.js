import EvalutionIcon from "../../../shared/assets/icons/themeDetail/reviewEvalutionIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/reviewMemberIcon.svg?react";
import EscapeIcon from "../../../shared/assets/icons/themeDetail/reviewEscapeIcon.svg?react";
import HintIcon from "../../../shared/assets/icons/themeDetail/reviewHintIcon.svg?react";
import TimeIcon from "../../../shared/assets/icons/themeDetail/reviewTimeIcon.svg?react";

export const reviewSortOption = [
  { label: '최근 방문 순', value: 'themeReview.playedAt,desc' },
  { label: '최신 작성 순', value: 'themeReview.createdAt,desc' },
];

export const createReviewInfoItems = ({ review, participantCnt, usedHint, remainingTime, isEscaped }) => [
  { label: '총평', value: review, icon:EvalutionIcon },
  { label: '인원', value: `${participantCnt}명`, icon:MemberIcon },
  { label: '힌트', value: `${usedHint}개`, icon: HintIcon },
  { label: '남은시간', value: remainingTime, icon: TimeIcon },
  { label: '성공여부', value: isEscaped ? '성공' : '실패', icon: EscapeIcon },
];