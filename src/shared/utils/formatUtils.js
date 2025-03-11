// 숫자 세자리마다 콤마 기능
export const formatNumberWithCommas = (value) => {
  if (typeof value !== 'number' || isNaN(value)) {
    console.warn("formatNumberWithCommas: 잘못된 값이 전달됨", value);
    return 0; // 기본값 0
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
