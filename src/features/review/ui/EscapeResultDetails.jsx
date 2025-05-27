import { useState } from 'react';
import styled from "styled-components";
import DropDown from "../../../shared/assets/icons/common/dropdown.svg?react";
import ReviewDropdown from "./ReviewDropdown";
import { failOptions } from "../modal/reviewDataList";
import EscapeTimePicker from './EscapeTimePicker';
import { ToggleCheckbox } from './ToggleCheckBox';

export default function EscapeResultDetails ({selected}) {
  
  const [selectedReason, setSelectedReason] = useState("");
  const [time, setTime] = useState({ min: 12, sec: 30 });
  const [checkedTime, setCheckedTime] = useState(false);
  const [checkedEnding, setCheckedEnding] = useState(false);

    if (selected === true) {
        return (
          <Wrapper>
           <BoxSection $disabled={checkedTime}>
            <EscapeTimePicker disabled={checkedTime} value={time} onChange={setTime} />
            <BoxText $disabled={checkedTime}>남기고 탈출</BoxText>
          </BoxSection>
          <ToggleCheckbox
            label='기억 안 남'
            checked={checkedTime}
            onToggle={()=>setCheckedTime(prev => !prev)}
          />
          </Wrapper>
        );
      } else if (selected === false) {
        return (
          <Wrapper2>
            <ReviewDropdown
              disabled={checkedEnding}
              placeholder='실패 사유 선택'
              options={failOptions}
              selected={selectedReason}
              onSelect={setSelectedReason}
              variant='fail'
            />
            <ToggleCheckbox
              label='엔딩 열람'
              checked={checkedEnding}
              onToggle={()=>setCheckedEnding(prev => !prev)}
            />
          </Wrapper2>
        );
      } else {
        return (
          <></>
        );
      }
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Wrapper2 = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625em;
`;

const BoxSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  pointer-events: ${({ $disabled }) => $disabled ? 'none' : 'auto'};
`;

const BoxText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ $disabled }) => 
    $disabled ? 'var(--RIU_Monochrome-50, #D6D6DF)' : 
    'var(--RIU_Monochrome-100, #818496)'};
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;