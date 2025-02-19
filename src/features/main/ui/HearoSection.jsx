import styled from "styled-components";
import TextLogo from '../../../shared/assets/icons/main/textLogo.svg?react';
import SearchInput from "../../../shared/components/SearchInput";
import LocationIcon from '../../../shared/assets/icons/main/locationIcon.svg?react';
import LevelIcon from '../../../shared/assets/icons/main/levelIcon.svg?react';
import GenreIcon from '../../../shared/assets/icons/main/genreIcon.svg?react';
import { useNavigate } from "react-router-dom";
import NoiseFilter from '../../../shared/assets/icons/main/noiseFilter.svg';

function HearoSection() {
  const navigate = useNavigate();

  return (
    <>
    <HearoWrapper>
      {/* 로고 영역 */}
      <StyledTextLogo/>

      <SearchWrapper>
        {/* 검색창 */}
        <SearchInput type='main'/>

        <ButtonWrapper>
          {/* 지역 버튼 */}
          <StyledButton onClick={() => navigate('/location')}>
            <ButtonTop>
              <StyledLocationIcon/>
            </ButtonTop>
            <ButtonBottom>
              지역별로<br />모아보기
            </ButtonBottom>
          </StyledButton>

          {/* 숙련도 버튼 */}
          <StyledButton onClick={() => navigate('/level')}>
            <ButtonTop>
              <StyledLevelIcon/>
            </ButtonTop>
            <ButtonBottom>
              숙련도별로<br />모아보기
            </ButtonBottom>
          </StyledButton>

          {/* 장르 버튼 */}
          <StyledButton onClick={() => navigate('/genre')}>
            <ButtonTop>
              <StyledGenreIcon/>
            </ButtonTop>
            <ButtonBottom>
              장르별로<br />모아보기
            </ButtonBottom>
          </StyledButton>
        </ButtonWrapper>
      </SearchWrapper>
    </HearoWrapper>
    </>
  )
}

export default HearoSection;

// CSS
const HearoWrapper = styled.div`
  width: 100vw;
  height: 31.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  gap: 5.625rem;
  overflow: hidden;
  z-index: 5;
  position: relative;
  
  background-color:hsla(231,100%,89%,1);
  background-image:
    radial-gradient(at 0% 49%, hsla(212,19%,78%,1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(216,38%,77%,1) 0px, transparent 50%),
    radial-gradient(at 51% 100%, hsla(228,28%,65%,1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(232,33%,55%,1) 0px, transparent 50%),
    radial-gradient(at 100% 44%, hsla(239,57%,59%,1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(235,68%,66%,1) 0px, transparent 50%),
    radial-gradient(at 52% 0%, hsla(228,60%,81%,1) 0px, transparent 50%),
    radial-gradient(at 0% 0%, hsla(213,20%,80%,1) 0px, transparent 50%);

  &::after {
    content: "";
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
`;

const StyledTextLogo = styled(TextLogo)`
  width: 26.25rem;
  flex-shrink: 0;
  z-index: 100;
`;

const SearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.875rem;
  z-index: 100;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1.875rem;
`;

const ButtonTop = styled.div`
  border-radius: 0.46875rem 0.46875rem 0 0;
  width: 100%;
  height: 4.375rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #F9F9FB;
  transition: background 0.3s ease-in-out;
`;

const StyledButton = styled.div`
  width: 7.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  
  &:hover ${ButtonTop} {
    background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
    transition: background 0.3s ease-in-out;
  }
  &:hover svg {
    fill: #F9F9FB;
  }
`;

const ButtonBottom = styled.div`
  border-radius: 0 0 0.46875rem 0.46875rem;
  width: 100%;
  height: 3.125rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1B1C5C;
  color: #F9F9FB;
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 130%;
`;

const StyledLocationIcon = styled(LocationIcon)`
  width: 2.34375rem;
`;
const StyledLevelIcon = styled(LevelIcon)`
  width: 2.34375rem;
`;
const StyledGenreIcon = styled(GenreIcon)`
  width: 2.34375rem;
`;
