import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '../shared/assets/icons/main/searchIcon.svg?react';
import EnterIcon from '../shared/assets/icons/main/enterIcon.svg?react';
import LogoIcon from '../shared/assets/icons/common/logo.svg?react';
import LocationSection from '../features/main/ui/LocationSection';
import LevelSection from '../features/main/ui/LevelSection';
import GenreSection from '../features/main/ui/GenreSection';

function MainPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* 로고 영역 */}
      <LogoWrapper>
        <StyledLogoIcon/>
      </LogoWrapper>
      
      {/* 검색 영역 */}
      <InputWrapper>
        <StyledSearchIcon />
        <StyledInput placeholder="오늘 에약하고 싶은 테마는?" />
        <StyledEnterIcon />
      </InputWrapper>
      <CategoryButtonWrapper>
        <CategoryButton onClick={() => navigate('/location')}>지역별로 모아보기</CategoryButton>
        <CategoryButton onClick={() => navigate('/level')}>숙련도별로 모아보기</CategoryButton>
        <CategoryButton onClick={() => navigate('/genre')}>장르별로 모아보기</CategoryButton>
      </CategoryButtonWrapper>

      {/* 지역 영역 */}
      <LocationSection/>

      {/* 숙련도 영역 */}
      <LevelSection/>

      {/* 장르 영역 */}
      <GenreSection/>

    </PageWrapper>
  );
}

export default MainPage;

// CSS
const PageWrapper = styled.div`
  font-size: 0.95em; // 크기 조정
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoWrapper = styled.div`
`;

const StyledLogoIcon = styled(LogoIcon)`
`;

const InputWrapper = styled.div`
  margin-bottom: 2em;
  border: 3px solid rgba(148, 0, 0.8);
  border-radius: 1em;
  width: 30rem;
  height: 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(148, 0, 0, 0.15);
  box-shadow: 0 0.3em 1em 0.1em #111111;
`;

export const StyledSearchIcon = styled(SearchIcon)`
  margin: 0 1em;
  width: 1.2em;
`;

export const StyledInput = styled.input`
  flex: 1;
  border: none;
  height: 1.67em;
  background-color: transparent;
  color: #fbe8e9;
  font-size: 1.2em;
  outline: none;
`;

export const StyledEnterIcon = styled(EnterIcon)`
  margin: 0 1em;
  width: 1em;
  cursor: pointer;
`;

const CategoryButtonWrapper = styled.div`
  display: flex;
`;

const CategoryButton = styled.button`
  margin: 0 1rem;
  border: none;
  border-radius: 10px;
  width: 10rem;
  height: 4rem;
  cursor: pointer;
`;