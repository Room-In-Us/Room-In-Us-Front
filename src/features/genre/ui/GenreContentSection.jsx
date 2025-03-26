import { useEffect, useState } from 'react';
import styled from 'styled-components'
import useDevice from "../../../shared/hooks/useDevice";
import ContentCard from "../../../shared/components/ContentCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from 'swiper/modules';
import { getGenreListAPI } from "../../genre/api/genreAPI";
import FilterImg from '../../../shared/assets/icons/genre/filter.svg';
import PeopleFilter from '../../../shared/components/filter/PeopleFilter';
import SortFilter from '../../../shared/components/filter/SortFilter';
import RegionFilter from '../../../shared/components/filter/RegionFilter';
import { genres } from '../model/genreData';
import CustomPagination from '../../../shared/components/CustomPagination';
import BottomSheet from '../../../shared/components/BottomSheet';

export default function GenreContentSection({ activeGenre }) {

  // 반응형 함수
  const { isDesktop, isTablet, isMobile } = useDevice();
  const [themeList, setThemeList] = useState([]);
  const [selectedZone, setSelectedZone] = useState("지역 전체");
  const [selectedRegions, setSelectedRegions] = useState([]);

  const [selectedSort, setSelectedSort] = useState("만족도 높은 순");

  const [headCount, setHeadCount] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 100 : 8;

  const [isBottomSheetOpen, setBottomSheetOpen] = useState(false);


  // 장르 목록 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getGenreListAPI(activeGenre, headCount, 1, 100);
        setThemeList(response.contents);
      } catch (error) {
        console.error('장르 기반 방탈출 목록 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchData();
  }, [activeGenre, headCount]);

  // 인원수 필터링
  const handlePeopleFilterChange = (count) => {
    setHeadCount(count); 
  };
  
  // 선택된 장르 찾기
  const selectedGenre = genres.find((g) => g.genre === activeGenre);

  // 지역 필터링 함수
  const handleZoneSelect = (zone) => {
    setSelectedZone(zone);
  };

  // 지역 필터링
  const filteredThemeList =
  Array.isArray(selectedZone) && selectedZone.length > 0
    ? themeList.filter((item) => selectedZone.includes(item.locationName))
    : themeList;


  const adjustedTotalPages = Math.ceil(filteredThemeList.length / itemsPerPage);

  
  const handlePageChange = (page) => {
    if (page < 1 || page > adjustedTotalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    const adjustedTotalPages = Math.ceil(filteredThemeList.length / itemsPerPage);
    if (currentPage > adjustedTotalPages) {
      setCurrentPage(1);
    }
  }, [filteredThemeList, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    setHeadCount(2);
    setSelectedZone(null);
    setSelectedSort("만족도 높은 순");
  };

  
  return (
    <Wrapper>
      <TopBar>
        <TextWrapper>
          <MainText>{selectedGenre ? selectedGenre.text : "기본"} 테마</MainText>
          <SubText>	&#40;{filteredThemeList.length}&#41;</SubText>
        </TextWrapper>

        { !isMobile && (
          <FilterWrapper>
            {/* 인원수 필터 */}
            <PeopleFilter onSelect={(count) => handlePeopleFilterChange(count)} selected={headCount} />

            {/* 만족도 필터 */}
            <SortFilter onSelect={(value) => setSelectedSort(value)} selected={selectedSort} />
    
            {/* 지역 필터 */}
            <RegionFilter onSelect={handleZoneSelect} selected={selectedZone} />
          </FilterWrapper>
        )}

        { isMobile && (
          <Filter onClick={() => setBottomSheetOpen(true)}>
            <FilterIcon src={FilterImg} />
            <LocationFilterText>필터</LocationFilterText>
          </Filter>
        )}

      </TopBar>

      {/* 바텀 시트 추가 */}
      {isMobile && (
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setBottomSheetOpen(false)}
          onApply={({ people, region, sort }) => {
            console.log("✅ 필터 적용됨:", { people, region, sort });
            console.log("📦 적용된 지역:", region);
            handlePeopleFilterChange(people);
            setSelectedZone(region);     
            setSelectedRegions(region);
            setSelectedSort(sort);    
          }}
          onReset={handleResetFilters}
          selectedRegion={selectedZone}
          selectedPeople={headCount}
          selectedSort={selectedSort}
        />
      )}

      {/* 콘텐츠 카드 영역 */}
      { !isMobile && (
        <>
          <ListWrapper>
          {filteredThemeList
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((items) => (
              <ContentCard key={items.id} data={items} headCount={headCount} />
            ))}
          </ListWrapper>

          {/* 페이지네이션 */}
          <CustomPagination
            currentPage={currentPage}
            totalPages={adjustedTotalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {isMobile && filteredThemeList.length > 0 && (
        <StyledSwiper
          pagination={true} 
          modules={[Pagination]}
          spaceBetween={30} 
          slidesPerView={1}
        >
          {Array.from({ length: Math.ceil(filteredThemeList.length / 4) }, (_, index) => (
          <StyledSwiperSlide key={index}>
            <ListWrapper>
            {filteredThemeList.slice(index * 4, (index + 1) * 4).map((items) => (
              <ContentCard key={items.id} data={items} headCount={headCount} />
            ))}
            </ListWrapper>
          </StyledSwiperSlide>
        ))}
        </StyledSwiper>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 70rem;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    width: 43.3125rem;
    gap: 1.40625rem;
  }
  @media (max-width: 768px) {
    width: 22.1875rem;
    gap: 0.625rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  @media (max-width: 1024px) {
    width: 100%;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const MainText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-ExtraBold;
  font-size: 1.375rem;

  @media (max-width: 1024px) {
    font-size: 1.03125rem;
  }
  @media (max-width: 768px) {
    font-family: Pretendard-Medium;
    font-size: 0.875rem;
  }
`;

const SubText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-Regular;
  font-size: 1.375rem;

  @media (max-width: 1024px) {
    font-size: 1.03125rem;
  }
  @media (max-width: 768px) {
    font-family: Pretendard-Medium;
    font-size: 0.875rem;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const Filter = styled.div`
  display: flex;
  padding: 0.625rem 1.25rem;
  align-items: flex-start;
  gap: 0.625rem;
  border-radius: 1.25rem;
  border: 1px solid var(--RIU_Primary-40, #B9C3FF);
  background: var(--RIU_Monochrome-10, #F9F9FB);
  cursor: pointer;

  @media (max-width: 1024px) {
    padding: 0.46875rem 0.9375rem;
    align-items: center;
    gap: 0.46875rem;
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    padding: 0.375rem 0.875rem;
    align-items: center;
    gap: 0.375rem;
  }
`;

const FilterIcon = styled.img`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;
`;

const LocationFilterText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Medium;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;

  @media (max-width: 1024px) {
    gap: 0.9375rem;
    justify-content: space-between;
  }
  @media (max-width: 768px) {
    gap: 0.625rem;
    justify-content: center;
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
const StyledSwiperSlide = styled(SwiperSlide)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;