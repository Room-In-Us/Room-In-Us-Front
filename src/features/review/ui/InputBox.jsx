import styled from 'styled-components';
import StarRating from './StarRating.jsx';
import { clothOptions } from '../modal/reviewDataList.js';
import UnselectedIcon from '../../../shared/assets/icons/common/filterIcon/unselected.svg';
import SelectedIcon from '../../../shared/assets/icons/common/filterIcon/selected.svg';

export default function InputBox({ rateValue, rateOnChange, label, placeholder, value, onChange, active, selected, handleSelect }) {
  return (
    <ItemSection>
      <Wrap4>       
        <ItemText>{label}</ItemText>
        <Asterisk2>*</Asterisk2>
      </Wrap4>
      <StarRating
        value={rateValue}
        onChange={rateOnChange}
      />
      <InputWrapper>
        <ThoughtInput placeholder={placeholder} value={value} onChange={onChange} />
        <CharCount>
          <CountText>{value.length} / 200</CountText>
        </CharCount>
      </InputWrapper>
      
      {active && (
        <Container2>
        {clothOptions.map((option) => (
          <DropdownItem key={option.value} onClick={() => handleSelect(option.value)} $isSelected={selected === option.value}>
            <RadioIcon src={selected === option.value ? SelectedIcon : UnselectedIcon} alt="radio-icon" />
            <RadioLabel $isSelected={selected === option.value}>{option.label}</RadioLabel>
          </DropdownItem>
        ))}
        </Container2>
      )}
    </ItemSection>
  );
}

const ItemSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;

const ItemText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 7.5em;
`;

const ThoughtInput = styled.textarea`
  padding: 0.625em 0.875em;
  width: 100%;
  height: 100%;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;
  resize: none;
  outline: none;
  font-size: 0.75em;
  font-family: Pretendard-Medium;
  background: none;
  color: var(--RIU_Monochrome-500, #515467);

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const CharCount = styled.div`
  position: absolute;
  bottom: 0.625em;
  right: 0.875em;
`;

const CountText = styled.div`
  font-size: 0.625em;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Regular;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.5em;
  }
`;

const DropdownItem = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
`;

export const RadioIcon = styled.img`
  display: flex;
  width: 0.9375em;
  height: 0.9375em;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

export const RadioLabel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Container2 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const Wrap4 = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
`;

const Asterisk2 = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;