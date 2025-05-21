import { useState } from "react";
import styled from "styled-components";
import DropDown from "../../../shared/assets/icons/common/dropdown.svg?react";
import Overall from "../../../shared/assets/icons/reviewWrite/overallIcon.svg";

export default function ReviewDropdown({ 
    disabled, 
    placeholder, 
    options, 
    selected, 
    onSelect, 
    variant = "default",
  }) {
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value) => {
    onSelect(value); 
    setIsOpen(false);   
  };

  const selectedLabel = options.find(opt => opt.value === selected)?.label || placeholder;

  return (
    <DropdownWrapper $variant={variant}>
      <Box $disabled={disabled} $variant={variant} onClick={toggleDropdown}>
        {variant === 'overall' ? (
          <Wrap4>
            <OverallIcon src={Overall} />
            <BoxText>{selectedLabel}</BoxText>
          </Wrap4>
        ) : (
          <BoxText $disabled={disabled}>{selectedLabel}</BoxText>
        )}
        <DropDownIcon />
      </Box>
      {isOpen && (
        <DropdownMenu $variant={variant}>
        {options.map((option) => (
          <DropdownItem key={option.value} onClick={() => handleSelect(option.value)}>
            {option.label}
          </DropdownItem>
        ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
}

const DropdownWrapper = styled.div`
  position: relative;
  ${({ $variant }) => $variant === 'fail' && `
    flex: 1 0 0;
  `}
`;

const Box = styled.div`
  display: flex;
  width: ${({ $variant }) =>
    $variant === 'fail' ? '' :
    $variant === 'overall' ? '100%' : '7.5em'};
  height: ${({ $variant }) => 
    $variant === 'fail' ? '' : 
    $variant === 'overall' ? '2.5em' : '2.25em'};
  padding: 0.625em 0.875em;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;
  cursor: pointer;
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: ${({ $variant }) =>
      $variant === 'fail' ? '' :
      $variant === 'overall' ? '100%' : '6.21875em'};
    height: 1.875em;
  }
`;

const BoxText = styled.div`
  font-family: Pretendard-Medium;
  font-size: 0.75em;
  color: ${({ $disabled }) => $disabled ? 'var(--RIU_Monochrome-50, #D6D6DF)' : 'var(--RIU_Monochrome-100, #818496)'};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 2.75em;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 0.25em;
  z-index: 10;
`;

const DropdownItem = styled.div`
  padding: 0.5em;
  font-size: 0.75em;
  cursor: pointer;
  &:hover {
    background-color: var(--RIU_Primary-10, #F0F2FF);
  }
`;

const DropDownIcon = styled(DropDown)`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  path {
    fill: var(--RIU_Monochrome-60, #C4C6D1);
  }

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

const Wrap4 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
`;

const OverallIcon = styled.img`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;
`;