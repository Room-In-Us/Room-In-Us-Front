import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { activeLevelState } from '../model/levelAtom.jsx';
import useDevice from "../../../shared/hooks/useDevice";
import MainIcon from '../../../shared/assets/icons/genre/movieIcon.svg';
import CircleInfoIcon from '../../../shared/assets/icons/common/circleinfo.svg';
import { levels } from '../model/levelData';
import InfoBox from '../../../shared/components/InfoBox.jsx';
// import { useLocation } from 'react-router-dom';

export default function LevelTabSection() {

  // const location = useLocation();
    
  // 반응형 함수
  const { isMobile } = useDevice();

  // state 관리
  const [activeLevel] = useRecoilState(activeLevelState);
  const setActiveLevel = useSetRecoilState(activeLevelState);

  // info 팝업 상태
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoRef = useRef(null);

  // useEffect(() => {
  //   if (location.state?.level) {
  //     setActiveLevel(location.state.level);
  //   }
  // }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (infoRef.current && !infoRef.current.contains(e.target)) {
        setIsInfoOpen(false);
      }
    }

    if (isInfoOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInfoOpen]);

  return (
    <Wrapper>
      <TopBar>
        <TopbarIcon src={MainIcon}/>
        <TextWrapper>
          <MainTextLayout>
            <MainText>숙련도 검색</MainText>
              {!isMobile && (<IconWrapper
                onMouseEnter={() => setIsInfoOpen(true)}
                onMouseLeave={() => setIsInfoOpen(false)}
              >
                <InfoIcon src={CircleInfoIcon} />
                <InfoPopup ref={infoRef} isInfoOpen={isInfoOpen}>
                  <InfoBox />
                </InfoPopup>
              </IconWrapper>)}
              {isMobile && (<IconWrapper>
                <InfoIcon src={CircleInfoIcon} onClick={() => setIsInfoOpen(prev => !prev)} />
                {isInfoOpen && (
                  <InfoPopup ref={infoRef}>
                    <InfoBox />
                  </InfoPopup>
                )}
              </IconWrapper>)}
          </MainTextLayout>
          <SubText>내 취향에 딱 맞는 방탈출, 숙련도별로 쉽게 찾아보세요</SubText>
        </TextWrapper>
      </TopBar>
      <ContentsWrapper>
        {/* 숙련도 버튼 영역 */}
        { !isMobile && levels.map(({ icon: Icon, text, level }) => (
          <LevelButton 
            key={level} 
            onClick={() => setActiveLevel(level)}
            isActive={activeLevel === level}
          >
            <StyledLevelIcon isActive={activeLevel === level}>
              <Icon />
            </StyledLevelIcon>
            <ButtonText isActive={activeLevel === level}>{text}</ButtonText>
            <ButtonLine isActive={activeLevel === level} />
          </LevelButton>
        ))}

        { isMobile && levels.map(({ icon: Icon, text, level }) => (
            <LevelButton
            key={level}
            onClick={() => setActiveLevel(level)}
            isActive={activeLevel === level}
            >
              <StyledLevelIcon isActive={activeLevel === level}>
                <Icon />
              </StyledLevelIcon>
              <ButtonText isActive={activeLevel === level}>{text}</ButtonText>
              <ButtonLine isActive={activeLevel === level} />
            </LevelButton>
            ))}

      </ContentsWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 70rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1.25rem;
  background: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 1024px) {
    width: 43.3125rem;
  }
  @media (max-width: 768px) {
    width: 20.9375rem;
  }
`;

const TopBar = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1.25rem 1.875rem;
  align-items: center;
  border-radius: 1.25rem 1.25rem 0rem 0rem;
  gap: 1.875rem;
  box-sizing: border-box;
  background: var(--RIU_Primary-Gradient-01, linear-gradient(101deg, #9FABF7 0.85%, #85BFB3 100%));

  @media (max-width: 1024px) {
    padding: 0.9375rem 1.40625rem;
    gap: 1.40625rem;
  }
  @media (max-width: 768px) {
    padding: 0.875rem;
    gap: 0.625rem;
  }
`;

const TopbarIcon = styled.img`
  display: flex;
  width: 3.75rem;
  height: 3.75rem;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    width: 2.8125rem;
    height: 2.8125rem;
  }
  @media (max-width: 768px) {
    width: 2.34375rem;
    height: 2.34375rem;
  }
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  @media (max-width: 1024px) {
    gap: 0.1875rem;
  }
  @media (max-width: 768px) {
    gap: 0.125rem;
  }
`;

