import styled from 'styled-components';
import Img from '../../shared/assets/images/landing/landingImg2.png';

function InfoListItem({ number, title, description }) {
  return (
    <ItemWrapper>
      <StyledImg src={Img} />
      <DescriptionWrapper>
        <Number>{number}</Number>
        <TextWrapper>
          <Title>{title}</Title>
          <Description>
            {description.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </Description>
        </TextWrapper>
      </DescriptionWrapper>
    </ItemWrapper>
  );
}

export default InfoListItem;

// CSS
const ItemWrapper = styled.div`
  border-top: 2px solid var(--RIU_Monochrome-200, #717486);
  display: flex;
  padding: 1.875em 3.125em;
  align-items: center;
  gap: 3.125em;
  align-self: stretch;

  @media (max-width: 768px) {
    padding: 1.875em 0;
    flex-direction: column;
  }
`;

const StyledImg = styled.img`
  width: 14.375em;
  height: 14.375em;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25em;

  @media (max-width: 768px) {
    gap: 0.625em;
    flex-direction: column;
  }
`;

const Number = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 2.1875em;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 1.125em;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;

  @media (max-width: 768px) {
    gap: 0.625em;
  }
`;

const Title = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 3.875em;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 1.875em;
  }
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 1.25em;
  line-height: 150%;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;
