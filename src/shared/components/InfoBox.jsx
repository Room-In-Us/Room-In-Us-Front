import styled from 'styled-components'

export default function InfoBox() {
  return (
    <Wrapper>
      <InfoTitle>메인 텍스트</InfoTitle>
      <InfoDetail>내용</InfoDetail>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  width: 11.875em;
  padding: 1em;
  flex-direction: column;
  gap: 0.625em;
  background: var(--RIU_Monochrome-20, #F0F0F4);

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    width: 8.75em;
    padding: 0.75em;
  }
`;

const InfoTitle = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Bold;
  font-size: 0.875em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const InfoDetail = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;