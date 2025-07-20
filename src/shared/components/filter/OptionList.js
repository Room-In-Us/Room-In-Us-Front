import FilterIcon1 from '../../assets/icons/common/filterIcon/satisfactionstar.svg?react';
import FilterIcon2 from '../../assets/icons/common/filterIcon/review.svg?react';
import FilterIcon3 from '../../assets/icons/common/filterIcon/price.svg?react';
import FilterIcon4 from '../../assets/icons/common/filterIcon/level.svg?react';
import FilterIcon5 from '../../assets/icons/common/filterIcon/fearlevel.svg?react';
import FilterIcon6 from '../../assets/icons/common/filterIcon/activelevel.svg?react';

export const peopleOptions = [
  { value: 1, label: "1인" },
  { value: 2, label: "2인" },
  { value: 3, label: "3인" },
  { value: 4, label: "4인" },
  { value: 5, label: "5인" },
  { value: 6, label: "6인" }
];

export const sortOptions = [
  {value: "HIGH_SATISFACTION_LEVEL", label: "만족도 높은 순", icon: FilterIcon1 },
  {value: "MANY_REVIEW", label: "후기 많은 순", icon: FilterIcon2 },
  {value: "LOW_PRICE", label: "가격 낮은 순", icon: FilterIcon3 },
  {value: "HIGH_LEVEL", label: "난이도 높은 순", icon: FilterIcon4 },
  {value: "HIGH_HORROR_LEVEL", label: "공포도 높은 순", icon: FilterIcon5 },
  {value: "HIGH_ACTIVITY_LEVEL", label: "활동성 높은 순", icon: FilterIcon6 },
];