import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import HearoSection from '../features/main/ui/HearoSection';
import LocationSection from '../features/main/ui/LocationSection';
import LevelSection from '../features/main/ui/LevelSection';
import GenreSection from '../features/main/ui/GenreSection';

function MainPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* 히어로 영역 */}
      <HearoSection />
      
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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