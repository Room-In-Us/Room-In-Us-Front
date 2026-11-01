import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import DropDown from "../../../shared/assets/icons/common/arrow/downArrow.svg?react";
import Overall from "../../../shared/assets/icons/reviewWrite/overallIcon.svg";

type DropdownVariant = 'default' | 'overall' | 'fail' | 'skill';
type ReviewDropdownProps<Value extends string | boolean | null> = {
  disabled?: boolean;
  placeholder?: string;
  options: { value: Value; label: string }[];
  selected?: NoInfer<Value> | '' | null;
  onSelect: (value: Value) => void;
  variant?: DropdownVariant;
};
type VariantProps = { $variant?: DropdownVariant };
type DisabledProps = { $disabled?: boolean };

export default function ReviewDropdown<Value extends string | boolean | null>({
    disabled, 
    placeholder, 
    options, 
    selected, 
    onSelect, 
    variant = "default",
  }: ReviewDropdownProps<Value>) {
  
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: Value) => {
    onSelect(value); 
    setIsOpen(false);   
  };

  const selectedLabel = options.find(opt => opt.value === selected)?.label || placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // document의 mousedown 대상은 DOM Node 또는 null이다.
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node | null)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <DropdownWrapper ref={wrapperRef} $variant={variant}>
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
          <DropdownItem key={String(option.value)} onClick={() => handleSelect(option.value)}>
            {option.label}
          </DropdownItem>
        ))}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
}

const DropdownWrapper = styled.div<VariantProps>`
  position: relative;
  ${({ $variant }) => $variant === 'fail' && `
    flex: 1 0 0;
  `}
`;

const Box = styled.div<VariantProps & DisabledProps>`
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

const BoxText = styled.div<DisabledProps>`
  font-family: Pretendard-Medium;
  font-size: 0.75em;
  color: ${({ $disabled }) => $disabled ? 'var(--RIU_Monochrome-50, #D6D6DF)' : 'var(--RIU_Monochrome-100, #818496)'};

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const DropdownMenu = styled.div<VariantProps>`
  position: absolute;
  top: 2.75em;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  border-radius: 0.25em;
  z-index: 10;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    top: 2.25em;
  }
`;

const DropdownItem = styled.div`
  padding: 0.5em;
  font-size: 0.75em;
  cursor: pointer;
  &:hover {
    background-color: var(--RIU_Primary-10, #F0F2FF);
  }

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
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
