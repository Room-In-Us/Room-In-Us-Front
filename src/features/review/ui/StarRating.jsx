import { useState } from "react";
import styled from "styled-components";
import StarIcon from "../../../shared/assets/icons/reviewWrite/star.svg";
import EmptyStar from "../../../shared/assets/icons/reviewWrite/starEmpty.svg";
import HalfStar from '../../../shared/assets/icons/reviewWrite/starhalf.svg';
import { FEEDBACK_TEXT } from "../modal/reviewDataList";

export default function StarRating({ value = 0, onChange, feedbackTexts }) {
  const [hovered, setHovered] = useState(null);

  const handleMouseEnter = (value) => setHovered(value);
  const handleMouseLeave = () => setHovered(null);
  const handleClick = (val) => onChange?.(val);

  const rating = hovered !== null ? hovered : value;

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const val = i + 1;
      let icon;
      if (rating >= val) icon = StarIcon;
      else if (rating >= val - 0.5) icon = HalfStar;
      else icon = EmptyStar;

      return (
        <StarWrapper key={i}>
          {/* 왼쪽 반 클릭: 0.5 단위 */}
          <Half onClick={() => handleClick(val - 0.5)} onMouseEnter={() => handleMouseEnter(val - 0.5)} />
          {/* 오른쪽 반 클릭: 정수 단위 */}
          <Half $right onClick={() => handleClick(val)} onMouseEnter={() => handleMouseEnter(val)} />
          <StarImg src={icon} onMouseLeave={handleMouseLeave} />
        </StarWrapper>
      );
    });
  };

  const texts = feedbackTexts?.length ? feedbackTexts : FEEDBACK_TEXT;

  const feedbackText = rating > 0 ? texts[Math.round(rating * 2) - 1] : '\u00A0';

  return (
    <Container>
      <Stars onMouseLeave={handleMouseLeave}>{renderStars()}</Stars>
      <FeedbackText>{feedbackText}</FeedbackText>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
`;

const StarWrapper = styled.div`
  position: relative;
`;

const Stars = styled.div`
  display: flex;
  position: relative;
  gap: 0.375em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 0.25em;
  }
`;

const StarImg = styled.img`
  width: 1.6875em;
  height: 1.6875em;
  pointer-events: none;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 1.25em;
    height: 1.25em;
  }
`;

const FeedbackText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Half = styled.div`
  position: absolute;
  top: 0;
  ${({ $right }) => $right ? "left: 50%;" : "left: 0;"}
  width: 50%;
  height: 100%;
  z-index: 1;
  cursor: pointer;
`;