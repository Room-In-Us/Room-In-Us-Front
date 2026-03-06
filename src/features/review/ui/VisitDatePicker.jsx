import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "../../../shared/assets/icons/reviewWrite/date.svg";
import DropDown from "../../../shared/assets/icons/common/arrow/downArrow.svg?react";
import { useRecoilState } from "recoil";
import { reviewStateFamily } from "../../themeDetail/model/reviewAtom";
import { ko } from 'date-fns/locale';
import LeftArrow from '../../../shared/assets/icons/common/arrow/leftArrow.svg?react';
import RightArrow from '../../../shared/assets/icons/common/arrow/rightArrow.svg?react';
import { format, isValid, parse } from "date-fns";

const toSafeDate = (input) => {
  if (!input) return null;

  if (input instanceof Date) {
    return isValid(input) ? input : null;
  }

  // dayjs 객체 대응
  if (typeof input === "object" && typeof input.toDate === "function") {
    const converted = input.toDate();
    return converted instanceof Date && isValid(converted) ? converted : null;
  }

  if (typeof input === "string") {
    const dashed = parse(input, "yyyy-MM-dd", new Date());
    if (isValid(dashed)) return dashed;

    const dotted = parse(input, "yyyy.MM.dd", new Date());
    if (isValid(dotted)) return dotted;

    const native = new Date(input);
    return isValid(native) ? native : null;
  }

  return null;
};

const CustomDateInput = React.forwardRef(({ disabled, value, onToggle }, ref) => {
  const lastToggleAtRef = React.useRef(0);

  const formatDate = (rawValue) => {
    const date = toSafeDate(rawValue);
    if (!date) return "날짜 선택";
    return format(date, "yyyy.MM.dd");
  };

  const handlePointerDown = (e) => {
    e.preventDefault();
    if (disabled) return;

    const now = Date.now();
    if (now - lastToggleAtRef.current < 250) return;
    lastToggleAtRef.current = now;
    onToggle?.();
  };

  return(
  <DateBox
    type="button"
    $disabled={disabled}
    onPointerDown={handlePointerDown}
    onMouseDown={handlePointerDown}
    onTouchStart={handlePointerDown}
    ref={ref}
  >
    <Wrap>
      <DateIcon src={Calendar} />
      <DateBoxText $disabled={disabled}>{formatDate(value)}</DateBoxText>
    </Wrap>
    <DropDownIcon />
  </DateBox>
  );
});

// eslint 에러 방지
CustomDateInput.displayName = "CustomDateInput";

export default function VisitDatePicker({ disabled, themeId, onChange, value }) {

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [review, setReview] = useRecoilState(reviewStateFamily(themeId));

  const handleChange = (date) => {
    if (!date) return;
    const formatted = format(date, 'yyyy-MM-dd'); 
    if (themeId != null) {
      setReview((prev) => ({
        ...prev,
        playedAt: formatted,
      }));
    }

    if (onChange) {
      onChange(date);
    }

    handleClose();
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleToggle = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200); 
    } else {
      setIsOpen(true); 
    }
  };

  const selectedDate = value
    ? toSafeDate(value)   // 일정관리에서 넘겨준 날짜(dayjs/Date/string 대응)
    : review.playedAt
      ? toSafeDate(review.playedAt)   // 후기용
      : null;

  return (
    <StyledDatePickerWrapper>
      <StyledDatePicker
        open={isOpen}
        shouldCloseOnSelect
        onClickOutside={handleClose}
        disabled={disabled}
        calendarClassName={isClosing ? "fade-out" : "fade-in"}
        selected={selectedDate}
        onChange={handleChange}
        locale={ko}
        dateFormat="yyyy.MM.dd"
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <CalendarHeader>
            <LeftArrowBtn onClick={decreaseMonth}>◀</LeftArrowBtn>
            <MonthText>
              {date.getFullYear()}년 {date.getMonth() + 1}월
            </MonthText>
            <RightArrowBtn onClick={increaseMonth}>▶</RightArrowBtn>
          </CalendarHeader>
        )}
        customInput={<CustomDateInput onToggle={handleToggle} />}
        wrapperClassName="date-picker-wrapper"
      />
    </StyledDatePickerWrapper>
  );
}

const StyledDatePickerWrapper = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    width: 100%;
  }

  .fade-in {
    animation: fadeIn 0.2s ease-in-out forwards;
  }

  .fade-out {
    animation: fadeOut 0.2s ease-in-out forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
`;

const StyledDatePicker = styled(DatePicker)``;

const DateBox = styled.button`
  width: 100%;
  height: 2.5em;
  display: flex;
  padding: 0.625em 0.875em;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  background: var(--RIU_Monochrome-10, #F9F9FB);
  box-sizing: border-box;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
  appearance: none;
  -webkit-appearance: none;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 1.875em;
  }
`;

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3125em;
`;

const DateIcon = styled.img`
  width: 0.9375em;
  height: 0.9375em;
`;

const DateBoxText = styled.div`
  color: ${({ $disabled }) => 
    $disabled ? 'var(--RIU_Monochrome-50, #D6D6DF)' : 
  'var(--RIU_Monochrome-100, #818496)'};
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const DropDownIcon = styled(DropDown)`
  width: 0.9375em;
  height: 0.9375em;
  
  path {
    fill: var(--RIU_Monochrome-60, #C4C6D1);
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625em;
  background: #d0d8ff;
`;

const LeftArrowBtn = styled(LeftArrow)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RightArrowBtn = styled(RightArrow)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const MonthText = styled.span`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Bold;
  font-size: 0.875em;
`;
