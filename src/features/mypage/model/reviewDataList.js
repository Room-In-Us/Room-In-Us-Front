import EvalutionIcon from "../../../shared/assets/icons/themeDetail/reviewEvalutionIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/reviewMemberIcon.svg?react";
import EscapeIcon from "../../../shared/assets/icons/themeDetail/reviewEscapeIcon.svg?react";
import HintIcon from "../../../shared/assets/icons/themeDetail/reviewHintIcon.svg?react";
import TimeIcon from "../../../shared/assets/icons/themeDetail/reviewTimeIcon.svg?react";
import { convertTimeToMinutes, reviewEnumConversion } from "../../../shared/utils/dataUtils";

export const reviewSortOption = [
  { label: '최근 방문 순', value: 'PLAYED_AT_DESC' },
  { label: '최신 작성 순', value: 'CREATED_AT_DESC' },
];

export const createReviewInfoItems = ({ review, participantCnt, usedHint, remainingTime, isEscaped }) => [
  { label: '총평', value: reviewEnumConversion(review) || review, icon:EvalutionIcon },
  { label: '플레이 인원', value: participantCnt != null ? `${participantCnt}인` : '-', icon:MemberIcon },
  { label: '탈출 여부', value: isEscaped ? '탈출 성공' : '탈출 실패', icon: EscapeIcon },
  { label: '힌트 사용', value: usedHint != null ? `${usedHint}개 사용` : '-', icon: HintIcon },
  { label: '남긴 시간', value: isEscaped != false ? convertTimeToMinutes(remainingTime) : '-', icon: TimeIcon },
];