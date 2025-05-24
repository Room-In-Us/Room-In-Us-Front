import styled from "styled-components";
import { useRecoilState } from 'recoil';
import { surveyState } from "../../model/surveyAtom";
import { surveyGenreList } from "../../model/surveyGenreList";
import SurveyTag from "./SurveyTag";

function GenreSection() {
  // state 관리
  const [survey, setSurvey] = useRecoilState(surveyState);

  // 장르 선택 상태
  const selectedGenres = survey.preferredGenreList;

  // 태그 선택 핸들러
  const handleTagClick = (enumValue) => {
    const isSelected = selectedGenres.includes(enumValue);

    if (isSelected) {
      setSurvey(prev => ({
        ...prev,
        preferredGenreList: prev.preferredGenreList.filter(tag => tag !== enumValue)
      }));
    } else if (selectedGenres.length < 4) {
      setSurvey(prev => ({
        ...prev,
        preferredGenreList: [...prev.preferredGenreList, enumValue]
      }));
    }
  };

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
            onClick={() => handleTagClick(item.enum)}
            disabled={
              !selectedGenres.includes(item.enum) &&
              selectedGenres.length >= 4
            }
          />
        ))}
      </ListWrapper>

      <CheckDescription>
        최대 4개까지 선택 가능합니다
      </CheckDescription>
    </SectionWrapper>
  )
}

export default GenreSection;

// CSS
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  align-self: stretch;
`;

const Title = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-Bold';
  font-size: 1.125rem;
  line-height: normal;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 0.75rem;
`;

const CheckDescription = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  color: var(--RIU_Monochrome-70, #B3B6C3);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 130%;
`;
