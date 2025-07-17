import styled from "styled-components";
import { surveyGenreList } from "../../../mypage/model/surveyGenreList";
import SurveyTag from "./SurveyTag";

function GenreSection({userInfo}) {
  // 장르 선택 상태
  const selectedGenres = userInfo ?? [];

  return (
    <SectionWrapper>
      {/* 타이틀 */}
      <Title>
        선호 장르
      </Title>

      {/* 선택 영역 */}
      <ListWrapper>
        {surveyGenreList.map((item) => (
          <SurveyTag
            key={item.id}
            item={item.genre}
            selected={selectedGenres.includes(item.enum)}
            disabled={
              !selectedGenres.includes(item.enum) &&
              selectedGenres.length >= 4
            }
          />
        ))}
      </ListWrapper>
    </SectionWrapper>
  )
}

export default GenreSection;

// CSS
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
  align-self: stretch;
`;

const Title = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.125em;
  line-height: normal;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 0.75em;
`;
