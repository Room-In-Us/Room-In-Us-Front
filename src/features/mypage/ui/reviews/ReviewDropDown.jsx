import styled from 'styled-components'
import DropDownIcon from '../../../../shared/assets/icons/common/dropdown.svg?react';
import { useRecoilState } from 'recoil';
import { reviewSortAtom } from '../../model/reviewSortAtom';
import { reviewSortOption } from '../../model/reviewDataList';
import { useEffect, useRef, useState } from 'react';

export default function ReviewDropDown() {

  const [isOpen, setIsOpen] = useState(false);
  const [sortOption, setSortOption] = useRecoilState(reviewSortAtom);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSortOption(option.value);
    setIsOpen(false);
  };

  const currentLabel = reviewSortOption.find(opt => opt.value === sortOption)?.label || '정렬';

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Wrapper ref={dropdownRef}>
      <DropDownWrapper onClick={() => setIsOpen(prev => !prev)}>
        <SortText>{currentLabel}</SortText>
        <DropDown />
      </DropDownWrapper>
      {isOpen && (
        <DropDownMenu>
          {reviewSortOption.map(option => (
          <DropDownItem key={option.value} onClick={() => handleSelect(option)}>
            <DropDownText>{option.label}</DropDownText>
          </DropDownItem>
          ))}
        </DropDownMenu>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  
  position: relative;
`;

const DropDownWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375em;
  cursor: pointer;
`;

const SortText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-SemiBold;
  font-size: 0.75em;

  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const DropDown = styled(DropDownIcon)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  path {
    fill: var(--RIU_Monochrome-200, #717486);
  }

  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

const DropDownMenu = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: calc(100% + 0.5em); 
  right: 0;
  z-index: 1000;
  cursor: pointer;
`;

const DropDownItem = styled.div`
  display: flex;
  width: 11.875em;
  height: 2.5em;
  padding: 0em 1.25em;
  align-items: center;
  gap: 0.625em;
  border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  background: var(--RIU_Monochrome-20, #F0F0F4);
  box-sizing: border-box;
`;

const DropDownText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 0.875em;
`;