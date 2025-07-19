import styled from "styled-components";

function InfoSection({userInfo}) {
  // state 관리
  const text = userInfo ?? "";

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        그 외 설명하고 싶은 나의 취향
      </Title>

      <ContentWrapper>
        {/* 선택 영역 */}
        <StyledTextarea
          readOnly
          placeholder="선호, 기피하는 문제 유형 등 자유로운 취향 정보를 적어주세요"
          maxLength={500}
          value={text}
        />
      </ContentWrapper>
    </SectionWrapper>
  )
}

export default InfoSection;

// CSS
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 1em;
  }
`;

const Title = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5625em;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 1.25em;
  }
`;

const StyledTextarea = styled.textarea`
  border: 1px solid var(--RIU_Monochrome-60, #C4C6D1);
  padding: 1.25em;
  box-sizing: border-box;
  width: 100%;
  height: 12.5em;
  resize: none;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Regular';
  font-size: 1em;
  line-height: 1.25em;
  color: var(--RIU_Monochrome-500, #515467);
  vertical-align: top;
  outline: none;

  &::placeholder {
    color: var(--RIU_Monochrome-80, #A1A4B5);
    font-family: 'Pretendard-Medium';
    font-size: 0.875em;
    line-height: 130%;
  }

  @media (max-width: 768px) {
    padding: 1.5em;
    height: 17em;
    font-size: 0.7143em;
  }
`;
