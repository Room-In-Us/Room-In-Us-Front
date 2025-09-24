import styled from "styled-components";

export default function EscapeTimePicker({ disabled, value = { min: 0, sec: 0 }, onChange }) {

  const handleMinuteChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    let min = parseInt(input, 10);
    if (isNaN(min)) min = 0;
    if (min > 59) min = 59; 
    onChange({ ...value, min });
  };

  const handleSecondChange = (e) => {
    let input = e.target.value.replace(/\D/g, "");
    let sec = parseInt(input, 10);
    if (isNaN(sec)) sec = 0;
    if (sec > 59) sec = 59;
    onChange({ ...value, sec });
  };

  return (
    <Box1>  
      <Containor>
        <TimeInput
          $disabled={disabled}
          type="text"
          disabled={disabled}
          value={value.min === null || value.min === undefined ? "" : value.min}
          onChange={handleMinuteChange}
        />
      </Containor>

      <BoxText $disabled={disabled}>분</BoxText>

      <Containor>
        <TimeInput
          $disabled={disabled}
          type="text"
          disabled={disabled}
          value={value.sec === null || value.sec === undefined ? "" : value.sec}
          onChange={handleSecondChange}
        />
      </Containor>

      <BoxText $disabled={disabled}>초</BoxText>
    </Box1>
  );
}

const Box1 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const Containor = styled.div`
  display: flex;
  width: 3.75em;
  height: 2.25em;
  padding: 0.625em 0.875em;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 2.5em;
    height: 1.875em;
    padding: 0.5em 0.75em;
  }
`;

const TimeInput = styled.input`
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
  width: 100%;
  height: 100%;
  text-align: center;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;
  
const BoxText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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