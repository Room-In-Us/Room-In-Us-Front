import React, { useState } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "../../../shared/assets/icons/reviewWrite/date.svg";
import DropDown from "../../../shared/assets/icons/common/dropdown.svg?react";

export default function VisitDatePicker({ disabled, selectedDate, onChange }) {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <DatePicker
      open={isOpen}
      onClickOutside={() => setIsOpen(false)}
      disabled={disabled}
      selected={selectedDate}
      onChange={(date) => {
          if (date instanceof Date && !isNaN(date.getTime())) {
            onChange(date);
            setIsOpen(false);
          }
        }}
      dateFormat="yyyy.MM.dd"
      customInput={<CustomDateInput onToggle={() => setIsOpen(prev => !prev)} style={{width: '100%'}} />}
      wrapperClassName="date-picker-wrapper"
    />
  );
}
const CustomDateInput = React.forwardRef(({ disabled, value, onToggle }, ref) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (!(date instanceof Date) || isNaN(date.getTime())) return "날짜 선택";
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  return(
  <DateBox $disabled={disabled} onClick={onToggle} ref={ref}>
    <Wrap>
      <DateIcon src={Calendar} />
      <DateBoxText $disabled={disabled}>{formatDate(value)}</DateBoxText>
    </Wrap>
    <DropDownIcon />
  </DateBox>
  );
});

const DateBox = styled.div`
  width: 24.125em;
  height: 2.5em;
  display: flex;
  padding: 0.625em 0.875em;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;
  cursor: ${({ $disabled }) => $disabled ? 'default' : 'pointer'};
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 19.6875em;
    max-width: 100%;
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
