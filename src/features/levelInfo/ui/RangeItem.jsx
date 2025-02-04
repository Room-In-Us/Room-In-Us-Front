import { useState, useRef } from 'react';
import styled from "styled-components";
import Handle from '../../../shared/assets/icons/level/slidehandle.svg'

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

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseUp);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    window.removeEventListener("mouseleave", handleMouseUp);
  };

  return (
    <SliderContainer ref={sliderRef}>

      <Thumb position={value} onMouseDown={handleMouseDown} />

      <LineWrapper>
         <LineDiv />
         <LineDiv />
         <LineDiv />
         <LineDiv />
       </LineWrapper>

      <Track />

      {/* Labels for the slider */}
      <Labels>
        {[0, 25, 50, 100].map((mark) => (
          <span key={mark}>{mark === 100 ? "100+방" : `${mark}방`}</span>
        ))}
      </Labels>
    </SliderContainer>
  );
}

const SliderContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 3.125em 0em;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LineWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LineDiv = styled.div`
  border-left: 1px solid #ffffff;
  height: 0.75em;
`;

const Track = styled.div`
  width: 100%;
  height: 1em;
  background: #d3d3d3;
`;

const Thumb = styled.div`
  position: absolute;
  bottom: 3.2em;
  left: ${(props) => `${props.position}%`};
  transform: translateX(-50%);
  width: 1.25em;
  height: 1.25em;
  transition: left 0.06s ease-out; /* Smooth animation */
  cursor: pointer;
  background: url(${Handle}) no-repeat center center;
  background-size: contain;

  &:active {
    cursor: pointer;
  }
`;

const Labels = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #ffffff;
  margin-top: 0.5em;
`;
