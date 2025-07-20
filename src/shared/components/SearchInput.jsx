import PropTypes from "prop-types";
import styled from 'styled-components';
import { useState } from 'react';
import SearchIcon from '../assets/icons/common/searchIcon.svg?react';
import CancelIcon from '../assets/icons/common/cancelIcon.svg?react';

function SearchInput({ type, keyword, setKeyword, onSearch }) {

  const [expanded, setExpanded] = useState(type !== 'header');

  // 검색 버튼 클릭
  const handleSearchClick = (e) => {
    e.stopPropagation();
    if (!expanded) {
      setExpanded(true);
    } else {
      onSearch(keyword); 
    }
  };

  return (
    <InputWrapper
      expanded={expanded}
      isHeader={type === 'header'}
      onClick={() => setExpanded(true)}
    >
      <StyledSearchIcon
        onClick={handleSearchClick}
      />
      <StyledInput
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearch(e.target.value);
          }
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
  );
}

// PropTypes 정의 추가
SearchInput.propTypes = {
  type: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default SearchInput;

// CSS
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