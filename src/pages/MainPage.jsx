import styled from 'styled-components';
import HearoSection from '../features/main/ui/HearoSection';
import LocationSection from '../features/main/ui/LocationSection';
import LevelSection from '../features/main/ui/LevelSection';
import GenreSection from '../features/main/ui/GenreSection';

function MainPage() {
  return (
    <PageWrapper>
      {/* 히어로 영역 */}
      <HearoSection />
      
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
  gap: 4.375rem;

  @media (max-width: 1024px) {
    gap: 5.625rem;
  }
  @media (max-width: 768px) {
    gap: 1.875rem;
  }
`;
