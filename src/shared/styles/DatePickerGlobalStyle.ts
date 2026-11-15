import { createGlobalStyle } from 'styled-components';

const DatePickerGlobalStyle = createGlobalStyle`
  /* 전체 박스 */
  .react-datepicker {
    z-index: 9999;
    display: flex;
    width: 24.125em;
    padding: 0.875em;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border-radius: 0.3125em;
    border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
    background: var(--RIU_Monochrome-10, #F9F9FB);
  }

  .react-datepicker__triangle {
    display: none !important;
  }

  /* 헤더 */
  .react-datepicker__header {
    background-color: #f9f9fb;
    border-bottom: none;
    padding: 0em;
  }

  /* 달력 전체 레이아웃 */
  .react-datepicker__month {
    display: flex !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    margin: 0;
    gap: 0.625em;
  }

  .react-datepicker__week {
    display: flex !important;
    width: 100% !important;
    justify-content: space-between;
    align-items: center;
    gap: 0.625em;
  }
    
  .react-datepicker__day-names {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-between !important;
    align-items: center;
    width: 100% !important;
    box-sizing: border-box;
    height: 1.625em;
    margin: 0.625em 0em;
  }

  /* 요일 스타일 */
  .react-datepicker__day-name {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.875em !important;
    font-family: Pretendard-Bold !important;
    color: var(--RIU_Primary-100, #718FF2);
    height: 1.125em;
  }

  /* 날짜 스타일 */
  .react-datepicker__day {
    font-family: Pretendard-Medium;
    font-size: 0.875em;
    color: var(--RIU_Monochrome-100, #515467);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    gap: 0.625em;
  }

  /* 선택된 날짜 */
  .react-datepicker__day--selected {
    background-color: #718FF2 !important;
    color: white !important;
    border-radius: 50% !important;
  }

  /* 키보드 포커스 날짜 */
  .react-datepicker__day--keyboard-selected {
    background-color: transparent !important;
    color: #718FF2 !important;
  }

  /* 외부 날짜 (다른 달) */
  .react-datepicker__day--outside-month {
    color: #c4c6d1 !important;
  }

  /* hover 스타일 */
  .react-datepicker__day:hover {
    background-color: #e0e6ff !important;
    border-radius: 50% !important;
  }
`;

export default DatePickerGlobalStyle;