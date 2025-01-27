import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { locationList } from "../model/locationList";
import LocationItem from "./LocationItem";

function LocationSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <TitleWrapper>
        <Title>어디로 가시나요?</Title>
        <LocationSearchButton onClick={() => navigate('/location')}>그외 지역 검색하기</LocationSearchButton>
      </TitleWrapper>

      {/* 리스트 영역 */}
      <ListWrapper>
        {locationList.map((items) => (
          <LocationItem
            key={items.id}
            name={items.name}
          />
        ))}
      </ListWrapper>
    </SectionWrapper>
  )
}

export default LocationSection;

// CSS
const SectionWrapper = styled.div`
  margin-top: 2rem;
  width: 50rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  color: white;
`;

const LocationSearchButton = styled.p`
  color: gray;
  text-decoration: underline;
  cursor: pointer;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
`;