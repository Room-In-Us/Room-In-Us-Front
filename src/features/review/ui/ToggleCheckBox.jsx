import styled from "styled-components";
import SelectedCheckbox from '../../../shared/assets/icons/reviewWrite/selectedcheckbox.svg';
import CheckBox from "../../../shared/assets/icons/reviewWrite/checkbox.svg";

export function ToggleCheckbox({ label, checked, onToggle, icon, special }) {
  return (
    <CheckboxWrapper $special={special} onClick={onToggle}>
      <CheckBoxIcon src={checked ? SelectedCheckbox : CheckBox} />
      {icon && <SignificantIcon src={icon} />}
      <CheckboxText>{label}</CheckboxText>
    </CheckboxWrapper>
  );
}

const CheckboxWrapper = styled.label`
  display: flex;
  flex-direction: ${({ $special }) => ($special ? 'column' : 'row')};
  align-items: center;
  justify-content: center;
  gap: ${({ $special }) => ($special ? '0.3125em;' : '0.25em')};
  width: ${({ $special }) => ($special ? '4.3125em' : 'auto')};
`;

const CheckBoxIcon = styled.img`
  width: 0.9375em;
  height: 0.9375em;
  cursor: pointer;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 0.625em;
    height: 0.625em;
  }
`;

const CheckboxText = styled.div`
  color: var(--RIU_Monochrome-300, #696C7E);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const SignificantIcon = styled.img`
  display: flex;
  width: 1.875em;
  height: 1.875em;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 1.25em;
    height: 1.25em;
  }
`;