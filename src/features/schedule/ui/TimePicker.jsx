import styled from "styled-components";

export default function TimePicker({ onTimeChange }) {
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleHourChange = (e) => {
    const newHour = e.target.value;
    onTimeChange({ hour: newHour });
  };

  const handleMinuteChange = (e) => {
    const newMinute = e.target.value;
    onTimeChange({ minute: newMinute });
  };

  return (
    <Box1>
      <Select onChange={handleHourChange}>
        {hours.map(h => <option key={h} value={h}>{h}시</option>)}
      </Select>
      <Select onChange={handleMinuteChange}>
        {minutes.map(m => <option key={m} value={m}>{m}분</option>)}
      </Select>
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
  width: 17.1875em;
  height: 2.625em;
`;

const Select = styled.select`
  font-size: 0.75em;
  font-family: Pretendard-Medium;
  color: var(--RIU_Monochrome-100, #818496);
  border: none;
  background: none;
  outline: none;
  appearance: none; // 기본 드롭다운 화살표 제거
  padding: 0;
  cursor: pointer;
`;