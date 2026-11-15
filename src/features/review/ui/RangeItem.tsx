import { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Thumb from '../../../shared/assets/icons/reviewWrite/thumb.svg?react';
import Line from '../../../shared/assets/icons/reviewWrite/line.svg';
import BoldLine from '../../../shared/assets/icons/reviewWrite/boldline.svg';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

type RangeItemProps = { disabled?: boolean; onChange?: (value: number) => void; value: number };
type DisabledProps = { $disabled?: boolean };

export default function RangeItem({ disabled, onChange, value }: RangeItemProps) {

  // 상태 관리
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // 마우스 이벤트
  const handleMove = useCallback((clientX: number) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const margin = 0.75 * 16;
    let relativeX = clientX - rect.left;

    relativeX = Math.max(margin, Math.min(rect.width - margin, relativeX));
    let percent = (relativeX / rect.width) * 100;
    const stepped = Math.round(percent / 10) * 10;

    onChange?.(stepped);
  }, [onChange]);

  const handleMouseDown = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    isDragging.current = true;
    handleMove(e.clientX);
  }, [disabled, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  }, [handleMove]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    const touch = e.touches[0];
    if (!touch) return;
    isDragging.current = true;
    handleMove(touch.clientX);
  }, [disabled, handleMove]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    if (touch) handleMove(touch.clientX);
  }, [handleMove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.changedTouches[0];
    if (touch) handleMove(touch.clientX);
    isDragging.current = false;
  }, [handleMove]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <SliderContainer>

      <Wrap>
        <ItemText2 $disabled={disabled}>자물쇠</ItemText2>
        <ItemText2 $disabled={disabled}>장치</ItemText2>
      </Wrap>

      <TrackWrapper>
      
        <LineWrapper>
          {Array.from({ length: 11 }).map((_, i) => (
            <LineDiv key={i} src={i % 5 === 0 ? BoldLine : Line} $bold={i % 5 === 0} />
          ))}
        </LineWrapper>

        <Track ref={sliderRef} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} $disabled={disabled}>

          <ThumbIcon
            style={{
              left: `calc(${value}% - ${value * 0.0125}em)`, 
              transform: 'translateY(-50%)' 
            }}
            // src={Thumb}
          />
          
        </Track>

      </TrackWrapper>

    </SliderContainer>
  );
}


const SliderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 0.625em;
`;

const Wrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemText2 = styled.div<DisabledProps>`
  color: ${({ $disabled }) => ($disabled ? '#E0E0E0' : 'var(--RIU_Primary-100, #718FF2)')};
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const TrackWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75em;
`;

const Track = styled.div<DisabledProps>`
  width: 100%;
  height: 0.9375em;
  position: relative;
  background: ${({ $disabled }) =>
    $disabled ? '#E0E0E0' : 'linear-gradient(90deg, #D0D8FF 0%, #8DA3FF 8.18%, #718FF2 30.77%, #4648A7 76.93%)'};
  border-radius: 2em;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  box-sizing: border-box;
`;

const LineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75em;
  box-sizing: border-box;
`;

const LineDiv = styled.img<{ $bold: boolean }>`
  height: ${({ $bold }) => ($bold ? '0.875em' : '0.625em')};
`;

const ThumbIcon = styled(Thumb)`
  position: absolute;
  appearance: none;
  top: 50%;
  width: 1.25em;
  height: 1.25em;
  border-radius: 100em;
  pointer-events: none;
  transition: left 0.2s ease;
  box-shadow: 0 0 4px rgba(0,0,0,0.25);
`;
