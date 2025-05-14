import styled from "styled-components";
import SummaryInfoCard from "./SummaryInfoCard";
import PlayTimeIcon from "../../../shared/assets/icons/themeDetail/playTimeIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/recommendMemberIcon.svg?react";
import GenreIcon from "../../../shared/assets/icons/themeDetail/genreIcon.svg?react";
import LevelIcon from "../../../shared/assets/icons/themeDetail/levelIcon.svg?react";
import HorrorIcon from "../../../shared/assets/icons/themeDetail/horrorIcon.svg?react";

function ThemeInfoSection() {
  // 임시 테마 정보 값
  const playTime = "120분";
  const member = "2~6명";
  const genre = "판타지";
  const level = "⭐ 4.4";
  const horror = "👻 3.2";

  return (
    <ComponentWrapper>
      {/* 테마 정보 요약 */}
      <SectionWrapper>
        <SectionTitle>
          테마 정보 요약
        </SectionTitle>
        <Divider></Divider>
        <CardWrapper>
          <SummaryInfoCard
            icon={<PlayTimeIcon
              style={{
                width: '1.875rem',
                height: '1.875rem',
              }}
            />}
            type="플레이 타임"
            value={playTime}
          />
          <SummaryInfoCard
            icon={<MemberIcon
              style={{
                width: '1.875rem',
                height: '1.875rem',
              }}
            />}
            type="추천 인원"
            value={member}
          />
          <SummaryInfoCard
            icon={<GenreIcon
              style={{
                width: '1.875rem',
                height: '1.875rem',
              }}
            />}
            type="장르"
            value={genre}
          />
          <SummaryInfoCard
            icon={<LevelIcon
              style={{
                width: '1.875rem',
                height: '1.875rem',
              }}
            />}
            type="난이도"
            value={level}
          />
          <SummaryInfoCard
            icon={<HorrorIcon
              style={{
                width: '1.875rem',
                height: '1.875rem',
              }}
            />}
            type="공포도"
            value={horror}
          />
        </CardWrapper>
      </SectionWrapper>

      {/* 테마 스토리 */}
      <SectionWrapper>
        <SectionTitle>
          테마 스토리
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 테마 후기 */}
      <SectionWrapper>
        <SectionTitle>
          테마 후기
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 인당 가격 안내 */}
      <SectionWrapper>
        <SectionTitle>
          인당 가격 안내
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>

      {/* 매장 정보 */}
      <SectionWrapper>
        <SectionTitle>
          매장 정보
        </SectionTitle>
        <Divider></Divider>
      </SectionWrapper>
    </ComponentWrapper>
  )
}

export default ThemeInfoSection;

// CSS
const ComponentWrapper = styled.div`
  width: 43.75rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;
`;

const SectionWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;
`;

const Divider = styled.hr`
  border: none;
  margin: 0;
  width: 41.25rem;
  height: 0.0625rem;
  background: #C4C6D1;
`;

const CardWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5625rem;
  align-self: stretch;
`;