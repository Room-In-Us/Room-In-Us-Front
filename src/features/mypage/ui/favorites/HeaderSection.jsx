import styled from 'styled-components'

export default function HeaderSection() {
  return (
    <Wrapper>
      <Title>내가 찜한 방탈출</Title>
      <SubText>방탈출 예약을 쉽고 편리하게 도와주는 루미너스입니다 {':)'}</SubText>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.625em;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: Pretendard-Bold;
  font-size: 1.5em;
  
  @media (max-width: 768px) {
    font-size: 1.125em;
  }
`;

const SubText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: Pretendard-Medium;
  font-size: 1em;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;