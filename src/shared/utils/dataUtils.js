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

// 위치 태그 변환 함수 (문자열에서 "(" 이전까지만 반환)
export const locationTagConversion = (location) => {
  if (!location || typeof location !== "string") return "알 수 없음";
  return location.split("(")[0].trim();
};