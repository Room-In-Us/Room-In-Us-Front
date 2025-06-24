import styled from 'styled-components';
import LevelTabSection from '../features/level/ui/LevelTabSection';
import LevelContentSection from '../features/level/ui/LevelContentSection';

export default function LevelSearchPage() {

  return (
    <Wrapper>
      <LevelTabSection />
      <LevelContentSection />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5.625rem;
  gap: 2.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;