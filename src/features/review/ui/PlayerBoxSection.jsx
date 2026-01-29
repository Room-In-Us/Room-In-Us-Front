import styled from "styled-components";
import ReviewDropdown from "./ReviewDropdown.jsx";
import Trash from "../../../shared/assets/icons/reviewWrite/trashicon.svg";
import { skillOptions } from '../modal/reviewDataList.js';

export default function PlayerBoxSection({
  skill,
  note,
  isOwner,
  onSkillChange,
  onNoteChange,
  onRemove,
}) {
  return (
    <BoxSection>
      <ReviewDropdown
        placeholder="숙련도 선택"
        options={skillOptions}
        selected={skill}
        onSelect={onSkillChange}
        variant="skill"
      />
      <Box2>
        <Box2Input
          placeholder="특이 사항 입력 (선택)"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </Box2>
      {isOwner ? (
        <SubText>(본인)</SubText>
      ) : (
        <TrashIcon src={Trash} onClick={onRemove} />
      )}
    </BoxSection>
  );
}


const BoxSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Box2 = styled.div`
  display: flex;
  width: 13.5em;
  height: 2.25em;
  padding: 0.625em 0.875em;
  align-items: center;
  justify-content: center;
  border-radius: 0.3125em;
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  box-sizing: border-box;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    flex: 1;
    height: 1.875em;
  }
`;

const Box2Input = styled.input`
  width: 100%;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: Pretendard-Medium;
  font-size: 0.75em;
  outline: none;
  background: none;
  border: none;
  box-shadow: none;

  &::placeholder {
    color: var(--RIU_Monochrome-100, #818496);
    font-family: Pretendard-Medium;
  }

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const SubText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--RIU_Monochrome-100, #818496);
  font-family: Pretendard-Bold;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const TrashIcon = styled.img`
  width: 1.875em;
  height: 1.875em;
  box-sizing: border-box;
  cursor: pointer;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 1.625em;
    height: 1.625em;
  }
`;