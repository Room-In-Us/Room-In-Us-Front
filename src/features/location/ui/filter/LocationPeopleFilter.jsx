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
  MenuWrapper } from "./LocationFilterStyles.js";
import DropDownImg from "../../../../shared/assets/icons/common/dropdown.svg";
import UnselectedIcon from '../../../../shared/assets/icons/common/filterIcon/unselected.svg';
import SelectedIcon from '../../../../shared/assets/icons/common/filterIcon/selected.svg';
import Icon1 from '../../../../shared/assets/icons/genre/camera.svg';
import useDevice from "../../../../shared/hooks/useDevice.js";
import useDropdown from "../../../../shared/hooks/useDropDown.js";
import { peopleOptions } from "./LocationOptionList.js";
import PropTypes from 'prop-types';

const LocationPeopleFilter = forwardRef(({ onSelect, selected: externalSelected }, ref) => {
  
  const { isMobile } = useDevice();
  
  const {
    isOpen,
    handleSelect,
    selected,
    toggleDropdown,
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
      <FilterContainer ref={filterRef} onClick={toggleDropdown}>
        <FilterTextWrapper>
          <FilterIcon src={Icon1} />
          <FilterText>{peopleOptions.find((o) => o.value === selected)?.label} 기준 가격</FilterText>
        </FilterTextWrapper>
        <DropDownIcon src={DropDownImg} $isRotated={isOpen}/>
      </FilterContainer>
      )}

   
   {isMobile ? (
      <MenuWrapper>
            {peopleOptions.map((option) => (
              <DropdownItem key={option.value} onClick={() => handleSelect(option.value)} $isSelected={selected === option.value}>
                <RadioIcon src={selected === option.value ? SelectedIcon : UnselectedIcon} alt="radio-icon" />
                <RadioLabel $isSelected={selected === option.value}>{option.label}</RadioLabel>
              </DropdownItem>
            ))}
      </MenuWrapper>
    ) : (
      <DropdownMenu ref={dropdownRef} style={{top: position.top*0.7, left: position.left*1.27}} $isVisible={isOpen}>
        <DropdownHeader>가격 기준</DropdownHeader>
        {peopleOptions.map((option) => (
          <DropdownItem key={option.value} onClick={() => handleSelect(option.value)} $isSelected={selected === option.value}>
            <RadioIcon src={selected === option.value ? SelectedIcon : UnselectedIcon} alt="radio-icon" />
            <RadioLabel $isSelected={selected === option.value}>{option.label}</RadioLabel>
          </DropdownItem>
        ))}
      </DropdownMenu>
    )}
    </Wrapper>
  );
});

export const RadioIcon = styled.img`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;
`;

export const RadioLabel = styled.div`
  font-size: 0.875em;
  font-family: ${({ $isSelected }) => ($isSelected ? "Pretendard-Bold" : "Pretendard-Medium")};
  color: ${({ $isSelected }) => ($isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)")};
`;

// PropTypes 정의 (eslint 에러 방지)
LocationPeopleFilter.propTypes = {
  onSelect: PropTypes.any.isRequired,
  selected: PropTypes.any.isRequired,
};
LocationPeopleFilter.displayName = "LocationPeopleFilter";

export default LocationPeopleFilter;