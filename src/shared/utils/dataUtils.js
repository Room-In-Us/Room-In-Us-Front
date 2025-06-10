// 난이도 변환 함수 (double => String)
export const levelTextConversion = (level) => {
  if (level >= 0 && level <= 1) return "매우 쉬움";
  if (level > 1 && level <= 2) return "쉬움";
  if (level > 2 && level <= 3) return "보통";
  if (level > 3 && level <= 4) return "어려움";
  if (level > 4 && level <= 5) return "매우 어려움";
  return "알 수 없음";
};

// 장르 리스트 변환 함수 (영어 => 한글)
export const genreListConversion = (genreList) => {
  const genreMap = {
    SENTIMENTAL: "감성",
    HORROR: "공포",
    THRILLER: "스릴러",
    DETECTIVE: "추리",
    COMIC: "코믹",
    MYSTERY: "미스터리",
    FANTASY: "판타지",
    ADVENTURE: "탐험/모험",
    ESCAPE: "탈출/잠입",
    DRAMA: "드라마",
    ROMANCE: "로맨스",
    SF: "SF",
    HISTORY: "역사",
    FAIRY_TALE: "동화",
    ARCADE: "아케이드",
    SURVIVAL: "생존",
    PROBLEM: "문제방",
    ACTION: "액션",
    ADULT: "19금",
    OUTDOOR: "야외",
    ETC: "기타",
  };
  return genreList.map((genre) => genreMap[genre] || "알 수 없음");
};

// 별점 변환 함수 (null일 때 -)
export const satisfactionConversion = (satisfaction) => {
  if (satisfaction) {
    return satisfaction;
  } else {
    return "-";
  }
};

// 추천 인원 수 변환 함수
export const mapRecommendedHeadcount = (min, max) => {
  // 둘 다 null이면
  if (min == null && max == null) return "-";
  // min만 있고 max는 null이면
  if (min != null && max == null) return `${min}명 이상`;
  // max만 있고 min은 null이면
  if (min == null && max != null) return `${max}명 이하`;
  // min과 max가 같으면
  if (min === max) return `${min}명`;
  // min과 max가 다르면
  return `${min}~${max}명`;
};

// 총평 변환 함수 (영어 => 한글)
export const reviewEnumConversion = (reviewEnum) => {
  const enumMap = {
    SOIL: "흙길",
    SOIL_GRASS: "흙풀길",
    GRASS: "풀길",
    GRASS_FLOWER: "풀꽃길",
    FLOWER: "꽃길",
    FLOWER_GARDEN: "꽃밭길",
    FAVORITE: "인생테마",
  };
  return enumMap[reviewEnum] || "알 수 없음";
};

// 숙련도 변환 함수 (영어 => 한글)
export const proficiencyConversion = (proficiency) => {
  const proficiencyMap = {
    BEGINNER: "방세포",
    JUNIOR: "방초보",
    SENIOR: "방중수",
    MASTER: "방고수",
  };
  return proficiencyMap[proficiency] || "알 수 없음";
};

// 공포 포지션 변환 함수 (영어 => 한글)
export const horrorPositionConversion = (position) => {
  const positionMap = {
    FEARLESS: "탱",
    FEARFUL_TANK: "쫄탱",
    RELUCTANT_TANK: "마지모탱",
    NERVOUS: "변쫄",
    SCARED: "쫄",
    EXTREME_SCARED: "극쫄",
  };
  return positionMap[position] || "알 수 없음";
};

// 날짜 변환 함수 (yyyy.MM.dd)
export const formatDateToDot = (dateString) => {
  if (!dateString) return "날짜 없음";

  const [datePart] = dateString.split(" "); // "yyyy-MM-dd"
  const [year, month, day] = datePart.split("-");

  return `${year}.${month}.${day}`;
};

// 시간 변환 함수 (n분 남김)
export const convertTimeToMinutes = (timeString) => {
  if (!timeString) return '탈출 실패';

  const [hours, minutes] = timeString.split(":").map(Number);

  return `${hours * 60 + minutes}분 남김`;
};
