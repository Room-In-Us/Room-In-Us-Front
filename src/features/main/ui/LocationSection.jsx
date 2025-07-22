import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import RightArrow from "../../../shared/assets/icons/common/arrow/rightArrow.svg?react";

function LocationSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <TitleWrapper>
        <Title>어디로 가시나요?</Title>
        <LocationSearchButton onClick={() => navigate('/location')}>
          그외 지역 검색하기
          <StyledRightArrow/>
        </LocationSearchButton>
      </TitleWrapper>

      {/* 대표지역 리스트 영역 */}
      <PopularLocatioinButtonWrapper>
        <PopularLocationButton onClick={() => navigate('/location')}>
          <ButtonTitle>강남</ButtonTitle>
          <ButtonSubTitle>강남, 신논현, 역삼</ButtonSubTitle>
        </PopularLocationButton>
        <PopularLocationButton onClick={() => navigate('/location')}>
          <ButtonTitle>홍대</ButtonTitle>
          <ButtonSubTitle>홍대입구, 합정, 상수</ButtonSubTitle>
        </PopularLocationButton>
        <PopularLocationButton onClick={() => navigate('/location')}>
          <ButtonTitle>건대</ButtonTitle>
          <ButtonSubTitle>건대입구</ButtonSubTitle>
        </PopularLocationButton>
        <PopularLocationButton onClick={() => navigate('/location')}>
          <ButtonTitle>인천</ButtonTitle>
          <ButtonSubTitle>부평, 인천터미널, 예술회관</ButtonSubTitle>
        </PopularLocationButton>
      </PopularLocatioinButtonWrapper>

      {/* 일반지역 리스트 영역 */}
      <LocationButtonWrapper>
        <LocationButton onClick={() => navigate('/location')}>수원</LocationButton>
        <LocationButton onClick={() => navigate('/location')}>신촌</LocationButton>
        <LocationButton onClick={() => navigate('/location')}>대학로</LocationButton>
        <LocationButton onClick={() => navigate('/location')}>잠실</LocationButton>
      </LocationButtonWrapper>
    </SectionWrapper>
  )
}

export default LocationSection;

// CSS
const SectionWrapper = styled.div`
  width: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    width: 43.3125rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
  }
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.p`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.40625rem;

  @media (max-width: 1024px) {
    font-size: 1.40625rem;
  }
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const LocationSearchButton = styled.p`
  display: flex;
  align-items: center;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Regular';
  font-size: 0.9375rem;
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 0.9375rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const StyledRightArrow = styled(RightArrow)`
  margin-left: 0.75rem;
  width: 0.9375rem;
  height: 0.9375rem;
  fill: var(--RIU_Monochrome-500, #515467);

  @media (max-width: 1024px) {
    margin-left: 0.46875rem;
  }
  @media (max-width: 768px) {
    margin-left: 0.125rem;
  }
`;

const PopularLocatioinButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    gap: 0.703125rem;
  }
  @media (max-width: 768px) {
    gap: 0.9375rem;
  }
`;

const PopularLocationButton = styled.div`
  border-radius: 0.46875rem;
  padding: 1.875rem;
  box-sizing: border-box;
  width: 16.5625rem;
  height: 7.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1875rem;
  justify-content: space-between;
  align-items: center;
  background: var(--RIU_Primary-Gradient-01, linear-gradient(101deg, #9FABF7 0.85%, #85BFB3 100%));
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0;
  }

  @media (max-width: 1024px) {
    border-radius: 0.46875rem;
    padding: 1.40625rem;
    width: 21.1875rem;
    height: 7.6875rem;
    gap: 0.890625rem;
  }
  @media (max-width: 768px) {
    border-radius: 0.3125rem;
    padding: 0.9375rem;
    width: 10rem;
    height: 5rem;
    gap: 0.625rem;
  }
`;

const ButtonTitle = styled.div`
  width: 100%;
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 1.6875rem;
  z-index: 1;

  @media (max-width: 1024px) {
    font-size: 1.3125rem;
  }
  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ButtonSubTitle = styled.div`
  width: 100%;
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  text-align: right;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const LocationButtonWrapper = styled.div`
  margin-top: 1.25rem;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    margin-top: 0.9375rem;
    gap: 0.9375rem;
  }
  @media (max-width: 768px) {
    gap: 0.625rem;
  }
`;

const LocationButton = styled.div`
  border-radius: 0.46875rem;
  width: 16.5625rem;
  height: 3.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  &:hover {
    background: var(--RIU_Primary-60, #A2ADFF);
    color: var(--RIU_Monochrome-10, #F9F9FB);
  }

  @media (max-width: 1024px) {
    border-radius: 0.3515625rem;
    width: 21.1875rem;
    height: 3.75rem;
    font-size: 1.125rem;
  }
  @media (max-width: 768px) {
    border-radius: 0.234375rem;
    width: 4.75rem;
    height: 2.5rem;
    font-size: 0.75rem;
  }
`;