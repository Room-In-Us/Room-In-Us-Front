import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { mokeThemesData } from "../model/mokeThemesData";
import ContentCard from "../../../shared/components/ContentCard";
import RightArrow from "../../../shared/assets/icons/main/rightArrow.svg?react";
import Level1Icon from "../../../shared/assets/icons/common/levelIcon/level1.svg?react";
import Level2Icon from "../../../shared/assets/icons/common/levelIcon/level2.svg?react";
import Level3Icon from "../../../shared/assets/icons/common/levelIcon/level3.svg?react";
import Level4Icon from "../../../shared/assets/icons/common/levelIcon/level4.svg?react";
import useDevice from "../../../shared/hooks/useDevice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";

function LevelSection() {
  // navigate
  const navigate = useNavigate();

  // 반응형 함수
  const { isTablet, isMobile } = useDevice();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <TitleWrapper>
        <Title>숙련도 기반 추천</Title>
        <LocationSearchButton onClick={() => navigate('/level')}>
          더 많은 테마 둘러보기
          <StyledRightArrow/>
        </LocationSearchButton>
      </TitleWrapper>

      {/* 레벨 버튼 영역 */}
      <LevelWrapper>
        <LevelButton>
          <ButtonText>
            <StyledLevel1Icon />
            방세포
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledLevel2Icon />
            방초보
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledLevel3Icon />
            방중수
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledLevel4Icon />
            방고수
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
      </LevelWrapper>

      {/* 콘텐츠 카드 영역 */}
      { !isMobile && (
        <ListWrapper>
          {mokeThemesData.map((items) => (
            <ContentCard key={items.id} data={items} />
          ))}
        </ListWrapper>
      )}
      { isMobile && (
        <StyledSwiper 
          pagination={true} 
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1}
        >
          <StyledSwiperSlide1>
            <ListWrapper>
              {mokeThemesData.slice(0, 4).map((items) => (
                <ContentCard key={items.id} data={items} />
              ))}
            </ListWrapper>
          </StyledSwiperSlide1>
          <StyledSwiperSlide2>
            <ListWrapper>
              {mokeThemesData.slice(4, 8).map((items) => (
                <ContentCard key={items.id} data={items} />
              ))}
            </ListWrapper>
          </StyledSwiperSlide2>
        </StyledSwiper>
      )}
    </SectionWrapper>
  )
}

export default LevelSection;

// CSS
const SectionWrapper = styled.div`
  width: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    width: 57.75rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
    gap: 1.25rem;
  }
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 1.6875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.p`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.40625rem;

  @media (max-width: 1024px) {
    font-size: 1.875rem;
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
    font-size: 1.25rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const StyledRightArrow = styled(RightArrow)`
  margin-left: 0.75rem;
  width: 0.5rem;

  @media (max-width: 1024px) {
    margin-left: 0.625rem;
    width: 1.25rem;
  }
  @media (max-width: 768px) {
    margin-left: 0.125rem;
    width: 0.9375rem;
  }
`;

const LevelWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 768px) {
    align-items: flex-start;
    align-content: flex-start;
    row-gap: 1rem;
    align-self: stretch;
    flex-wrap: wrap;
  }
`;

const ButtonText = styled.div`
  display: flex;
  align-items: center;
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  transition: color 0.1s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const ButtonLine =  styled.div`
  border-radius: 1.875rem;
  width: 15.0625rem;
  height: 0.25rem;
  background-color: #D6D6DF;
  transition: background-color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    width: 12.8125rem;
  }
  @media (max-width: 768px) {
    width: 4.375rem;
    height: 0.1875rem;
  }
`;

const StyledLevel1Icon = styled(Level1Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledLevel2Icon = styled(Level2Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledLevel3Icon = styled(Level3Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledLevel4Icon = styled(Level4Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const LevelButton = styled.div`
  width: 16.5625rem;
  height: 2.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:hover ${ButtonText} {
    color: var(--RIU_Primary-100, #718FF2);
  }

  &:hover ${ButtonLine} {
    background-color: var(--RIU_Primary-100, #718FF2);
  }

  &:hover ${StyledLevel1Icon}, 
  &:hover ${StyledLevel2Icon}, 
  &:hover ${StyledLevel3Icon}, 
  &:hover ${StyledLevel4Icon} {
    fill: var(--RIU_Primary-100, #718FF2);
  }

  @media (max-width: 1024px) {
    width: 14.0625rem;
  }
  @media (max-width: 768px) {
    width: 5rem;
    height: 1.7rem;
  }
`;

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: space-between;

  @media (max-width: 768px) {
    gap: 0.625rem;
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: auto;
  padding-bottom: 2.3rem;

  .swiper-pagination {
    gap: 0.375rem;
  }

  .swiper-pagination-bullet {
    width: 0.375rem;
    height: 0.375rem;
    background-color: var(--RIU_Monochrome-70, #B3B6C3);
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: var(--RIU_Primary-80, #8DA3FF);
  }
`;
const StyledSwiperSlide1 = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;
const StyledSwiperSlide2 = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;