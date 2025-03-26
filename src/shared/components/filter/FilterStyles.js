import styled from "styled-components";

export const Wrapper = styled.div`
  display flex;
  align-items: center;
  justify-content: center;
`;

// 필터 컨테이너 스타일
export const FilterContainer = styled.div`
position: relative;
display: flex;
padding: 0.625rem 1.25rem;
align-items: flex-start;
gap: 0.625rem;
border-radius: 1.25rem;
border: 1px solid var(--RIU_Primary-40, #B9C3FF);
background: var(--RIU_Monochrome-10, #F9F9FB);

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

// 필터 내부 텍스트 스타일
export const FilterTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 1024px) {
    gap: 0.1875rem;
  }
`;

export const FilterText = styled.div`
  color: var(--RIU_Primary-300, #5B6ACC);
  font-family: Pretendard-Bold;
  font-size: 0.875rem;

  @media (max-width: 1024px) {
    font-size: 0.65625rem;
  }
`;

export const FilterIcon = styled.img`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 0.703125rem;
    height: 0.703125rem;
  }
`;

// 드롭다운 아이콘 스타일
export const DropDownIcon = styled.img`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg{
    background: ${({ $isSelected }) => ($isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)")};
  }

  @media (max-width: 1024px) {
    width: 0.703125rem;
    height: 0.703125rem;
  }
`;

// 드롭다운 메뉴 스타일
export const DropdownMenu = styled.div`
  position: absolute;
  z-index: 10;
  box-sizing: border-box;
  margin-top: 0.625rem;

  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--RIU_Monochrome-20, #F0F0F4);
  box-shadow: 0rem 0.25rem 0.625rem rgba(0, 0, 0, 0.1);

  width: 11.875rem;
  top: ${({ top }) => `${top}px`}; 
  left: ${({ left }) => `${left}px`}; 

  @media (max-width: 1024px) {
    width: 8.90625rem;
    margin-top: 0.46875rem;
    box-shadow: 0rem 0.1875rem 0.46875rem rgba(0, 0, 0, 0.1);
  }
`;

export const DropdownHeader = styled.div`
  display: flex;
  width: 100%;
  height: 1.875rem;
  padding: 0rem 1.25rem;
  align-items: center;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Bold;
  font-size: 0.75rem;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    height: 1.40625rem;
    font-size: 0.5625rem;
    padding: 0rem 0.9375rem;
  }
`;

// 드롭다운 아이템 스타일
export const DropdownItem = styled.div`
  font-size: 0.875rem;
  color: var(--RIU_Monochrome-200, #717486);
  cursor: pointer;
  border-top: 1px solid var(--RIU_Monochrome-50, #D6D6DF);

  display: flex;
  width: 100%;
  height: 2.5rem;
  padding: 0rem 1.25rem;
  align-items: center;
  gap: 0.625rem;
  box-sizing: border-box;

  &:hover {
    background: #D0D8FF;
  }

  
  ${({ $isSelected }) =>
    $isSelected &&
    `
      background: #D0D8FF;
      color: var(--RIU_Primary-300, #5B6ACC);
    `}

  @media (max-width: 1024px) {
    height: 1.875rem;
    font-size: 0.65625rem;
    padding: 0rem 0.9375rem;
    gap: 0.46875rem;
  }
  @media (max-width: 768px) {
    border-top: none;
    border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
    height: 2.5rem;
    padding: 0rem 1.25rem;
    gap: 0.625rem;
  }
`;

export const MenuWrapper = styled.div`
  width: 100%;
  background: var(--RIU_Monochrome-20, #F0F0F4);
`;