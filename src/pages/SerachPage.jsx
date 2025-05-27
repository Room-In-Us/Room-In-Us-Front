import styled from 'styled-components'
import SearchInput from '../shared/components/SearchInput';
import ContentCard from '../shared/components/ContentCard';
import { useState } from 'react';
import { getThemesAPI } from '../features/search/api/SearchApi';
import { useSearchParams } from 'react-router-dom';
import SearchIcon from '../shared/assets/icons/common/searchIcon.svg?react';
import CancelIcon from '../shared/assets/icons/common/cancelIcon.svg?react';
import PropTypes from "prop-types";
import CustomPagination from '../shared/components/CustomPagination';
import useDevice from '../shared/hooks/useDevice';

export default function SerachPage() {

  const { isMobile, isTablet, isDesktop } = useDevice();

  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  
  const [themes, setThemes] = useState([]);
  const [type, setType] = useState('main');

  const [expanded, setExpanded] = useState(type !== 'header');

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

  return (
    <Wrapper>
      {/* <SearchInput /> */}
      

    <Wrap>

      <InputWrapper
        expanded={expanded}
        isHeader={type === 'header'}
        onClick={() => setExpanded(true)}
      >
        <StyledSearchIcon
          onClick={(e) => {
            e.stopPropagation();
            handleSearch();
          }}
        />
        <StyledInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          expanded={expanded}
          type="text"
          placeholder='오늘 예약하고 싶은 테마는?'
        />
        {type === 'header' && (
          <StyledCancelIcon
            expanded={expanded}
            onClick={(event) => {
              event.stopPropagation();
              setExpanded(false);
            }}
          />
        )}
      </InputWrapper>

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
    </Wrapper>
  )
}

SearchInput.propTypes = {
  type: PropTypes.string.isRequired,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 5.625rem;
  gap: 2.5rem;
`;

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

const InputWrapper = styled.div`
  border-radius: 30px;
  padding: 0 0.703125rem;
  box-sizing: border-box;
  width: ${({ expanded }) => (expanded ? 'min(21.875rem, 100%)' : '2.8125rem')};
  max-width: 100%;
  height: 2.8125rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F9F9FB;
  transition: width 0.3s ease-in-out;

  ${({ expanded }) =>
    !expanded &&
    `
    &:hover, &:hover input {
      cursor: pointer;
      background: linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%);
    }
    &:hover svg {
      fill: #F9F9FB;
    }
  `}
`;

const StyledSearchIcon = styled(SearchIcon)`
  width: 1.40625rem;
  flex-shrink: 0; /* 아이콘 크기 줄어드는 것 방지 */
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ expanded }) => (expanded ? '0' : '1')}; /* input 나타날 때 아이콘 사라짐 */
  cursor: pointer;
`;

const StyledInput = styled.input`
  border: none;
  margin: 0 0.4375rem;
  outline: none;
  width: ${({ expanded }) => (expanded ? '100%' : '0')}; /* 초기 width 0으로 설정 */
  min-width: 0;
  flex-grow: 1;
  background-color: #F9F9FB;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  opacity: ${({ expanded }) => (expanded ? '1' : '0')}; /* 자연스럽게 나타나고 사라지도록 */
  visibility: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
  transition: width 0.3s ease-in-out, opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
  
  &::placeholder {
    color: #818496;
  }

  @media (max-width: 768px) {
    font-size: 0.5625rem;
    &::placeholder {
      font-size: 0.5625rem;
    }
  }
`;

const StyledCancelIcon = styled(CancelIcon)`
  width: 0.875rem;
  flex-shrink: 0;
  cursor: pointer;
  opacity: ${({ expanded }) => (expanded ? '1' : '0')};
  visibility: ${({ expanded }) => (expanded ? 'visible' : 'hidden')};
  transition: opacity 0.2s ease-in-out, visibility 0.2s ease-in-out;
`;