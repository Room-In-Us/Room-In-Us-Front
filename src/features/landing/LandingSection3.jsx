import styled from 'styled-components';
import TextLogo from '../../shared/assets/icons/main/mainTextLogo.svg?react';
import SearchInput from '../../shared/components/SearchInput';
import LocationIcon from '../../shared/assets/icons/main/locationIcon.svg?react';
import LevelIcon from '../../shared/assets/icons/main/levelIcon.svg?react';
import GenreIcon from '../../shared/assets/icons/main/genreIcon.svg?react';
import { useNavigate } from 'react-router-dom';
import NoiseFilter from '../../shared/assets/icons/main/noiseFilter.svg';
import { useState } from 'react';

function LandingSection3() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('');

  const goToSearchPage = () => {
    if (!keyword) return;
    navigate('/search', { state: { keyword } });
  };

  return (
    <SectionWrapper>
      <BackgroundPiece />
      <HearoWrapper>
        {/* 로고 영역 */}
        <StyledTextLogo />
        <Text>
          지금 바로 루미너스와 함께
          <br />
          방탈출 여정을 시작하세요!
        </Text>

        <SearchWrapper>
          {/* 검색창 */}
          <InputWrapper>
            <SearchInput type="main" keyword={keyword} setKeyword={setKeyword} onSearch={goToSearchPage} />
          </InputWrapper>

          <ButtonWrapper>
            {/* 지역 버튼 */}
            <StyledButton onClick={() => navigate('/location')}>
              <ButtonTop>
                <StyledLocationIcon />
              </ButtonTop>
              <ButtonBottom>
                <ButtonText>
                  지역별로
                  <br />
                  모아보기
                </ButtonText>
              </ButtonBottom>
            </StyledButton>

            {/* 숙련도 버튼 */}
            <StyledButton onClick={() => navigate('/level')}>
              <ButtonTop>
                <StyledLevelIcon />
              </ButtonTop>
              <ButtonBottom>
                <ButtonText>
                  숙련도별로
                  <br />
                  모아보기
                </ButtonText>
              </ButtonBottom>
            </StyledButton>

            {/* 장르 버튼 */}
            <StyledButton onClick={() => navigate('/genre')}>
              <ButtonTop>
                <StyledGenreIcon />
              </ButtonTop>
              <ButtonBottom>
                <ButtonText>
                  장르별로
                  <br />
                  모아보기
                </ButtonText>
              </ButtonBottom>
            </StyledButton>
          </ButtonWrapper>
        </SearchWrapper>

        <BottomButtonWrapper>
          <BottomButton type="primary" onClick={() => navigate('/home')}>
            <BottomButtonText type="primary">바로 시작하기</BottomButtonText>
          </BottomButton>
          <BottomButton type="secondary" onClick={() => window.open('mailto:roominus.official@gmail.com')}>
            <BottomButtonText type="secondary">비즈니스 컨택</BottomButtonText>
          </BottomButton>
        </BottomButtonWrapper>
      </HearoWrapper>
    </SectionWrapper>
  );
}

export default LandingSection3;

// CSS
const SectionWrapper = styled.section`
  position: relative;
  pointer-events: auto;
`;
const HearoWrapper = styled.div`
  padding: 5.625em 0;
  border-radius: 3.125em 3.125em 0 0;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 2.5em;
  position: relative;
  overflow: hidden;
  z-index: 5;

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
  pointer-events: auto;

  @media (max-width: 768px) {
    padding: 3.125em 0;
    border-radius: 1.875rem 1.875rem 0 0;
    gap: 5em;
  }
`;

const BackgroundPiece = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3em;
  background: var(--RIU_Monochrome-700, #31323e);
  z-index: 0;
`;

const StyledTextLogo = styled(TextLogo)`
  height: 11em;
  flex-shrink: 0;
  z-index: 100;

  @media (max-width: 768px) {
    height: 6.15625em;
  }
`;

const Text = styled.div`
  color: var(--RIU_Monochrome-10, #f9f9fb);
  font-family: 'Pretendard-Bold';
  font-size: 3em;
  line-height: normal;
  z-index: 100;

  @media (max-width: 768px) {
    font-size: 1.75em;
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.875em;
  z-index: 100;

  @media (max-width: 768px) {
    gap: 0.9375em;
  }
`;

const InputWrapper = styled.div`
  width: 21.875em;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    width: 16.40625em;
  }
  @media (max-width: 768px) {
    div {
      width: 16.40625em;
      height: 1.96875em;
    }
    svg {
      width: 0.9375em;
    }
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875em;

  @media (max-width: 1024px) {
    gap: 1.40625em;
  }

  @media (max-width: 768px) {
    gap: 0.9375em;
  }
`;

const ButtonTop = styled.div`
  border-radius: 0.46875em 0.46875em 0 0;
  width: 100%;
  height: 4.375em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9fb;
  transition: background 0.3s ease-in-out;

  @media (max-width: 1024px) {
    height: 3.28125em;
  }

  @media (max-width: 768px) {
    height: 2.1875em;
  }
`;

const StyledButton = styled.div`
  width: 7.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &:hover ${ButtonTop} {
    background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5b6acc 0%, #718ff2 100%));
    transition: background 0.3s ease-in-out;
  }
  &:hover svg {
    fill: #f9f9fb;
  }

  @media (max-width: 1024px) {
    width: 5.625em;
  }

  @media (max-width: 768px) {
    width: 3.75em;
  }
`;

const ButtonBottom = styled.div`
  border-radius: 0 0 0.46875em 0.46875em;
  width: 100%;
  height: 3.125em;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1b1c5c;

  @media (max-width: 1024px) {
    height: 1.5625em;
  }
`;

const ButtonText = styled.div`
  color: #f9f9fb;
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875em;
  line-height: 130%;

  @media (max-width: 1024px) {
    font-size: 0.4375em;
  }
`;

const StyledLocationIcon = styled(LocationIcon)`
  width: 2.34375em;
  @media (max-width: 1024px) {
    width: 1.7578125em;
  }
  @media (max-width: 768px) {
    width: 1.17188em;
  }
`;
const StyledLevelIcon = styled(LevelIcon)`
  width: 2.34375em;
  @media (max-width: 1024px) {
    width: 1.7578125em;
  }
  @media (max-width: 768px) {
    width: 1.17188em;
  }
`;
const StyledGenreIcon = styled(GenreIcon)`
  width: 2.34375em;
  @media (max-width: 1024px) {
    width: 1.7578125em;
  }
  @media (max-width: 768px) {
    width: 1.17188em;
  }
`;

const BottomButtonWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2.5em;
  z-index: 100;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.25em;
  }
`;

const BottomButton = styled.div`
  padding: 0.875em 0;
  border-radius: 2.5em;
  display: flex;
  width: 18.75em;
  height: 3.5em;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  background: ${({ type }) =>
    type === 'primary'
      ? 'var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5b6acc 0%, #718ff2 100%))'
      : 'var(--RIU_Monochrome-10, #F9F9FB);'};
  cursor: pointer;

  @media (max-width: 768px) {
    width: 18.75em;
    height: 2.5em;
  }
`;

const BottomButtonText = styled.div`
  color: ${({ type }) => (type === 'primary' ? '#fff' : 'var(--RIU_Primary-200, #6680DF)')};
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.875em;
  }
`;
