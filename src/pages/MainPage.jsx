import styled from 'styled-components';
import HeroSection from '../features/main/ui/HeroSection';
import LocationSection from '../features/main/ui/LocationSection';
import AwardsSection from '../features/main/ui/AwardsSection';
import LevelSection from '../features/main/ui/LevelSection';
import GenreSection from '../features/main/ui/GenreSection';

function MainPage() {
  return (
    <PageWrapper>
      {/* 히어로 영역 */}
      <HeroSection />

      {/* 지역 영역 */}
      <LocationSection />

      {/* 어워즈 영역 */}
      <AwardsSection />

      {/* 숙련도 영역 */}
      <LevelSection />

      {/* 장르 영역 */}
      <GenreSection />

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
    gap: 4.21875rem;
  }
  @media (max-width: 768px) {
    gap: 1.875rem;
  }
`;
