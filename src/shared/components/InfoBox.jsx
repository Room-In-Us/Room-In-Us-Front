import styled from 'styled-components'

export default function InfoBox() {
  return (
    <Wrapper>
      <InfoTitle>루미너스 숙련도 방 수 기준</InfoTitle>
      <InfoDetail>
        <InfoTextWrapper><Dot>•</Dot> <InfoText>방세포: 0~5방</InfoText></InfoTextWrapper>
        <InfoTextWrapper><Dot>•</Dot> <InfoText>방초보: 5~20방</InfoText></InfoTextWrapper>
        <InfoTextWrapper><Dot>•</Dot> <InfoText>방중수: 20~50방</InfoText></InfoTextWrapper>
        <InfoTextWrapper><Dot>•</Dot> <InfoText>방고수: 50+방</InfoText></InfoTextWrapper>
      </InfoDetail>
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
  z-index: 1000;

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
  display: flex;
  flex-direction: column;
`;

const InfoTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25em;
`;

const InfoText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 0.75em;

  @media (max-width: 1024px) {
  }
  @media (max-width: 768px) {
    font-size: 0.625em;
  }
`;

const Dot = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8DA3FF;
`;