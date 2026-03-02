import { useState } from 'react';
import styled from 'styled-components';
import TextLogo from '../../shared/assets/icons/landing/landingTextLogo1.svg?react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import CarouselItem from './CarouselItem';
import ArrowIcon from '../../shared/assets/icons/common/arrow/rightArrow.svg?react';
import { Fade } from 'react-awesome-reveal';
import Img1 from '../../shared/assets/images/landing/landingSection2Img1.png';
import Img2 from '../../shared/assets/images/landing/landingSection2Img2.png';
import Img3 from '../../shared/assets/images/landing/landingSection2Img3.png';
import Img4 from '../../shared/assets/images/landing/landingSection2Img4.png';
import Img5 from '../../shared/assets/images/landing/landingSection2Img5.png';

const LandingSection2 = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const cards = [
    {
      number: '01',
      Img: Img1,
      title: '취향 입력하기',
      desc: '간단한 질문으로 선호 장르, 숙련도 등 취향 정보를 설정합니다.\n입력한 데이터를 기반으로 개인 취향 프로필이 생성됩니다.\n해당 정보는 추후 추천 결과에 반영됩니다.',
    },
    {
      number: '02',
      Img: Img2,
      title: '추천 테마 탐색',
      desc: '장르·숙련도·위치 검색을 통해\n취향 기반 맞춤 테마를 확인할 수 있습니다.\n지도 화면에서 주변 방탈출 정보를 한눈에 찾을 수 있습니다.',
    },
    {
      number: '03',
      Img: Img3,
      title: '테마 상세 정보 확인',
      desc: '스토리 콘셉트, 난이도, 사용자 평가 등 핵심 정보를 제공합니다.\n스포일러 없이 정리된 정보를 통해 선택을 돕습니다.\n예약 전 필요한 정보를 한 화면에서 확인할 수 있습니다.',
    },
    {
      number: '04',
      Img: Img4,
      title: '예약한 일정 관리하기',
      desc: '예약한 테마와 날짜를 일정 형태로 관리할 수 있습니다.\n다가오는 예약과 작성된 후기를 확인 가능합니다.\n개인 방탈출 이력을 체계적으로 정리할 수 있습니다.',
    },
    {
      number: '05',
      Img: Img5,
      title: '후기 남기기',
      desc: '템플릿 기반 입력 방식으로 후기를 작성할 수 있습니다.\n난이도·스토리·활동성 등 항목별 평가가 가능합니다.\n스포일러 없이 구조화된 리뷰를 남길 수 있습니다.',
    },
  ];

  return (
    <SectionWrapper>
      <BackgroundPiece />
      <Fade direction="up" duration={700} triggerOnce>
        <TitleWrapper>
          <StyledTextLogo />
          <Title>
            루미너스,
            <br />
            이렇게 시작해 보세요
          </Title>
        </TitleWrapper>
      </Fade>

      <Fade direction="up" duration={700} triggerOnce>
        <CarouselWrapper>
          <CarouselWrapper>
            {/* 좌 화살표 */}
            <NavArrowLeft className="landing2-prev" $disabled={activeIndex === 0} />

            <StyledSwiper
              loop={false}
              slidesPerView={1}
              spaceBetween={30}
              pagination={{ clickable: true }}
              navigation={{
                prevEl: '.landing2-prev',
                nextEl: '.landing2-next',
              }}
              modules={[Pagination, Navigation]}
              onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
              }}
            >
              {cards.map((c, idx) => (
                <SwiperSlide key={idx}>
                  <CarouselItem number={c.number} Img={c.Img} title={c.title} description={c.desc} />
                </SwiperSlide>
              ))}
            </StyledSwiper>

            {/* 우 화살표 */}
            <NavArrowRight className="landing2-next" $disabled={activeIndex === cards.length - 1} />
          </CarouselWrapper>
        </CarouselWrapper>
      </Fade>
    </SectionWrapper>
  );
};

export default LandingSection2;

// CSS
const SectionWrapper = styled.section`
  padding: 5.625em 0 8.125em 0;
  border-radius: 3.125em 3.125em 0 0;
  background: var(--RIU_Monochrome-700, #31323e);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5em;
  position: relative;
  pointer-events: auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BackgroundPiece = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3em;
  background: var(--RIU_Monochrome-10, #f9f9fb);
  z-index: -1;
`;

const StyledTextLogo = styled(TextLogo)`
  width: 21.3125em;
  height: 7.5em;

  @media (max-width: 768px) {
    width: 17.5em;
    height: 6.15625em;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  color: var(--RIU_Monochrome-10, #f9f9fb);
  font-family: 'Pretendard-Bold';
  font-size: 3em;
  line-height: normal;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.75em;
  }
`;

const CarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 3.125em;
`;

const StyledSwiper = styled(Swiper)`
  width: 35.125em;
  padding-bottom: 3.125em;

  .swiper-pagination {
    gap: 0.375rem;
  }

  .swiper-pagination-bullet {
    width: 0.625em;
    height: 0.625em;
    background-color: var(--RIU_Monochrome-10, #f9f9fb);
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: var(--RIU_Primary-100, #718ff2);
  }

  @media (max-width: 768px) {
    width: 18rem;
    padding-bottom: 2.75rem;
  }
`;

const NavArrowRight = styled(ArrowIcon)`
  width: 2.5em;
  height: 2.5em;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  flex-shrink: 0;

  path {
    fill: ${({ $disabled }) => ($disabled ? 'var(--RIU_Monochrome-60, #C4C6D1)' : 'var(--RIU_Primary-100, #718FF2)')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavArrowLeft = styled(ArrowIcon)`
  width: 2.5em;
  height: 2.5em;
  transform: rotate(180deg);
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  path {
    fill: ${({ $disabled }) => ($disabled ? 'var(--RIU_Monochrome-60, #C4C6D1)' : 'var(--RIU_Primary-100, #718FF2)')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;
