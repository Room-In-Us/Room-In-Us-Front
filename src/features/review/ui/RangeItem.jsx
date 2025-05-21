import { useState, useRef } from 'react';
import styled from "styled-components";
import Line from '../../../shared/assets/icons/reviewWrite/line.svg';
import BoldLine from '../../../shared/assets/icons/reviewWrite/boldline.svg';
import Thumb from '../../../shared/assets/icons/reviewWrite/thumb.svg';

export default function RangeItem() {

  const [value, setValue] = useState(0);
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const targetValue = useRef(value);

  // 마우스 이동 이벤트 핸들러
  const handleMouseMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;

    const { left, width } = sliderRef.current.getBoundingClientRect();
    let newValue = ((e.clientX - left) / width) * 100;

    // 클램핑하여 값이 0% ~ 100% 범위를 벗어나지 않게 설정
    newValue = Math.max(0, Math.min(newValue, 100)); 

    targetValue.current = newValue;

    setValue(newValue);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mouseleave", handleMouseUp);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <SliderContainer ref={sliderRef}>

      <LineWrapper>
        <LineDiv src={BoldLine} bold />
        <LineDiv src={Line} />
        <LineDiv src={Line} />
        <LineDiv src={Line} />
        <LineDiv src={Line} />
        <LineDiv src={BoldLine} bold />
        <LineDiv src={Line} />
        <LineDiv src={Line} />
        <LineDiv src={Line} />
        <LineDiv src={Line} />
        <LineDiv src={BoldLine} bold />
      </LineWrapper>

      <CustomRange
        type='range'
        value={value}
        min={0}
        max={100}
        step={10}
        onChange={handleChange}
      />

    </SliderContainer>
  );
}

const SliderContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75em;
`;

const CustomRange = styled.input`
  width: 100%;
  height: 0.9375em;
  box-sizing: border-box;
  border-radius: 2.5em;
  background: linear-gradient(90deg, #D0D8FF 0%, #8DA3FF 8.18%, #718FF2 30.77%, #4648A7 76.93%);
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.25em;
    height: 1.25em;
    border-radius: 50%;
    background-image: url(${Thumb});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0,0,0,0.25);
    transition: all 0.6s ease;
  }

  &::-moz-range-thumb {
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    background: #718FF2;
    cursor: pointer;
    box-shadow: 0 0 4px rgba(0,0,0,0.25);
    transition: background 0.6s ease-in-out;
  }
`;

const LineWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0em 0.75em;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
`;

const LineDiv = styled.img`
  height: ${(props) => (props.bold ? '0.875em' : '0.625em')};
  object-fit: contain;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    height: ${(props) => (props.bold ? '0.5em' : '0.25em')};
  }
`;