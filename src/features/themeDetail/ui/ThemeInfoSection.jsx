import styled from "styled-components";

function ThemeInfoSection() {
  return (
    <ComponentWrapper>
      {/* 테마 정보 요약 */}
      <SectionWrapper>
        <SectionTitle>
          테마 정보 요약
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 테마 스토리 */}
      <SectionWrapper>
        <SectionTitle>
          테마 스토리
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 테마 후기 */}
      <SectionWrapper>
        <SectionTitle>
          테마 후기
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 인당 가격 안내 */}
      <SectionWrapper>
        <SectionTitle>
          인당 가격 안내
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 매장 정보 */}
      <SectionWrapper>
        <SectionTitle>
          매장 정보
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>
    </ComponentWrapper>
  )
}

export default ThemeInfoSection;

// CSS
const ComponentWrapper = styled.div`
  width: 43.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;
`;

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