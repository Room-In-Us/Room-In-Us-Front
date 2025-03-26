import styled from "styled-components";
import NavLeft from '../assets/icons/common/pagenavleft.svg?react';
import NavRight from '../assets/icons/common/pagenavright.svg?react';

export default function CustomPagination({ currentPage, totalPages, onPageChange }) {
  return (
    <PaginationWrapper>
      {/* 이전 페이지 버튼 */}
      <NavLeftButton onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />

      {/* 페이지 숫자 버튼 */}
      {Array.from({ length: totalPages }, (_, index) => (
        <PageButton
          key={index}
          onClick={() => onPageChange(index + 1)}
          isActive={currentPage === index + 1}
        >
          {index + 1}
        </PageButton>
      ))}

      {/* 다음 페이지 버튼 */}
      <NavRightButton onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
    </PaginationWrapper>
  );
}

// CSS
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.875rem;

  @media (max-width: 1024px) {
    gap: 1.40625rem;
  }
`;

const PageButton = styled.div`
  color: ${({ isActive }) => (isActive ? "#5B6ACC" : "#717486")};
  cursor: pointer;
  font-family: Pretendard-SemiBold;
  font-size: 0.875rem;

  &:hover {
    color: #5B6ACC;
  }

  @media (max-width: 1024px) {
    font-size: 0.65625rem;
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

  @media (max-width: 1024px) {
    width: 0.9375rem;
    height: 0.9375rem;
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

  @media (max-width: 1024px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;