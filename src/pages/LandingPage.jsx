import styled from 'styled-components';
import NoiseFilter from '../shared/assets/icons/login/loginNoiseFilter.svg';
import TextLogo from '../shared/assets/icons/landing/landingTextLogo.svg?react';
import LogoIcon from '../shared/assets/icons/common/logo.svg?react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  // 네비게이션
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <LogoWrapper>
        <StyledLogoIcon onClick={() => navigate('/')} />
      </LogoWrapper>
      <DescriptionWrapper>
        <Text>방탈출,</Text>
        <Text>추천부터 일정관리까지</Text>
        <TextRowWrapper>
          <StyledTextLogo />
          <Text>로 한 번에!</Text>
        </TextRowWrapper>
      </DescriptionWrapper>
      <Button onClick={() => navigate('/')}>
        <ButtonText>바로 시작하기</ButtonText>
      </Button>
    </PageWrapper>
  );
}

export default LandingPage;

const PageWrapper = styled.div`
  font-size: 0.75rem;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5em;
  position: relative;
  z-index: 0;

  background-color: hsla(231, 100%, 89%, 1);
  background-image: radial-gradient(at 0% 49%, hsla(212, 19%, 78%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(216, 38%, 77%, 1) 0px, transparent 50%),
    radial-gradient(at 51% 100%, hsla(228, 28%, 65%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(232, 33%, 55%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 44%, hsla(239, 57%, 59%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(235, 68%, 66%, 1) 0px, transparent 50%),
    radial-gradient(at 52% 0%, hsla(228, 60%, 81%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(213, 20%, 80%, 1) 0px, transparent 50%);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${NoiseFilter});
    background-repeat: repeat;
    background-size: cover;
    opacity: 0.5;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    height: 100vh;
  }
`;

const LogoWrapper = styled.div`
  border-radius: 1.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7.5em;
  height: 7.5em;
  background-color: var(--RIU_Monochrome-10, #f9f9fb);
  z-index: 1;
`;

const StyledLogoIcon = styled(LogoIcon)`
  width: 5em;
  cursor: pointer;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  z-index: 1;
`;

const Text = styled.div`
  color: var(--RIU_Monochrome-10, #f9f9fb);
  font-family: 'Pretendard-Bold';
  font-size: 3em;
  line-height: normal;
`;

const TextRowWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.25em;
`;

const StyledTextLogo = styled(TextLogo)`
  width: 13.75em;
  height: 4.875em;

  @media (max-width: 768px) {
    height: 5.67188em;
    fill: #718ff2;
    line {
      stroke: #718ff2;
    }
  }
`;

const Button = styled.div`
  border-radius: 2.5em;
  display: flex;
  width: 18.75em;
  height: 3.5em;
  justify-content: center;
  align-items: center;
  gap: 0.625em;
  flex-shrink: 0;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5b6acc 0%, #718ff2 100%));
  cursor: pointer;
  z-index: 1;
`;

const ButtonText = styled.div`
  color: var(--RIU_Monochrome-10, #f9f9fb);
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: 1.4625em;
`;
