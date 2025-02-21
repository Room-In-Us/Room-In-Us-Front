import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { mokeThemesData } from "../model/mokeThemesData";
import ContentCard from "../../../shared/components/ContentCard";
import RightArrow from "../../../shared/assets/icons/main/rightArrow.svg?react";
import Emotional from "../../../shared/assets/icons/main/genreSection/emotional.svg?react";
import Horror from "../../../shared/assets/icons/main/genreSection/horror.svg?react";
import Detective from "../../../shared/assets/icons/main/genreSection/detective.svg?react";
import Mystery from "../../../shared/assets/icons/main/genreSection/mystery.svg?react";
import Comic from "../../../shared/assets/icons/main/genreSection/comic.svg?react";
import Fantasy from "../../../shared/assets/icons/main/genreSection/fantasy.svg?react";
import Adventure from "../../../shared/assets/icons/main/genreSection/adventure.svg?react";
import Drama from "../../../shared/assets/icons/main/genreSection/drama.svg?react";

function GenreSection() {
  const navigate = useNavigate();

  return (
    <SectionWrapper>
      {/* 제목 영역 */}
      <TitleWrapper>
        <Title>장르 기반 추천</Title>
        <LocationSearchButton onClick={() => navigate('/level')}>
          더 많은 테마 둘러보기
          <StyledRightArrow/>
        </LocationSearchButton>
      </TitleWrapper>

      {/* 레벨 버튼 영역 */}
      <LevelWrapper>
        <LevelButton>
          <ButtonText>
            <StyledEmotional />
            감성
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledHorror />
            공포/스릴러
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledDetective />
            추리
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledMystery />
            미스테리
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledComic />
            코믹
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledFantasy />
            판타지
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledAdventure />
            탐험/모험
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
        <LevelButton>
          <ButtonText>
            <StyledDrama />
            드라마
          </ButtonText>
          <ButtonLine></ButtonLine>
        </LevelButton>
      </LevelWrapper>

      {/* 콘텐츠 카드 영역 */}
      <ListWrapper>
        {mokeThemesData.map((items) => (
          <ContentCard key={items.id} data={items} />
        ))}
      </ListWrapper>
    </SectionWrapper>
  )
}

export default GenreSection;

// CSS
const SectionWrapper = styled.div`
  width: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 1.6875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.p`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.40625rem;
`;

const LocationSearchButton = styled.p`
  display: flex;
  align-items: center;
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Regular';
  font-size: 0.9375rem;
  cursor: pointer;
`;

const StyledRightArrow = styled(RightArrow)`
  margin-left: 0.75rem;
  width: 0.5rem;
`;

const LevelWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ButtonText = styled.div`
  display: flex;
  align-items: center;
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  transition: color 0.1s ease-in-out;
`;

const ButtonLine =  styled.div`
  border-radius: 1.875rem;
  width: 6.625rem;
  height: 0.25rem;
  background-color: #D6D6DF;
  transition: background-color 0.1s ease-in-out;
`;

const StyledEmotional = styled(Emotional)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledHorror = styled(Horror)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledDetective = styled(Detective)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledMystery = styled(Mystery)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledComic = styled(Comic)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledFantasy = styled(Fantasy)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledAdventure = styled(Adventure)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;
const StyledDrama = styled(Drama)`
  margin-right: 0.46875rem;
  width: 1.6875rem;
  transition: all 0.1s ease-in-out;
`;

const LevelButton = styled.div`
  width: 8.125rem;
  height: 2.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  
  &:hover ${ButtonText} {
    color: var(--RIU_Primary-100, #718FF2);
  }

  &:hover ${ButtonLine} {
    background-color: var(--RIU_Primary-100, #718FF2);
  }

  &:hover ${StyledEmotional}, 
  &:hover ${StyledHorror}, 
  &:hover ${StyledDetective}, 
  &:hover ${StyledMystery},
  &:hover ${StyledComic}, 
  &:hover ${StyledFantasy}, 
  &:hover ${StyledAdventure}, 
  &:hover ${StyledDrama} {
    fill: var(--RIU_Primary-100, #718FF2);
  }
`;

const ListWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: space-between;
`;