const MainTextLayout = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 1024px) {
    gap: 0.5625rem;
  }
  @media (max-width: 768px) {
    // 추후에 추가
  }
`;

const MainText = styled.div`
  color: var(--RIU_Primary-600, #303281);
  font-family: Pretendard-ExtraBold;
  font-size: 1.75rem;

  @media (max-width: 1024px) {
    font-size: 1.3125rem;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const IconWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const InfoPopup = styled.div`
  visibility: ${({ isInfoOpen }) => (isInfoOpen ? 'visible' : 'hidden')};
  opacity: ${({ isInfoOpen }) => (isInfoOpen ? '1' : '0')};
  transition: all 0.2s ease-in-out;
  position: absolute;
  top: 100%;
  left: 100%;
  transform: translate(0.25em, 0.25em);
  z-index: 999;
`;

const InfoIcon = styled.img`
  display: flex;
  width: 1.40625rem;
  height: 1.40625rem;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  @media (max-width: 1024px) {
    width: 1.0546875rem;
    height: 1.0546875rem;
  }
`;

const SubText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  text-align: center;
  font-family: Pretendard-Bold;
  font-size: 1.125rem;

  @media (max-width: 1024px) {
    font-size: 0.84375rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const ContentsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 16.25rem;
  padding: 1.875rem 0rem 2.5rem 0rem;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    height: 12.1875rem;
    padding: 1.40625rem 0rem 1.875rem 0rem;
    row-gap: 0.9375rem;
  }
  @media (max-width: 768px) {
    height: auto;
    padding: 0.375rem 0.875rem 0.625rem 0.875rem;
    gap: 1.875rem;
  }
`;

const ButtonText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "var(--RIU_Monochrome-100, #818496)")};
  font-family: 'Pretendard-Bold';
  transition: color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    font-size: 0.625rem;
  }
  @media (max-width: 768px) {
    font-size: 0.625rem;
    width: 2.5rem;
  }
`;

const ButtonLine = styled.div`
  border-radius: 1.875rem;
  width: 6.625rem;
  height: 0.25rem;
  background-color: ${props => (props.isActive ? "var(--RIU_Primary-100, #718FF2)" : "#D6D6DF")};
  transition: background-color 0.1s ease-in-out;

  @media (max-width: 1024px) {
    width: 2.8125rem;
  }
  @media (max-width: 768px) {
    width: 2.5rem;
  }
`;

const StyledLevelIcon = styled.div`
  display: flex;
  width: 3.375rem;
  height: 3.375rem;
  justify-content: center;
  align-items: center;
  transition: all 0.1s ease-in-out;
  gap: 0.5rem;
  color: ${(props) => (props.isActive ? "#718FF2" : "#818496")};

  svg {
    width: 100%;
    height: 100%;
    max-width: 3.375rem;
    max-height: 3.375rem;
  }

  path {
    fill: currentColor;
    object-fit: cover;
  }

  @media (max-width: 1024px) {
    width: 2.53125rem;
    height: 2.53125rem;
  }
  @media (max-width: 768px) {
    width: 1.40625rem;
    height: 1.40625rem;
  }
`;

const LevelButton = styled.div`
  display: flex;
  width: 8.125rem;
  height: 6.25rem;
  padding: 0rem 0.9375rem;
  margin: 0rem 0.9375rem;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;

  ${props => props.isActive && `
    ${ButtonText} {
      color: var(--RIU_Primary-100, #718FF2);
    }
    ${ButtonLine} {
      background-color: var(--RIU_Primary-100, #718FF2);
    }
  `}

  &:hover ${ButtonLine} {
    background-color: var(--RIU_Primary-100, #718FF2);
  }

  &:hover ${ButtonText}, &:hover svg {
    color: var(--RIU_Primary-100, #718FF2);
    fill: var(--RIU_Primary-100, #718FF2);
  }

  @media (max-width: 1024px) {
    width: 5.625rem;
    height: 4.6875rem;
    padding: 0rem 1.40625rem;
    margin: 0;
  }
  @media (max-width: 768px) {
    width: 2.5rem;
    height: 3.125rem;
    padding: 0rem 0.125rem;
    margin: 0rem;
  }
`;
