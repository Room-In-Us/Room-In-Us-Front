import styled from 'styled-components'
import More from '../../../../shared/assets/icons/common/more.svg?react';
import { useRecoilState } from 'recoil';
import { reservationSortOption } from '../../model/reservationDataList';
import { useEffect, useRef, useState } from 'react';
import { reservationSortAtom } from '../../model/reservationAtom';

export default function ReservationDropDown() {

  const [isOpen, setIsOpen] = useState(false);
  const [, setSortOption] = useRecoilState(reservationSortAtom);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    setSortOption(option.value);
    setIsOpen(false);
  };

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
      <MoreIcon
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
      />

      {isOpen && (
        <DropDownMenu>
          {reservationSortOption.map(({value, label, icon: Icon}) => (
          <DropDownItem
            key={value}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(value);
            }}
          >
            <MenuIcon>
              <Icon />
            </MenuIcon>
            <DropDownText>{label}</DropDownText>
          </DropDownItem>
          ))}
        </DropDownMenu>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

const MoreIcon = styled(More)`
  display: flex;
  width: 1.3125em;
  height: 1.3125em;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  color: #717486;

  @media (max-width: 768px) {
    width: 1em;
    height: 1em;
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

  @media (max-width: 768px) {
    width: 9.375em;
    height: 2.25em;
  }
`;

const DropDownText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 0.875em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const MenuIcon = styled.div`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 0.875em;
    height: 0.875em;
  }
`;