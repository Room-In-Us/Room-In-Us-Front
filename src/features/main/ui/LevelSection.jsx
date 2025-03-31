import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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
import { getLevelListAPI } from "../../level/api/levelAPI";

function LevelSection() {
  // state 관리
  const [activeLevel, setActiveLevel] = useState('BEGINNER');
  const [themeList, setThemeList] = useState([]);

  // navigate
  const navigate = useNavigate();

  // 반응형 함수
  const { isDesktop, isMobile } = useDevice();

  // 버튼 활성화 함수
  const handleLevelClick = (level) => {
    setActiveLevel(level);
  };

  // 인원수 기준
  const headCount = 2;

  // 숙련도 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLevelListAPI(activeLevel, headCount, 1, 8);
        console.log('숙련도 기반 방탈출 테마 목록: ', response.contents);
        setThemeList(response.contents);
      } catch (error) {
        console.error('숙련도 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [activeLevel]);

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
        {[
          { icon: StyledLevel1Icon, text: "방세포", level: "BEGINNER" },
          { icon: StyledLevel2Icon, text: "방초보", level: "JUNIOR" },
          { icon: StyledLevel3Icon, text: "방중수", level: "SENIOR" },
          { icon: StyledLevel4Icon, text: "방고수", level: "MASTER" },
        ].map(({ icon: Icon, text, level }) => (
          <LevelButton 
            key={level} 
            onClick={() => handleLevelClick(level)}
            isActive={activeLevel === level}
          >
            <ButtonText isActive={activeLevel === level}>
              <Icon isActive={activeLevel === level} />
              {text}
            </ButtonText>
            <ButtonLine isActive={activeLevel === level}></ButtonLine>
          </LevelButton>
        ))}
      </LevelWrapper>

      {/* 콘텐츠 카드 영역 */}
      { isDesktop && (
        <ListWrapper>
          {themeList.map((items) => (
            <ContentCard key={items.id} data={items} headCount={headCount} type="home"/>
          ))}
        </ListWrapper>
      )}
      { !isDesktop && (
        <StyledSwiper
          isMobile={isMobile}
          pagination={true} 
          modules={[Pagination]}
          spaceBetween={isMobile ? 30 : 70} 
          slidesPerView={1}
        >
          <StyledSwiperSlide1>
            <ListWrapper>
              {themeList.slice(0, 4).map((items) => (
                <ContentCard key={items.id} data={items} headCount={headCount} type="home"/>
              ))}
            </ListWrapper>
          </StyledSwiperSlide1>
          <StyledSwiperSlide2>
            <ListWrapper>
              {themeList.slice(4, 8).map((items) => (
                <ContentCard key={items.id} data={items} headCount={headCount} type="home"/>
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
    width: 43.3125rem;
    gap: 1.40625rem;
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

  @media (max-width: 1024px) {
    height: 1.265625rem;
  }
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
  width: 0.5rem;

  @media (max-width: 1024px) {
    margin-left: 0.46875rem;
    width: 0.9375rem;
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
  color: ${props => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "var(--RIU_Monochrome-100, #818496)")};
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  transition: color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const ButtonLine = styled.div`
  border-radius: 1.875rem;
  width: 15.0625rem;
  height: 0.25rem;
  background-color: ${props => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "#D6D6DF")};
  transition: background-color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    width: 9.609375rem;
    height: 0.1875rem;
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
  fill: ${(props) => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "currentColor")};

  @media (max-width: 1024px) {
    margin-right: 0.3515625rem;
    width: 1.265625rem;
  }
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledLevel2Icon = styled(Level2Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  fill: ${(props) => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "currentColor")};

  @media (max-width: 1024px) {
    margin-right: 0.3515625rem;
    width: 1.265625rem;
  }
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledLevel3Icon = styled(Level3Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  fill: ${(props) => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "currentColor")};

  @media (max-width: 1024px) {
    margin-right: 0.3515625rem;
    width: 1.265625rem;
  }
  @media (max-width: 768px) {
    width: 1.2rem;
    height: 1.2rem;
  }
`;
const StyledLevel4Icon = styled(Level4Icon)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
  fill: ${(props) => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "currentColor")};

  @media (max-width: 1024px) {
    margin-right: 0.3515625rem;
    width: 1.265625rem;
  }
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
  
  ${props => props.isActive && `
    ${ButtonText} {
      color: var(--RIU_Primary-100, #718FF2);
    }
    ${ButtonLine} {
      background-color: var(--RIU_Primary-100, #718FF2);
    }
  `}

  &:hover ${ButtonLine} {
    background-color: var(--RIU_Primary-100, #718FF2);
  }

  &:hover ${ButtonText}, &:hover svg {
    color: var(--RIU_Primary-100, #718FF2);
    fill: var(--RIU_Primary-100, #718FF2);
  }

  @media (max-width: 1024px) {
    width: 10.546875rem;
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

  @media (max-width: 1024px) {
    gap: 0.9375rem;
  }
  @media (max-width: 768px) {
    gap: 0.625rem;
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: auto;
  padding-bottom: ${({ isMobile }) => (isMobile ? "2.3rem" : "4rem")};

  .swiper-pagination {
    gap: 0.375rem;
  }

  .swiper-pagination-bullet {
    width: ${({ isMobile }) => (isMobile ? "0.375rem" : "0.5rem")};
    height: ${({ isMobile }) => (isMobile ? "0.375rem" : "0.5rem")};
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
  gap: 1rem;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 0.75rem;
  }
`;
const StyledSwiperSlide2 = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 0.75rem;
  }
`;