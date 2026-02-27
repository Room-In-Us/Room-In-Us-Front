import styled from 'styled-components';
import Img from '../../shared/assets/images/landing/landingImg3.png';

function CarouselItem({ number, title, description }) {
  return (
    <Card>
      <TitleWrapper>
        <Number>{number}</Number>
        <Title>{title}</Title>
      </TitleWrapper>
      <StyledImg src={Img} />
      <Desc>{description}</Desc>
    </Card>
  );
}

export default CarouselItem;

// CSS
const Card = styled.div`
  padding: 2.5em;
  border-radius: 1.25em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.875em;
  background: var(--RIU_Monochrome-10, #f9f9fb);

  @media (max-width: 768px) {
    height: 32em;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Number = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 1.25em;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 1em;
  }
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718ff2);
  font-family: 'Pretendard-Bold';
  font-size: 1.875em;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 1.5em;
  }
`;

const StyledImg = styled.img`
  width: 20.9375em;
  height: 23.125em;

  @media (max-width: 768px) {
    width: 16.3125em;
    height: 18em;
  }
`;

const Desc = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 1.125em;
  line-height: 150%;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;
