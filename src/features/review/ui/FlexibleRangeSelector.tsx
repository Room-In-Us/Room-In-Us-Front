import styled from "styled-components";

type FlexibleRangeSelectorProps = { disabled?: boolean; value?: number[]; onChange?: (value: number[]) => void };
type RangeStyleProps = { $inRange: boolean; $isBoundary: boolean };

export default function FlexibleRangeSelector({disabled, value = [], onChange }: FlexibleRangeSelectorProps) {

  // 상태 관리
  const range = value;

  // 범위 선택 핸들러
  const handleClick = (num: number) => {
    let newRange: number[] = [];
    if (range.length === 0) {
      newRange = [num];
    } else if (range.length === 1) {
      if (range[0] === num) {
        newRange = [];
      } else {
        newRange = [Math.min(range[0], num), Math.max(range[0], num)];
      }
    } else {
      newRange = [num];
    }

    onChange?.(newRange);
  };

  // 범위 제한
  const isInRange = (num: number) => {
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

const Container = styled.div<{ $disabled?: boolean }>`
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

const NumberButton = styled.div<RangeStyleProps>`
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

const Num = styled.div<RangeStyleProps & { $disabled?: boolean }>`
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
