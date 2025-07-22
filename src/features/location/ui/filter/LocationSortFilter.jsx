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
  MenuWrapper } from "../../../../shared/styles/LocationFilterStyles.js";
import Satisfaction from '../../../../shared/assets/icons/genre/satisfaction.svg';
import DropDownImg from "../../../../shared/assets/icons/common/arrow/downArrow.svg";
import Check from '../../../../shared/assets/icons/common/filterIcon/check.svg';
import useDevice from "../../../../shared/hooks/useDevice.js";
import useDropdown from "../../../../shared/hooks/useDropDown.js"; 
import { sortOptions } from "../../../../shared/components/filter/OptionList.js";
import PropTypes from 'prop-types';

const LocationSortFilter = forwardRef(({ onSelect, selected: externalSelected }, ref) => {
  const { isMobile } = useDevice();
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
    getValue: () => selected,
  }));


  return (
    <Wrapper>

      { !isMobile && (
        <FilterContainer ref={filterRef} onClick={toggleDropdown} >
          <FilterTextWrapper>
            <FilterIcon src={Satisfaction} />
            <FilterText>{sortOptions.find((o) => o.value === selected)?.label}</FilterText>
          </FilterTextWrapper>
          <DropDownIcon src={DropDownImg} $isRotated={isOpen}/>
        </FilterContainer>
      )}
    

   {isMobile ? (
      <MenuWrapper>
            {sortOptions.map(({value, label, icon: Icon}) => (
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
      <DropdownMenu ref={dropdownRef} style={{top: position.top*0.7, left: position.left*1.2}} $isVisible={isOpen} >
        <DropdownHeader>정렬 기준</DropdownHeader>
        {sortOptions.map(({value, label, icon: Icon}) => (
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
    </Wrapper>
  );
})

const StyledIcon = styled.div`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 0.703125em;
    height: 0.703125em;
  }
  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

const RadioLabel = styled.div`
  font-size: 0.875em;
  font-family: ${({ $isSelected }) => ($isSelected ? "Pretendard-Bold" : "Pretendard-Medium")};
  color: ${({ $isSelected }) => ($isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)")};

  @media (max-width: 1024px) {
    font-size: 0.65625em;
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const SelectIcon = styled.img`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 0.703125em;
    height: 0.703125em;
  }
  @media (max-width: 768px) {
    width: 0.9375em;
    height: 0.9375em;
  }
`;

// PropTypes 정의 (eslint 에러 방지)
LocationSortFilter.propTypes = {
  onSelect: PropTypes.any.isRequired,
  selected: PropTypes.any.isRequired,
};
LocationSortFilter.displayName = "LocationSortFilter";

export default LocationSortFilter;