import { useState, useEffect } from "react";
import styled from "styled-components";
import RatingStar from "../../../shared/assets/icons/themeDetail/ratingStar.svg?react";
import EvalutionIcon from "../../../shared/assets/icons/themeDetail/reviewEvalutionIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/reviewMemberIcon.svg?react";
import EscapeIcon from "../../../shared/assets/icons/themeDetail/reviewEscapeIcon.svg?react";
import HintIcon from "../../../shared/assets/icons/themeDetail/reviewHintIcon.svg?react";
import TimeIcon from "../../../shared/assets/icons/themeDetail/reviewTimeIcon.svg?react";
import { reviewEnumConversion, convertTimeToMinutes, formatDateToDot } from "../../../shared/utils/dataUtils";
import PlayMemberSection from "./PlayMemberSection";
import SignificantSection from "./SignificantSection";
import StarRatingSection from "./StarRatingSection";
import RangeItem from "../../review/ui/RangeItem";
import PropTypes from "prop-types";
import { getReviewDetailAPI } from "../api/reviewDetailAPI";

function ReviewInfoSection({ themeId, reviewId }) {
  const [reviewData, setReviewData] = useState({});
  const escapeState = reviewData?.isEscaped === true
  ? '탈출 성공'
  : reviewData?.isEscaped === false
    ? '탈출 실패'
    : '-';

  // 후기 상세 api 호출
  useEffect(() => {
    async function fetchReviewDetail() {
      try {
        const detailRes = await getReviewDetailAPI(themeId, reviewId);
        setReviewData(detailRes);
      } catch (err) {
        console.error('테마 상세 api 호출 중 오류 발생: ', err);
      }
    }
    fetchReviewDetail();
  }, [themeId, reviewId]);

  return (
    <ComponentWrapper>
      {/* 리뷰 총평 */}
      <SectionWrapper>
        <SectionTitle>리뷰 총평</SectionTitle>
        <Divider/>
        <RatingWrapper>
          <StyledRatingStar />
          <Rating>
            {typeof reviewData.satisfactionLevel === 'number' && !isNaN(reviewData.satisfactionLevel)
              ? `${Number.isInteger(reviewData.satisfactionLevel)
                  ? reviewData.satisfactionLevel
                  : reviewData.satisfactionLevel.toFixed(1)}/5`
              : '-'}
          </Rating>
        </RatingWrapper>
        <SummaryWrapper>
          <SummaryCard>
            <StyledEvautionIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>총평</SummaryTitle>
              <SummaryText>{reviewEnumConversion(reviewData.review)}</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
          <SummaryCard>
            <StyledMemberIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>플레이 인원</SummaryTitle>
              <SummaryText>
                {Array.isArray(reviewData.participantList)
                  ? `${reviewData.participantList.length}인`
                  : '-'}
              </SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
          <SummaryCard>
            <StyledEscapeIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>탈출 여부</SummaryTitle>
              <SummaryText>{escapeState}</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
          <SummaryCard>
            <StyledHintIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>힌트 사용</SummaryTitle>
              <SummaryText>{reviewData.usedHint}개 사용</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
          <SummaryCard>
            <StyledTimeIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>남긴 시간</SummaryTitle>
              <SummaryText>{reviewData.isEscaped ? convertTimeToMinutes(reviewData.remainingTime) : '-'}</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
        </SummaryWrapper>
        <ReviewDescription>
          {reviewData.reviewComment}
        </ReviewDescription>
        <ReviewPostDate>{formatDateToDot(reviewData.createdAt)}</ReviewPostDate>
      </SectionWrapper>

      {/* 방문 일자 */}
      <RowSectionWrapper>
        <SectionTitle>방문 일자</SectionTitle>
        <VisitDate>{formatDateToDot(reviewData.playedAt)}</VisitDate>
      </RowSectionWrapper>

      {/* 플레이 인원 */}
      {reviewData.participantList && (
        <PlayMemberSection participantList={reviewData.participantList} />
      )}

      {/* 탈출 여부 */}
      <RowSectionWrapper>
        <SectionTitle>탈출 여부</SectionTitle>
        <EscapeWrapper>
          <EscapeTextWrapper>
            <EscapeResult>{reviewData.isEscaped ? '성공' : '실패'}</EscapeResult>
            {(!reviewData.isEscaped && reviewData.failReason) &&
              <EscapeFailureReason>(원인: {reviewData.failReason})</EscapeFailureReason>
            }
          </EscapeTextWrapper>
          {reviewData.hasViewedEnding &&
            <EscapeEndingTag>
              <EscapeTagText>엔딩 열람</EscapeTagText>
            </EscapeEndingTag>
          }
        </EscapeWrapper>
      </RowSectionWrapper>

      {/* 추천 인원 수 */}
      <RowSectionWrapper>
        <SectionTitle>추천 인원 수</SectionTitle>
        <VisitDate>{reviewData.minRecommendedHeadcount}인</VisitDate>
      </RowSectionWrapper>

      {/* 특이사항 */}
      {reviewData.reviewTagList && (
        <SignificantSection tagList={reviewData.reviewTagList} />
      )}

      {/* 장치/좌물쇠 비율 */}
      <SectionWrapper>
        <TitleWrapper>
          <SectionTitle>장치/좌물쇠 비율</SectionTitle>
          <RatioText>{reviewData.lockRatio}:{10-reviewData.lockRatio}</RatioText>
        </TitleWrapper>
        <Divider/>
        <RangeWrapper>
          <RangeItem
            disabled={false}
            onChange={() => {}}
            value={reviewData.lockRatio*10}
          />
        </RangeWrapper>
      </SectionWrapper>
      
      {/* 난이도 */}
      <StarRatingSection
        type="난이도"
        rating={reviewData.level}
        comment={reviewData.levelComment}
      />

      {/* 공포도 */}
      <StarRatingSection
        type="공포도"
        rating={reviewData.horrorLevel}
        comment={reviewData.horrorComment}
      />

      {/* 활동성 */}
      <StarRatingSection
        type="활동성"
        rating={reviewData.activityLevel}
        comment={reviewData.activityComment}
        recommendedCloth={reviewData.recommendedCloth}
      />

      {/* 스토리 */}
      <StarRatingSection
        type="스토리"
        rating={reviewData.storyLevel}
        comment={reviewData.storyComment}
      />

      {/* 인테리어 */}
      <StarRatingSection
        type="인테리어"
        rating={reviewData.interiorLevel}
        comment={reviewData.interiorComment}
      />

      {/* 신고 영역 */}
      {/* <ReportWrapper>
        <ReportText>이 후기에 문제가 있나요?</ReportText>
        <ReportButton>후기 신고하기</ReportButton>
      </ReportWrapper> */}
    </ComponentWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
ReviewInfoSection.propTypes = {
  themeId: PropTypes.number.isRequired,
  reviewId: PropTypes.number.isRequired,
};

export default ReviewInfoSection;

// CSS
const ComponentWrapper = styled.div`
  width: 43.75rem;
  height: 54rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25rem;
  flex-shrink: 0;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    background: none;
  }
  &:hover::-webkit-scrollbar-thumb {
    border-radius: 30px;
    background-color: #8DA3FF;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.875rem;
    width: 100%;
    min-width: 20.9375rem;
    height: auto;
  }
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

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  text-align: center;
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

const Divider = styled.hr`
  border: none;
  margin: 0;
  width: 100%;
  height: 0.0625rem;
  background: #C4C6D1;
`;

const RatingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;

  @media (max-width: 768px) {
    gap: 0.25rem;
  } 
`;

const StyledRatingStar = styled(RatingStar)`
  width: 1.875rem;
  height: 1.875rem;

  @media (max-width: 768px) {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const Rating = styled.div`
  color: var(--RIU_Monochrome-500, #515467)
  font-family: 'Pretendard-SemiBold';
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SummaryWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 0.5rem;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  background: var(--RIU_Monochrome-30, #E7E8ED);
`;

const SummaryCard = styled.div`
  border-radius: 0.25rem;
  background: var(--RIU_Monochrome-10, #F9F9FB);
  padding: 0.25rem 0.75rem;
  box-sizing: border-box;
  width: 7.1875rem;
  height: 3.4375rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 768px) {
    padding: 0.25rem 0.75rem;
    width: 19%;
    height: 4.375rem;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const StyledEvautionIcon = styled(EvalutionIcon)`
  width: 1.875rem;
  height: 1.875rem;

  @media (max-width: 768px) {
    width: 1.5625rem;
    height: 1.5625rem;
  }
`;
const StyledMemberIcon = styled(MemberIcon)`
  width: 1.875rem;
  height: 1.875rem;

  @media (max-width: 768px) {
    width: 1.5625rem;
    height: 1.5625rem;
  }
`;
const StyledEscapeIcon = styled(EscapeIcon)`
  width: 1.875rem;
  height: 1.875rem;

  @media (max-width: 768px) {
    width: 1.5625rem;
    height: 1.5625rem;
  }
`;
const StyledHintIcon = styled(HintIcon)`
  width: 1.875rem;
  height: 1.875rem;

  @media (max-width: 768px) {
    width: 1.5625rem;
    height: 1.5625rem;
  }
`;
const StyledTimeIcon = styled(TimeIcon)`
  width: 1.875rem;
  height: 1.875rem;

  @media (max-width: 768px) {
    width: 1.5625rem;
    height: 1.5625rem;
  }
`;

const SummaryTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.125rem;

  @media (max-width: 768px) {
    gap: 0.125rem;
  }
`;

const SummaryTitle = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.625rem;
  line-height: 140%;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    font-size: 0.42rem;
  }
`;

const SummaryText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.75rem;
  line-height: 140%;

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    font-size: 0.42rem;
  }
`;

const ReviewDescription = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ReviewPostDate = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const RowSectionWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const VisitDate = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const EscapeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const EscapeTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3125rem;
`;

const EscapeResult = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const EscapeFailureReason = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const EscapeEndingTag = styled.div`
  border: 1px solid var(--RIU_Primary-100, #718FF2);
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
`;

const EscapeTagText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

// const ReportWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const ReportText = styled.div`
//   color: var(--RIU_Monochrome-400, #616277);
//   font-family: 'Pretendard-Medium';
//   font-size: 0.875rem;
//   line-height: 150%;

//   @media (max-width: 768px) {
//     font-size: 0.75rem;
//   }
// `;

// const ReportButton = styled.div`
//   color: var(--RIU_Primary-100, #718FF2);
//   font-family: 'Pretendard-Bold';
//   font-size: 0.875rem;
//   line-height: 150%;
//   text-decoration-line: underline;
//   text-decoration-style: solid;
//   text-decoration-skip-ink: auto;
//   text-decoration-thickness: auto;
//   text-underline-offset: auto;
//   text-underline-position: from-font;
//   cursor: pointer;

//   @media (max-width: 768px) {
//     font-size: 0.75rem;
//   }
// `;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
`;

const RatioText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
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

  @media (max-width: 768px) {
    height: 3.875rem;
  }
`;
