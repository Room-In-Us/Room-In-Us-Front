import { useEffect, useState } from "react";
import styled from "styled-components";

export default function FlexibleRangeSelector({disabled, onClearTrigger }) {
  const [range, setRange] = useState([]);

  useEffect(() => {
    setRange([]);
  }, [onClearTrigger]);

  const handleClick = (num) => {
    if (range.length === 0) {
      setRange([num]);
    } else if (range.length === 1) {
      if (range[0] === num) {
        setRange([]);
      } else {
        setRange([Math.min(range[0], num), Math.max(range[0], num)]);
      }
    } else {
      setRange([num]); 
    }
  };

  const isInRange = (num) => {
    if (range.length === 1) return num === range[0];
    if (range.length === 2) return num >= range[0] && num <= range[1];
    return false;
  };

  return (
    <Container $disabled={disabled}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <NumberButton
          key={num}
          $inRange={isInRange(num)}
          $isBoundary={
            (range.length === 1 && num === range[0]) ||
            (range.length === 2 && (num === range[0] || num === range[1]))
          }
          onClick={() => handleClick(num)}
        >
          <Num 
          $inRange={isInRange(num)}
          $isBoundary={
            (range.length === 1 && num === range[0]) ||
            (range.length === 2 && (num === range[0] || num === range[1]))
          }
          $disabled={disabled}
          >
            {num === 6 ? "6+" : num}
          </Num>
        </NumberButton>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  height: 2.25em;
  align-items: center;
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: 1.875em;
  }
`;

const NumberButton = styled.div`
  display: flex;
  width: 1.875em;
  height: 1.875em;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  cursor: pointer;
  background: ${({ $isBoundary, $inRange }) =>
    $isBoundary ? "#718FF2" : $inRange ? "#D0D8FF" : "transparent"};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 1.5625em;
    height: 1.5625em;
  }
`;

const Num = styled.div`
  font-family: Pretendard-Medium;
  font-size: 0.75em;
  color: ${({ $isBoundary, $inRange, $disabled }) =>
    $disabled ? 'var(--RIU_Monochrome-50, #D6D6DF)' :
    $isBoundary ? "#F9F9FB" : 
    $inRange ? "#718FF2" : "#717486"};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;