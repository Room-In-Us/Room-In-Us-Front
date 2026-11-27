import { useLocation } from 'react-router-dom';
import styled from 'styled-components'
import SearchSection from '../features/search/ui/SearchSection';

export default function SerachPage() {
  const { key } = useLocation();

  return (
    <Wrapper>
      <SearchSection key={key} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 5.625rem;
  gap: 2.5rem;
`;