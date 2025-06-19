import styled from 'styled-components'
import SearchInput from '../../../shared/components/SearchInput';
import ContentCard from '../../../shared/components/ContentCard';
import { useEffect, useState } from 'react';
import { getThemesAPI } from '../../../features/search/api/getSearchAPI';
import CustomPagination from '../../../shared/components/CustomPagination';
import useDevice from '../../../shared/hooks/useDevice';
import { useLocation } from 'react-router-dom';

export default function SearchSection() {

  const { isMobile, isTablet, isDesktop } = useDevice();

  const location = useLocation();
  const keywordFromState = location.state?.keyword || '';

  const [keyword, setKeyword] = useState('');
  
  const [themes, setThemes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMobile ? 4 : 16;
  const adjustedTotalPages = Math.ceil(themes.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedThemes = themes.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > adjustedTotalPages) return;
    setCurrentPage(page);
  };

  const handleSearch = async () => {
    try {
      const data = await getThemesAPI({ keyword: keyword, page: 1, size: 10000 });
      setThemes(data.contents || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('검색 실패:', error);
      setThemes([]);
    }
  };

  useEffect(() => {
    setKeyword(keywordFromState);
  }, [keywordFromState]);

  useEffect(() => {
    if (keyword) {
      handleSearch(keyword);
    }
  }, [keyword]);

  return (
    <Wrap>

      <SearchInput 
        type='text' 
        keyword={keyword} 
        setKeyword={setKeyword}
        onSearch={handleSearch}
      />

      <TextWrapper>
        <MainText>검색 결과</MainText>
        <SubText>{'('}{themes.length}{')'}</SubText>
      </TextWrapper>

      <ListWrapper>
      {paginatedThemes.map((theme) => (
        <ContentCard
          key={theme.themeId}
          data={theme}
          type="search"   
          headCount={2} 
        />
      ))}
      </ListWrapper>

      <CustomPagination
        currentPage={currentPage}
        totalPages={adjustedTotalPages}
        onPageChange={handlePageChange}
      />

    </Wrap>
  )
}


const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 70rem;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    width: 43.3125rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
    gap: 0.875rem;
    padding-bottom: 1.21875rem;
  }
`;

const TextWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
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
    font-family: Pretendard-Regular;
    font-size: 0.875rem;
  }
`;

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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