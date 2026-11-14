import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SignupIllust from '../../../shared/assets/images/auth/signupIllust.png';

function CompleteSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      <ContentWrapper>
        <PageNumber>Hi! 👋</PageNumber>
        <TextWrapper>
          <Title>회원가입이 완료되었습니다</Title>
          <Description>루미너스에 가입해주셔서 감사합니다!</Description>
        </TextWrapper>
        <ImageWrapper>
          <StyledImg src={SignupIllust} />
          <ImageText>
            간단한 조사를 통해 방탈출 성향을 등록해주시면 <br />
            루미너스가 좋은 서비스로 보답할게요!
          </ImageText>
        </ImageWrapper>
      </ContentWrapper>

      <ButtonWrapper>
        <StyledButton onClick={() => navigate('/survey')}>
          <ButtonText>성향조사 하기</ButtonText>
        </StyledButton>
        <PassButton onClick={() => navigate('/home')}>다음에 할게요</PassButton>
      </ButtonWrapper>
    </SectionWrapper>
  );
}

export default CompleteSection;

// CSS
const SectionWrapper = styled.div`
  border-radius: 1.875em;
  padding: 1.875em 2.5em;
  box-sizing: border-box;
  width: 32.5em;
  height: 50em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  background-color: #fff;
  z-index: 1;

  @media (max-width: 768px) {
    border-radius: 0.9375em;
    padding: 1.25em;
    width: 20.9375em;
    height: 40.625em;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5625em;
`;

const PageNumber = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Bold';
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625em;
`;

const Title = styled.div`
  color: var(--RIU_Primary-100, #718ff2);
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: 130%;
`;

const Description = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5em;

  @media (max-width: 768px) {
    gap: 1.5625em;
  }
`;

const StyledImg = styled.img`
  width: 18.75em;

  @media (max-width: 768px) {
    width: 12.5em;
  }
`;

const ImageText = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 160%;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25em;

  @media (max-width: 768px) {
    gap: 0.875em;
  }
`;

const StyledButton = styled.button`
  all: unset;
  border: none;
  display: flex;
  height: 3.125em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  align-self: stretch;
  border-radius: 2.5em;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5b6acc 0%, #718ff2 100%));
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(19, 26, 115, 0.5);
    opacity: 0;
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    opacity: 0.5;
  }

  @media (max-width: 768px) {
    height: 2.5em;
  }
`;

const ButtonText = styled.div`
  color: #fff;
  font-family: 'Pretendard-Bold';
  line-height: 130%;
  z-index: 1;
  transition: all 0.2s ease-in-out;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;

const PassButton = styled.div`
  color: var(--RIU_Monochrome-200, #717486);
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.75em;
  }
`;
