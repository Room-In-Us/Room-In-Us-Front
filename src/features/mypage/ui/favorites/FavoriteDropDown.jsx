import styled from 'styled-components'
import DropDownIcon from '../../../../shared/assets/icons/common/arrow/downArrow.svg?react';
import { 
  DropdownMenu, 
  DropdownHeader} from "../../../../shared/styles/FilterStyles";
import UnselectedIcon from '../../../../shared/assets/icons/common/filterIcon/unselected.svg';
import SelectedIcon from '../../../../shared/assets/icons/common/filterIcon/selected.svg';
import { peopleOptions } from '../../../../shared/components/filter/OptionList';
import { useRecoilState } from 'recoil';
import { headCountState } from '../../model/favoriteAtom';
import useDropdown from '../../../../shared/hooks/useDropDown';

export default function FavoriteDropDown() {

  const [headCount, setHeadCount] = useRecoilState(headCountState);

  const {
    isOpen,
    toggleDropdown,
    position,
    triggerRef,
    dropdownRef,
  } = useDropdown({
    defaultValue: headCount,
    onSelect: setHeadCount,
    initialWidth: 190,
  });

  return (
    <Wrapper>
      <DropDownWrapper ref={triggerRef} onClick={toggleDropdown}>
        <SortText>{headCount}인 기준 가격</SortText>
        <DropDown $isRotated={isOpen} />
      </DropDownWrapper>

      <DropdownMenu ref={dropdownRef} $top={position.top} $left={position.left} $isVisible={isOpen}>
        <DropdownHeader>가격 기준</DropdownHeader>
        {peopleOptions.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => {
              setHeadCount(option.value);
              toggleDropdown();
            }}
            $isSelected={headCount === option.value}
          >
            <RadioIcon src={headCount === option.value ? SelectedIcon : UnselectedIcon} alt="radio-icon" />
            <RadioLabel $isSelected={headCount === option.value}>{option.label}</RadioLabel>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Wrapper>
  )
}

// CSS
const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const DropDownWrapper = styled.div`
  position: relative;
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

  transition: transform 0.3s ease;
  transform: ${({ $isRotated }) => ($isRotated ? 'rotate(180deg)' : 'rotate(0deg)')};

  path {
    fill: var(--RIU_Monochrome-200, #717486);
  }

  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

const RadioIcon = styled.img`
  display: flex;
  width: 0.9375rem;
  height: 0.9375rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

const RadioLabel = styled.div`
  font-size: 0.875rem;
  font-family: ${({ $isSelected }) => ($isSelected ? "Pretendard-Bold" : "Pretendard-Medium")};
  color: ${({ $isSelected }) => ($isSelected ? "var(--RIU_Primary-300, #5B6ACC)" : "var(--RIU_Monochrome-200, #717486)")};

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const DropdownItem = styled.div`
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

  @media (max-width: 768px) {
    border-top: none;
    border-bottom: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
    height: 1.875rem;
    font-size: 0.625rem;
    padding: 0rem 1.25rem;
    gap: 0.625rem;
  }
`;