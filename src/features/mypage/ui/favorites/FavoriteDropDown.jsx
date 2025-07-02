import styled from 'styled-components'
import DropDownIcon from '../../../../shared/assets/icons/common/dropdown.svg?react';

export default function FavoriteDropDown() {
  return (
    <Wrapper>
      <DropDownWrapper>
        <SortText>2인 기준 가격</SortText>
        <DropDown />
      </DropDownWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
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