import Old from "../../../shared/assets/icons/reviewWrite/old.svg";
import Malfunction from "../../../shared/assets/icons/reviewWrite/malfunction.svg";
import Delay from "../../../shared/assets/icons/reviewWrite/delay.svg";
import NowDay from "../../../shared/assets/icons/reviewWrite/nowday.svg";
import GiveUp from "../../../shared/assets/icons/reviewWrite/giveup.svg";

export const clothOptions = [
    { value: 'PANTS', label: "바지 추천" },
    { value: 'LONG_SKIRT', label: "긴 치마 가능" },
    { value: 'SHORT_SKIRT', label: "짧은 치마 가능" },
    { value: null, label: "입력 안 함" },
  ];

export const finishOption = [
    { value: true, label: "성공" },
    { value: false, label: "실패" },
    { value: null, label: "기재 안 함" },
  ];

export const specialIssues = [
  { icon: Old, value: 'AGING', label: "노후화" },
  { icon: Malfunction, value: 'DEVICE_ERROR', label: "장치 오류" },
  { icon: Delay, value: 'ENTRY_DELAY', label: "입장 지연" },
  { icon: NowDay, value: 'SAME_DAY_BOOKING', label: "당일 예약" },
  { icon: GiveUp, value: 'EARLY_EXIT', label: "중도 포기" },
];

export const skillOptions = [
  { value: null, label: "미선택" },
  { value: 'BEGINNER', label: "방세포" },
  { value: 'JUNIOR', label: "방초보" },
  { value: 'SENIOR', label: "방중수" },
  { value: 'MASTER', label: "방고수" },
];

export const failOptions = [
  { value: null, label: "미선택" },
  { value: 'HINT', label: "힌트 개수 초과" },
  { value: 'TIME', label: "시간 부족" },
  { value: 'ETC', label: "기타" },
];

export const overallOptions = [
  {value: 'FAVORITE', label: '인생테마'},
  {value: 'FLOWER_GARDEN', label: '꽃밭길'},
  {value: 'FLOWER', label: '꽃길'},
  {value: 'GRASS_FLOWER', label: '풀꽃길'},
  {value: 'GRASS', label: '풀길'},
  {value: 'SOIL_GRASS', label: '흙풀길'},
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

export const FEEDBACK_TEXT_MAP = {
  난이도: [
    "너무 허무했어요","너무 쉬웠어요","손쉬운 편이에요", "쉬운 편이에요", "적당히 쉬웠어요","적당했어요",
    "약간 어려웠어요","어려운 편이에요","꽤 어려웠어요","극악 난이도예요!"
  ],
  공포도: [
    "전혀 안 무서웠어요","무섭진 않았어요","약간 놀랐어요","조금 무서웠어요","가볍게 긴장돼요",
    "적당히 무서웠어요","심장이 살짝 쿵쿵!","꽤 무서웠어요","무서운데 재밌어요","너무 무서워서 도망칠 뻔!"
  ],
  활동성: [
    "거의 안 움직였어요","움직임이 적었어요","가볍게 걸었어요","조금 움직였어요","무난한 활동이에요",
    "적당히 움직여요","꽤 활동적이에요","계속 움직였어요","체력 좀 필요해요","운동하러 온 줄 알았어요!"
  ],
  스토리: [
    "내용이 거의 없어요","스토리 이해가 힘들었어요","설정만 있었어요","흐름이 아쉬웠어요","약간 연결이 부족해요",
    "무난한 스토리예요","스토리가 꽤 괜찮아요","몰입 잘 됐어요","이야기에 빠졌어요","영화처럼 완벽했어요!"
  ],
  인테리어: [
    "너무 허전했어요","꾸밈이 부족했어요","공간이 단순했어요","무난한 구성이에요","디테일이 약했어요",
    "적당해요","제법 잘 꾸몄어요","분위기 좋았어요","디테일에 감탄했어요","현실보다 더 몰입돼요!"
  ],
};
