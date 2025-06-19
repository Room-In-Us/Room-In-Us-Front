import styled from "styled-components";
import StarIcon from "../../../shared/assets/icons/reviewWrite/star.svg?react";
// import EmptyStar from "../../../shared/assets/icons/reviewWrite/starEmpty.svg?react";
// import HalfStar from '../../../shared/assets/icons/reviewWrite/starhalf.svg?react';
import RangeItem from "../../review/ui/RangeItem";

function GridSection() {
  return (
    <GridWrapper>
      {/* 장치/좌물쇠 비율 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>
            장치/좌물쇠 비율
          </SectionTitle>
          <RatioText>
            6:4
          </RatioText>
        </TitleWrapper>
        <Divider/>
        <RangeWrapper>
          <RangeItem
            disabled={false}
            onChange={() => {}}
            value={0}
          />
        </RangeWrapper>
      </SectionWrapper>

      {/* 난이도 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>
            난이도
          </SectionTitle>
          <StarRatingWrapper>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
          </StarRatingWrapper>
        </TitleWrapper>
        <Divider/>
        <Description>
          문제들이 굉장히 깔끔한 편이었어요!<br/>
          문제 각각의 난이도는 괜찮은데, 풀어야 하는 문제가 많아서 조금 어렵지 않을까 싶어요.<br/>
          3~4분 정도 막히면 바로바로 힌트 쓰시는 것을 추천합니다!
        </Description>
      </SectionWrapper>

      {/* 공포도 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>
            공포도
          </SectionTitle>
          <StarRatingWrapper>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
          </StarRatingWrapper>
        </TitleWrapper>
        <Divider/>
        <Description>
          문제들이 굉장히 깔끔한 편이었어요!<br/>
          문제 각각의 난이도는 괜찮은데, 풀어야 하는 문제가 많아서 조금 어렵지 않을까 싶어요.<br/>
          3~4분 정도 막히면 바로바로 힌트 쓰시는 것을 추천합니다!
        </Description>
      </SectionWrapper>

      {/* 활동성 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>
            활동성
          </SectionTitle>
          <StarRatingWrapper>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
          </StarRatingWrapper>
        </TitleWrapper>
        <Divider/>
        <Description>
          문제들이 굉장히 깔끔한 편이었어요!<br/>
          문제 각각의 난이도는 괜찮은데, 풀어야 하는 문제가 많아서 조금 어렵지 않을까 싶어요.<br/>
          3~4분 정도 막히면 바로바로 힌트 쓰시는 것을 추천합니다!
        </Description>
      </SectionWrapper>

      {/* 스토리 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>
            스토리
          </SectionTitle>
          <StarRatingWrapper>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
          </StarRatingWrapper>
        </TitleWrapper>
        <Divider/>
        <Description>
          문제들이 굉장히 깔끔한 편이었어요!<br/>
          문제 각각의 난이도는 괜찮은데, 풀어야 하는 문제가 많아서 조금 어렵지 않을까 싶어요.<br/>
          3~4분 정도 막히면 바로바로 힌트 쓰시는 것을 추천합니다!
        </Description>
      </SectionWrapper>

      {/* 인테리어 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>
            인테리어
          </SectionTitle>
          <StarRatingWrapper>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
            <StyledStarIcon/>
          </StarRatingWrapper>
        </TitleWrapper>
        <Divider/>
        <Description>
          문제들이 굉장히 깔끔한 편이었어요!<br/>
          문제 각각의 난이도는 괜찮은데, 풀어야 하는 문제가 많아서 조금 어렵지 않을까 싶어요.<br/>
          3~4분 정도 막히면 바로바로 힌트 쓰시는 것을 추천합니다!
        </Description>
      </SectionWrapper>
    </GridWrapper>
  )
}

export default GridSection;

// CSS
const GridWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 1.25rem;
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

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;
`;

const RatioText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 150%;
`;

const Divider = styled.hr`
  border: none;
  margin: 0;
  width: 100%;
  height: 0.0625rem;
  background: #C4C6D1;
`;

const Description = styled.div`
  align-self: stretch;
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;
`;

const StarRatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1875rem;
`;

const StyledStarIcon = styled(StarIcon)`
  width: 0.75rem;
  height: 0.75rem;
`;

const RangeWrapper = styled.div`
  width: 100%;
  height: 9.1875rem;
  display: flex;
  align-items: center;
  cursor: default;
  * {
    cursor: default !important;
  }
`;