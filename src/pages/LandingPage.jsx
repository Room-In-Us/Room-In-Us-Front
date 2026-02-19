import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoIcon from '../shared/assets/icons/common/logo.svg?react';
import TextLogo from '../shared/assets/icons/landing/landingTextLogo.svg?react';
import NoiseFilter from '../shared/assets/icons/login/loginNoiseFilter.svg';

function LandingPage() {
  const [darkOpacity, setDarkOpacity] = useState(0);
  const [heroScale, setHeroScale] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const max = 300;
      const y = window.scrollY;
      const t = Math.min(1, Math.max(0, y / max)); // 0~1

      setDarkOpacity(t * 0.3); // 어두워지는 정도

      const minScale = 0.9; // 히어로 영역 축소 비율
      setHeroScale(1 - (1 - minScale) * t);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Root>
      {/* 히어로 영역 */}
      <HeroFixed $darkOpacity={darkOpacity}>
        <HeroContentLayer $scale={heroScale}>
          <LogoWrapper>
            <StyledLogoIcon />
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
        </HeroContentLayer>
      </HeroFixed>

      {/* 스크롤로 올라오는 콘텐츠 */}
      <ScrollLayer>
        <Section></Section>

        <Section>
          <h2>섹션 2</h2>
          <p>이후부터는 일반 스크롤처럼 쭉 이어지게 됩니다.</p>
        </Section>

        <Section>
          <h2>섹션 3</h2>
          <p>원하시는 만큼 섹션을 추가하시면 됩니다.</p>
        </Section>
      </ScrollLayer>
    </Root>
  );
}

export default LandingPage;

/* -------------------- Layout -------------------- */

const Root = styled.div`
  width: 100%;
`;

/** 첫 화면: fixed로 깔아두는 히어로 */
const HeroFixed = styled.div`
  font-size: 0.75rem;
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;

  position: fixed;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5em;

  z-index: 0;

  background-color: hsla(231, 100%, 89%, 1);
  background-image: radial-gradient(at 0% 49%, hsla(212, 19%, 78%, 1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(216, 38%, 77%, 1) 0px, transparent 50%),
    radial-gradient(at 51% 100%, hsla(228, 28%, 65%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(232, 33%, 55%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 44%, hsla(239, 57%, 59%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(235, 68%, 66%, 1) 0px, transparent 50%),
    radial-gradient(at 52% 0%, hsla(228, 60%, 81%, 1) 0px, transparent 50%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #000;
    opacity: ${({ $darkOpacity }) => $darkOpacity ?? 0};
    transition: opacity 80ms linear;
    pointer-events: none;
    z-index: 3;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${NoiseFilter});
    background-repeat: repeat;
    background-size: cover;
    opacity: 0.5;
    pointer-events: none;
    z-index: 1;
  }
`;

const HeroContentLayer = styled.div`
  position: relative;
  z-index: 2;

  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5em;

  transform: scale(${({ $scale }) => $scale ?? 1});
  transform-origin: center;

  transition: transform 80ms linear;
`;

const ScrollLayer = styled.div`
  padding-top: 90vh;
  position: relative;
  z-index: 1;
  pointer-events: none;
`;

const Section = styled.section`
  background: #ffffff;
  min-height: 80vh;
  padding: 32px 20px;

  /* 히어로 위로 올라오는 “카드” 느낌 */
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;

  /* 섹션이 이어질 때 각 섹션 사이 간격 */
  & + & {
    margin-top: 16px;
    border-radius: 24px;
  }

  pointer-events: auto;
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
