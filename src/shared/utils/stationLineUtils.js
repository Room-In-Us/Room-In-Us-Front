import Line1 from "../assets/icons/location/stationLine/line1.svg?react";
import Line2 from "../assets/icons/location/stationLine/line2.svg?react";
import Line3 from "../assets/icons/location/stationLine/line3.svg?react";
import Line4 from "../assets/icons/location/stationLine/line4.svg?react";
import Line5 from "../assets/icons/location/stationLine/line5.svg?react";
import Line6 from "../assets/icons/location/stationLine/line6.svg?react";
import Line7 from "../assets/icons/location/stationLine/line7.svg?react";
import Line8 from "../assets/icons/location/stationLine/line8.svg?react";
import Line9 from "../assets/icons/location/stationLine/line9.svg?react";
import Line10 from "../assets/icons/location/stationLine/line10.svg?react";
import Line11 from "../assets/icons/location/stationLine/line11.svg?react";
import Line12 from "../assets/icons/location/stationLine/line12.svg?react";
import Line13 from "../assets/icons/location/stationLine/line13.svg?react";
import Line14 from "../assets/icons/location/stationLine/line14.svg?react";
import Line15 from "../assets/icons/location/stationLine/line15.svg?react";
import Line16 from "../assets/icons/location/stationLine/line16.svg?react";
import Line17 from "../assets/icons/location/stationLine/line17.svg?react";
import Line18 from "../assets/icons/location/stationLine/line18.svg?react";
import Line19 from "../assets/icons/location/stationLine/line19.svg?react";
import Line20 from "../assets/icons/location/stationLine/line20.svg?react";
import Line21 from "../assets/icons/location/stationLine/line21.svg?react";
import Line22 from "../assets/icons/location/stationLine/line22.svg?react";
import Line23 from "../assets/icons/location/stationLine/line23.svg?react";
import Line24 from "../assets/icons/location/stationLine/line24.svg?react";

// 매핑
const lineIconMap = {
  1: Line1,
  2: Line2,
  3: Line3,
  4: Line4,
  5: Line5,
  6: Line6,
  7: Line7,
  8: Line8,
  9: Line9,
  10: Line10,
  11: Line11,
  12: Line12,
  13: Line13,
  14: Line14,
  15: Line15,
  16: Line16,
  17: Line17,
  18: Line18,
  19: Line19,
  20: Line20,
  21: Line21,
  22: Line22,
  23: Line23,
  24: Line24,
};

// 호선 변환 함수
export const stationLineConversion = (line) => {
  return lineIconMap[line] || null;
};