import styled from "styled-components";
import Plus from "../../../shared/assets/icons/reviewWrite/plus.svg";
import Minus from "../../../shared/assets/icons/reviewWrite/minus.svg";
import DisabledPlus from "../../../shared/assets/icons/reviewWrite/disabledplus.svg";
import DisabledMinus from "../../../shared/assets/icons/reviewWrite/disabledminus.svg";

export default function HintCounter({disabled, value = 0, onChange}) {

  // 증감 핸들러
  const increase = () => {
    if (!disabled) onChange(value + 1);
  }
  const decrease = () => {
    if (!disabled) onChange(Math.max(0, value - 1));
  }

  return (
    <HintNumWrapper $disabled={disabled}>
      <PlusMinusIcon src={disabled ? (DisabledMinus) : (Minus)} alt="minus" onClick={decrease} $disabled={disabled} />
      <HintNumBox $disabled={disabled}>
        <NumText $disabled={disabled}>{value}</NumText>
      </HintNumBox>
      <PlusMinusIcon src={disabled ? (DisabledPlus) : (Plus)} alt="plus" onClick={increase} $disabled={disabled} />
    </HintNumWrapper>
  );
}

const HintNumWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
`;

const HintNumBox = styled.div`
  display: flex;
  width: 5em;
  padding: 0.625em 0.875em;
  justify-content: center;
  align-items: center;

  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 3.75em;
    height: 1.875em;
  }
`;

const PlusMinusIcon = styled.img`
  display: flex;
  width: 1.875em;
  height: 1.875em;
  justify-content: center;
  align-items: center;
  cursor: ${({ $disabled }) => $disabled ? 'not-allowed' : 'pointer'};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 1.5625em;
    height: 1.5625em;
  }
`;

const NumText = styled.div`
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