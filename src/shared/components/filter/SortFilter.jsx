import { forwardRef, useImperativeHandle } from "react";
import styled from "styled-components";
import { 
  Wrapper, 
  FilterContainer, 
  FilterTextWrapper, 
  FilterText, 
  FilterIcon, 
  DropDownIcon, 
  DropdownMenu, 
  DropdownHeader, 
  DropdownItem,
  MenuWrapper } from "./FilterStyles.js";
import FilterIcon1 from '../../../shared/assets/icons/common/filterIcon/satisfactionstar.svg?react';
import FilterIcon2 from '../../../shared/assets/icons/common/filterIcon/review.svg?react';
import FilterIcon3 from '../../../shared/assets/icons/common/filterIcon/price.svg?react';
import FilterIcon4 from '../../../shared/assets/icons/common/filterIcon/level.svg?react';
import FilterIcon5 from '../../../shared/assets/icons/common/filterIcon/fearlevel.svg?react';
import FilterIcon6 from '../../../shared/assets/icons/common/filterIcon/activelevel.svg?react';
import Satisfaction from '../../../shared/assets/icons/genre/satisfaction.svg';
import DropDownImg from "../../../shared/assets/icons/common/dropdown.svg";
import Check from '../../../shared/assets/icons/common/filterIcon/check.svg';
import useDevice from "../../hooks/useDevice.js";
import useDropdown from "../../hooks/useDropDown.js"; 

const options = [
  {value: "만족도 높은 순", label: "만족도 높은 순", icon: FilterIcon1 },
  {value: "후기 많은 순", label: "후기 많은 순", icon: FilterIcon2 },
  {value: "가격 낮은 순", label: "가격 낮은 순", icon: FilterIcon3 },
  {value: "난이도 높은 순", label: "난이도 높은 순", icon: FilterIcon4 },
  {value: "공포도 높은 순", label: "공포도 높은 순", icon: FilterIcon5 },
  {value: "활동성 높은 순", label: "활동성 높은 순", icon: FilterIcon6 },
];

const SortFilter = forwardRef(({ onSelect, selected: externalSelected }, ref) => {
  const { isMobile, isTablet, isDeskTop } = useDevice();
  const {
    isOpen,
    selected,
    toggleDropdown,
    handleSelect,
    position,
    triggerRef: filterRef,
    dropdownRef,
    reset
  } = useDropdown({ 
    defaultValue: externalSelected,
    initialWidth: 190,
    responsive: true,
    onSelect,
  });

  useImperativeHandle(ref, () => ({
    reset,
  }));


  return (
    <Wrapper>

      { !isMobile && (
        <FilterContainer ref={filterRef} >
          <FilterTextWrapper>
            <FilterIcon src={Satisfaction} />
            <FilterText>{options.find((o) => o.value === selected)?.label}</FilterText>
          </FilterTextWrapper>
          <DropDownIcon src={DropDownImg} onClick={toggleDropdown} />
        </FilterContainer>
      )}
    

   {isMobile ? (
      <MenuWrapper>
            {options.map(({value, label, icon: Icon}) => (
              <DropdownItem key={value} onClick={() => handleSelect(value)} $isSelected={selected === value}>
                <StyledIcon>
                  <Icon style={{ color: selected === value ? "#5B6ACC" : "#717486" }} />
                </StyledIcon>
                <RadioLabel $isSelected={selected === value}>{label}</RadioLabel>
                {selected === value && <SelectIcon src={Check} />}
              </DropdownItem>
            ))}
      </MenuWrapper>
    ) : (
        <>
      {isOpen && (
        <DropdownMenu ref={dropdownRef} style={{top: position.top, left: position.left}} >
          <DropdownHeader>정렬 기준</DropdownHeader>
          {options.map(({value, label, icon: Icon}) => (
            <DropdownItem key={value} onClick={() => handleSelect(value)} $isSelected={selected === value}>
              <StyledIcon>
                <Icon style={{ color: selected === value ? "#5B6ACC" : "#717486" }} />
              </StyledIcon>
              <RadioLabel $isSelected={selected === value}>{label}</RadioLabel>
              {selected === value && <SelectIcon src={Check} />}
            </DropdownItem>
          ))}
        </DropdownMenu>
      )}
      </>
    )}
    </Wrapper>
  );
})

const StyledIcon = styled.div`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 0.703125rem;
    height: 0.703125rem;
  }
  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

const RadioLabel = styled.div`
  font-size: 0.875rem;
  font-family: ${({ $isSelected }) => ($isSelected ? "Pretendard-Bold" : "Pretendard-Medium")};
  color: ${({ $isSelected }) => ($isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)")};

  @media (max-width: 1024px) {
    font-size: 0.65625rem;
  }
  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const SelectIcon = styled.img`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 0.703125rem;
    height: 0.703125rem;
  }
  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

export default SortFilter;