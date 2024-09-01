import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import LocationCard from '../assets/images/mainPage/locationCard.png';
import GenreCard from '../assets/images/mainPage/genreCard.png';
import LevelCard from '../assets/images/mainPage/levelCard.png';
import LeftLine from '../assets/images/mainPage/cardLeftLine.png';
import CenterLine from '../assets/images/mainPage/cardCenterLine.png';
import RightLine from '../assets/images/mainPage/cardRightLine.png';

function MainPage() {
    // navigate
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <CardWrapper>
                <StyledSwiper
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={2}
                    loop={true}
                    spaceBetween={-133}
                    effect={'coverflow'}
                    coverflowEffect={{
                        rotate: 80,
                        stretch: -33,
                        depth: 450,
                        modifier: 1,
                        slideShadows: false,
                    }}
                    pagination={false}
                    modules={[EffectCoverflow, Pagination]}
                >
                    <StyledSwiperSlide>
                        <StyledCard src={LocationCard} alt="위치"
                                    onClick={() => navigate("/location")}/>
                    </StyledSwiperSlide>
                    <StyledSwiperSlide>
                        <StyledCard src={GenreCard} alt="장르"
                                    onClick={() => navigate("/genre")}/>
                    </StyledSwiperSlide>
                    <StyledSwiperSlide>
                        <StyledCard src={LevelCard} alt="숙련도"
                                    onClick={() => navigate("/level")}/>
                    </StyledSwiperSlide>
                    <StyledSwiperSlide>
                        <StyledCard src={LocationCard} alt="위치"
                                    onClick={() => navigate("/location")}/>
                    </StyledSwiperSlide>
                    <StyledSwiperSlide>
                        <StyledCard src={GenreCard} alt="장르"
                                    onClick={() => navigate("/genre")}/>
                    </StyledSwiperSlide>
                    <StyledSwiperSlide>
                        <StyledCard src={LevelCard} alt="숙련도"
                                    onClick={() => navigate("/level")}/>
                    </StyledSwiperSlide>
                </StyledSwiper>

                {/* 하단 선 */}
                <CardLineWrapper>
                    <StyledLeftLine src={LeftLine} alt="좌측선"/>
                    <StyledCenterLine src={CenterLine} alt="중앙선"/>
                    <StyledRightLine src={RightLine} alt="우측선"/>
                </CardLineWrapper>
            </CardWrapper>
        </PageWrapper>
    )
}

export default MainPage;

// CSS
const PageWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const CardWrapper = styled.div`
    // border: 1px solid red;
    margin-top: 5em;
    width: 70em;
`;

const StyledSwiper = styled(Swiper)`
    width : 90%;
`;

const StyledSwiperSlide = styled(SwiperSlide)`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.5s ease, opacity 0.5s ease;
    &.swiper-slide-prev,
    &.swiper-slide-next {
        transform: scale(0.8);
    }
    &.swiper-slide-active {
        transform: scale(1);
        opacity: 1;
    }
    cursor: pointer;
`;

const StyledCard = styled.img`
    border-radius: 2em;
    width: 25.8234em;
    height: 23.8438em;
`;

const CardLineWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledLeftLine = styled.img`
    margin-bottom: 3em;
    width: 8.27em;
    height: 2.4539em;
`;
const StyledCenterLine = styled.img`
    margin: 3em 3em 0 3em;
    width: 42.024em;
    height: 2.228em;
`;
const StyledRightLine = styled.img`
    margin-bottom: 3em;
    width: 8.27em;
    height: 2.4539em;
`;