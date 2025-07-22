import styled from "styled-components";
import useDevice from "../../shared/hooks/useDevice";
import NavLeft from '../assets/icons/common/arrow/leftArrow.svg?react';
import NavRight from '../assets/icons/common/arrow/rightArrow.svg?react';
import NavDoubleRight from '../assets/icons/common/arrow/doubleRightArrow.svg?react';
import NavDoubleLeft from '../assets/icons/common/arrow/doubleLeftArrow.svg?react';

export default function CustomPagination({ currentPage, totalPages, onPageChange }) {
  
  const { isMobile } = useDevice();

  const pageJumpSize = isMobile ? 5 : 10;

  const showDoubleIcons = isMobile ? totalPages > 5 : totalPages > 10;

  let startPage, endPage;

  if (isMobile && totalPages <= 5) {
    startPage = 1;
    endPage = totalPages;
  } else if (isMobile) {
    startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    endPage = Math.min(startPage + 4, totalPages);
  } else if (totalPages > 10) {
    startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
    endPage = Math.min(startPage + 9, totalPages);
  } else {
    startPage = 1;
    endPage = totalPages;
  }
  
  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);  

  return (
    <PaginationWrapper>

      {/* 페이지 이동 */}
      <ButtonWrapper>
        {showDoubleIcons && (
          <NavDoubleLeftbtn
            onClick={() => onPageChange(Math.max(1, currentPage - pageJumpSize))}
            disabled={startPage === 1}
          />
        )}
        <NavLeftButton 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1} 
        />
      </ButtonWrapper>

      {/* 페이지 숫자 */}
        <PageButtonWrapper>
          {pageNumbers.map((page) => (
            <PageButton
              key={page}
              onClick={() => onPageChange(page)}
              isActive={currentPage === page}
            >
              {page}
            </PageButton>
          ))}
        </PageButtonWrapper>
      
      {/* 페이지 이동 */}
      <ButtonWrapper>
        <NavRightButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        {showDoubleIcons && (
          <NavDoubleRightbtn
            onClick={() => onPageChange(Math.min(currentPage + pageJumpSize, totalPages))}
            disabled={endPage === totalPages}
          />
        )}
      </ButtonWrapper>
    </PaginationWrapper>
  );
}

// CSS
const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    gap: 1.40625rem;
  }
  @media (max-width: 768px) {
    width: 100%;
    gap: 0rem;
    justify-content: space-between;
    padding: 0 0.625rem;
    box-sizing: border-box;
  }
`;

const PageButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageButton = styled.div`
  color: ${({ isActive }) => (isActive ? "#5B6ACC" : "#717486")};
  cursor: pointer;
  font-family: Pretendard-SemiBold;
  font-size: 0.875rem;

  &:hover {
    color: #5B6ACC;
  }
`;

const NavLeftButton = styled(NavLeft)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  justify-content: center;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  path {
    fill: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }

  &:hover {
    color: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }
`;

const NavRightButton = styled(NavRight)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  justify-content: center;
  align-items: center;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  path {
    fill: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }

  &:hover {
    color: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }
`;

const NavDoubleRightbtn = styled(NavDoubleRight)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  justify-content: center;
  align-items: center;
  padding: 0.125rem;
  box-sizing: border-box;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  path {
    fill: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }
  
  &:hover {
    color: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }
`;

const NavDoubleLeftbtn = styled(NavDoubleLeft)`
  display: flex;
  width: 1.25rem;
  height: 1.25rem;
  justify-content: center;
  align-items: center;
  padding: 0.125rem;
  box-sizing: border-box;

  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};

  path {
    fill: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }
  
  &:hover {
    color: ${({ disabled }) => (disabled ? "#A1A4B5" : "#5B6ACC")};
  }
`;