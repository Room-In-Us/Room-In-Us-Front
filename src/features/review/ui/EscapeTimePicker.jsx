import styled from "styled-components";
import DropDown from "../../../shared/assets/icons/common/dropdown.svg?react";
import Clock from "../../../shared/assets/icons/reviewWrite/clock.svg";

export default function EscapeTimePicker({ disabled, value = { min: 0, sec: 0 }, onChange }) {
  const handleMinuteChange = (e) => {
    onChange({ ...value, min: parseInt(e.target.value, 10) });
  };

  const handleSecondChange = (e) => {
    onChange({ ...value, sec: parseInt(e.target.value, 10) });
  };

  return (
    <Box1>  
      <Containor>
        <ClockIcon src={Clock} />
        <Select $disabled={disabled} value={value.min} onChange={handleMinuteChange}>
          {Array.from({ length: 60 }, (_, i) => (
            <option key={`m-${i}`} value={i}>{i}&apos;</option>
          ))}
        </Select>
        <Select $disabled={disabled} value={value.sec} onChange={handleSecondChange}>
          {Array.from({ length: 60 }, (_, i) => (
            <option key={`s-${i}`} value={i}>{i}&quot;</option>
          ))}
        </Select>
      </Containor>
      <DropDownIcon />
    </Box1>
  );
}

const Box1 = styled.div`
  display: flex;
  align-items: center;
  padding: 0.625em 0.875em;
  gap: 0.625em;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: 1.875em;
  }
`;

const Containor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 0.3125em;
  }
`;

const ClockIcon = styled.img`
  width: 0.9375em;
  height: 0.9375em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

const Select = styled.select`
  font-size: 0.75em;
  font-family: Pretendard-Medium;
  color: ${({ $disabled }) => 
    $disabled ? 'var(--RIU_Monochrome-50, #D6D6DF)' : 
    'var(--RIU_Monochrome-100, #818496)'};
  border: none;
  background: none;
  outline: none;
  appearance: none;
  padding: 0;
  cursor: pointer;

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

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
  width: 0.625em;
  height: 0.625em;
  }
`;