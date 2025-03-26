import styled from 'styled-components';
import useDevice from "../../../shared/hooks/useDevice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import MainIcon from '../../../shared/assets/icons/genre/movieIcon.svg';
import {genres} from '../model/genreData'

export default function GenreTabSection({ activeGenre, onGenreClick }) {
    
  // 반응형 함수
  const { isDesktop, isMobile, isTablet } = useDevice();
  
  // 장르를 7개씩 나누는 함수
  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
      array.slice(index * size, index * size + size)
    );
  };

  // 장르를 7개씩 나눠서 저장
  const genreChunks = chunkArray(genres, 7);

  return (
    <Wrapper>
      <TopBar>
        <TopbarIcon src={MainIcon}/>
        <TextWrapper>
          <MainText>장르 검색</MainText>
          <SubText>내 취향에 딱 맞는 방탈출, 장르별로 쉽게 찾아보세요</SubText>
        </TextWrapper>
      </TopBar>
      <ContentsWrapper>
        {/* 장르 버튼 영역 */}
        { !isMobile && genres.map(({ icon: Icon, text, genre }) => (
          <GenreButton 
            key={genre} 
            onClick={() => onGenreClick(genre)}
            isActive={activeGenre === genre}
          >
            <StyledGenreIcon isActive={activeGenre === genre}>
              <Icon />
            </StyledGenreIcon>
            <ButtonText isActive={activeGenre === genre}>{text}</ButtonText>
            <ButtonLine isActive={activeGenre === genre} />
          </GenreButton>
        ))}

        { isMobile && (
        <StyledSwiper
          isMobile={isMobile}
          pagination={true} 
          modules={[Pagination]}
          spaceBetween={isMobile ? 30 : 70} 
          slidesPerView={1}
        >
          {genreChunks.map((chunk, index) => (
          <StyledSwiperSlide key={index}>
            {chunk.map(({ icon: Icon, text, genre }) => (
            <GenreButton
            key={genre}
            onClick={() => onGenreClick(genre)}
            isActive={activeGenre === genre}
            >
              <StyledGenreIcon isActive={activeGenre === genre}>
                <Icon />
              </StyledGenreIcon>
              <ButtonText isActive={activeGenre === genre}>{text}</ButtonText>
              <ButtonLine isActive={activeGenre === genre} />
            </GenreButton>
            ))}
          </StyledSwiperSlide>
          ))}
        </StyledSwiper>
      )}
      </ContentsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 70rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  border-radius: 1.25rem;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 1024px) {
    width: 43.3125rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1.25rem 1.875rem;
  align-items: center;
  gap: 1.875rem;
  box-sizing: border-box;
  background: var(--RIU_Primary-Gradient-01, linear-gradient(101deg, #9FABF7 0.85%, #85BFB3 100%));

  @media (max-width: 1024px) {
    padding: 0.9375rem 1.40625rem;
    gap: 1.40625rem;
  }
  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.625rem;
  }
`;

const TopbarIcon = styled.img`
  display: flex;
  width: 3.75rem;
  height: 3.75rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 2.8125rem;
    height: 2.8125rem;
  }
  @media (max-width: 768px) {
    width: 2.34375rem;
    height: 2.34375rem;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  @media (max-width: 1024px) {
    gap: 0.1875rem;
  }
  @media (max-width: 768px) {
    gap: 0.125rem;
  }
`;

const MainText = styled.div`
  color: var(--RIU_Primary-600, #303281);
  font-family: Pretendard-ExtraBold;
  font-size: 1.75rem;

  @media (max-width: 1024px) {
    font-size: 1.3125rem;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SubText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 1.125rem;

  @media (max-width: 1024px) {
    font-size: 0.84375rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const ContentsWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 1.875rem 0rem 2.5rem 0rem;
  justify-content: space-between;
  align-items: center;
  row-gap: 1.25rem;
  flex-wrap: wrap;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 1.40625rem 0rem 1.875rem 0rem;
    row-gap: 0.9375rem;
  }
  @media (max-width: 768px) {
    padding: 0.375rem 0.875rem 0.625rem 0.875rem;
    gap: 0.5rem;
  }
`;

const ButtonText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "var(--RIU_Monochrome-100, #818496)")};
  font-family: 'Pretendard-Bold';
  transition: color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    font-size: 0.625rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
    width: 2.5rem;
  }
`;

const ButtonLine = styled.div`
  border-radius: 1.875rem;
  width: 6.625rem;
  height: 0.25rem;
  background-color: ${props => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "#D6D6DF")};
  transition: background-color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    width: 2.8125rem;
  }
  @media (max-width: 768px) {
    width: 2.5rem;
  }
`;

const StyledGenreIcon = styled.div`
  display: flex;
  width: 3.375rem;
  height: 3.375rem;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease-in-out;
  gap: 0.5rem;
  color: ${(props) => (props.isActive ? "#718FF2" : "#818496")};

  svg {
    width: 100%;
    height: 100%;
    max-width: 3.375rem;
    max-height: 3.375rem;
  }

  path {
    fill: currentColor;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    width: 2.53125rem;
    height: 2.53125rem;
  }
  @media (max-width: 768px) {
    width: 1.40625rem;
    height: 1.40625rem;
  }
`;

const GenreButton = styled.div`
  display: flex;
  width: 10rem;
  height: 6.25rem;
  padding: 0rem 1.875rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
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
    width: 5.625rem;
    height: 4.6875rem;
    padding: 0rem 1.40625rem;
  }
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 3.125rem;
    padding: 0rem 0.125rem;
  }
`;

const StyledSwiper = styled(Swiper)`
  width: 100%;
  height: auto;

  .swiper-pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.1875rem 0.3125rem;
    box-sizing: border-box;
    margin-top: 0.5rem;
    position: relative;
    bottom: 0rem;
  }

  .swiper-pagination-bullet {
    width: 0.1875rem;
    height: 0.1875rem;
    background-color: var(--RIU_Monochrome-70, #B3B6C3);
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: var(--RIU_Primary-80, #8DA3FF);
  }
`;
const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;