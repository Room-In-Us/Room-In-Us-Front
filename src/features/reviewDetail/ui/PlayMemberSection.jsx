import styled from "styled-components"
import InfoIcon from "../../../shared/assets/icons/reviewDetail/infoIcon.svg?react";
import { proficiencyConversion } from "../../../shared/utils/dataUtils";

function PlayMemberSection() {
  const participantList = [
    {
      proficiency: "BEGINNER",
      remark: "이 사람은 특이합니다",
    },
    {
      proficiency: "BEGINNER",
      remark: "이 사람은 특이합니다",
    },
    {
      proficiency: "BEGINNER",
      remark: "이 사람은 특이합니다",
    },
  ]
  
  return (
    <SectionWrapper>
      <TitleInfoWrapper>
        <SectionTitle>
          플레이 인원
        </SectionTitle>
        <StyledInfoIcon/>
      </TitleInfoWrapper>
      <Divider/>
      {participantList.map((member, index) => (
        <ListWrapper key={index}>
          <NumberTag>
            <TagText>P{index+1}</TagText>
          </NumberTag>
          <MemberInfoWrapper>
            <ProficiencyText>
              {proficiencyConversion(member.proficiency)}
            </ProficiencyText>
            <Dot>・</Dot>
            <Remark>{member.remark}</Remark>
          </MemberInfoWrapper>
          {index === 0 && (
            <WriterTag>
              <WriterText>글쓴이</WriterText>
            </WriterTag>
          )}
        </ListWrapper>
      ))}
    </SectionWrapper>
  )
}

export default PlayMemberSection;

// CSS
const SectionWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;
`;

const Divider = styled.hr`
  border: none;
  margin: 0;
  width: 41.25rem;
  height: 0.0625rem;
  background: #C4C6D1;
`;

const TitleInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const StyledInfoIcon = styled(InfoIcon)`
  width: 1.25rem;
  height: 1.25rem;
`;

const ListWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
`;

const NumberTag = styled.div`
  border-radius: 0.25rem;
  padding: 0.1875rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  background: var(--RIU_Primary-100, #718FF2);
`;

const TagText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 130%;
`;

const MemberInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ProficiencyText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 130%;
`;

const Dot = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875rem;
  line-height: 130%;
`;

const Remark = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 130%;
`;

const WriterTag = styled.div`
  border: 1px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

const WriterText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 150%;
`;