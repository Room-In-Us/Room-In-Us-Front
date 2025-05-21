import Old from "../../../shared/assets/icons/reviewWrite/old.svg";
import Malfunction from "../../../shared/assets/icons/reviewWrite/malfunction.svg";
import Delay from "../../../shared/assets/icons/reviewWrite/delay.svg";
import NowDay from "../../../shared/assets/icons/reviewWrite/nowday.svg";
import GiveUp from "../../../shared/assets/icons/reviewWrite/giveup.svg";

export const clothOptions = [
    { value: 'pants', label: "바지 추천" },
    { value: 'long', label: "긴 치마 가능" },
    { value: 'short', label: "짧은 치마 가능" },
    { value: 'none', label: "입력 안 함" },
  ];

export const finishOption = [
    { value: 'success', label: "성공" },
    { value: 'fail', label: "실패" },
    { value: 'none', label: "기재 안 함" },
  ];

export const specialIssues = [
  { icon: Old, label: "노후화" },
  { icon: Malfunction, label: "장치 오류" },
  { icon: Delay, label: "입장 지연" },
  { icon: NowDay, label: "당일 예약" },
  { icon: GiveUp, label: "중도 포기" },
];


export const skillOptions = [
  { value: 'NULL', label: "미선택" },
  { value: 'BEGINNER', label: "방세포" },
  { value: 'JUNIOR', label: "방초보" },
  { value: 'SENIOR', label: "방중수" },
  { value: 'MASTER', label: "방고수" },
];

export const failOptions = [
  { value: 'NULL', label: "미선택" },
  { value: 'HINTOVER', label: "힌트 개수 초과" },
  { value: 'TIMEATTACK', label: "시간 부족" },
  { value: 'OTHER', label: "기타" },
];

export const overallOptions = [
  {value: 'LIFE', label: '인생테마'},
  {value: 'FLOWERGROUND', label: '꽃밭길'},
  {value: 'FLOWER', label: '꽃길'},
  {value: 'GRASSFLOWER', label: '풀꽃길'},
  {value: 'GRASS', label: '풀길'},
  {value: 'SOILGRASS', label: '흙풀길'},
  {value: 'SOIL', label: '흙길'},
];

export const FEEDBACK_TEXT = [
  "최악이에요",
  "싫어요", 
  "재미없어요",
  "별로예요", 
  "아쉬워요",
  "보통이에요", 
  "해볼만해요",
  "재미있어요",
  "훌륭해요!", 
  "최고예요!"
];