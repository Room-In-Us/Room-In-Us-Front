import styled from "styled-components";
import ReviewDropdown from "./ReviewDropdown";
import { failOptions } from "../modal/reviewDataList";
import EscapeTimePicker from './EscapeTimePicker';
import { ToggleCheckbox } from './ToggleCheckBox';
import { useRecoilState } from 'recoil';
import { reviewStateFamily } from '../../themeDetail/model/reviewAtom';

export default function EscapeResultDetails ({selected, themeId}) {

  // 상태 관리
  const [review, setReview] = useRecoilState(reviewStateFamily(themeId));
  
  const time = review.remainingTime
    ? {
      min: parseInt(review.remainingTime.split(":")[1]),
      sec: parseInt(review.remainingTime.split(":")[2]),
      }
    : {min: 0, sec: 0};
  
  const checkedTime = review.remainingTime === null;
  // 엔딩 열람 체크박스: hasViewedEnding이 true일 때 체크됨 (failReason과 독립적)
  const checkedEnding = review.hasViewedEnding === true;

  const handleTimeChange = (newTime) => {
    const formattedTime = `00:${String(newTime.min).padStart(2, "0")}:${String(newTime.sec).padStart(2, "0")}`;
    setReview(prev => ({ ...prev, remainingTime: formattedTime }));
  };

  // 기억 안 남 토글 핸들러 (성공 시)
  const toggleCheckedTime = () => {
    const next = !checkedTime;
    setReview(prev => ({
      ...prev,
      remainingTime: next ? null : "00:00:00",
    }));
  };

  const handleReasonChange = (value) => {
    setReview(prev => ({ ...prev, failReason: value }));
  };

  // 엔딩 열람 토글 핸들러 (실패 시) - failReason과 독립적으로 동작
  const toggleCheckedEnding = () => {
    const next = !checkedEnding;
    setReview(prev => ({
      ...prev,
      hasViewedEnding: next ? true : false,
    }));
  };

  if (selected === true) {
    return (
      <Wrapper>
        <BoxSection $disabled={checkedTime}>
          <EscapeTimePicker disabled={checkedTime} value={time} onChange={handleTimeChange} />
          <BoxText $disabled={checkedTime}>남기고 탈출</BoxText>
        </BoxSection>
        <ToggleCheckbox
          label='기억 안 남'
          checked={checkedTime}
          onToggle={toggleCheckedTime}
        />
        </Wrapper>
      );
    } else if (selected === false) {
      return (
      <Wrapper2>
        <ReviewDropdown
          placeholder='실패 사유 선택'
          options={failOptions}
          selected={review.failReason}
          onSelect={handleReasonChange}
          variant='fail'
        />
        <ToggleCheckbox
          label='엔딩 열람'
          checked={checkedEnding}
          onToggle={toggleCheckedEnding}
        />
      </Wrapper2>
    );
  } else {
    return null;
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