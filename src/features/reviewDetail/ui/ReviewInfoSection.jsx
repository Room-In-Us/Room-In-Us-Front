import styled from "styled-components";
import RatingStar from "../../../shared/assets/icons/themeDetail/ratingStar.svg?react";
import EvalutionIcon from "../../../shared/assets/icons/themeDetail/reviewEvalutionIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/reviewMemberIcon.svg?react";
import EscapeIcon from "../../../shared/assets/icons/themeDetail/reviewEscapeIcon.svg?react";
import HintIcon from "../../../shared/assets/icons/themeDetail/reviewHintIcon.svg?react";
import TimeIcon from "../../../shared/assets/icons/themeDetail/reviewTimeIcon.svg?react";
import { reviewEnumConversion, convertTimeToMinutes } from "../../../shared/utils/dataUtils";
import PlayMemberSection from "./PlayMemberSection";
import SignificantSection from "./SignificantSection";
import StarRatingSection from "./StarRatingSection";
import RangeItem from "../../review/ui/RangeItem";

function ReviewInfoSection() {
  const data = {
    satisfactionAvg: 4.5,
    reviewEnum: 'FLOWER',
    headcount: 3,
    isEscaped: true,
    usedHint: 1,
    remainingTime: '00:32:17',
  }
  const escapeState = data.isEscaped ? '탈출 성공' : '탈출 실패';

  return (
    <ComponentWrapper>
      {/* 리뷰 총평 */}
      <SectionWrapper>
        <SectionTitle>
          리뷰 총평
        </SectionTitle>
        <Divider/>
        <RatingWrapper>
          <StyledRatingStar />
          <Rating>{data.satisfactionAvg.toFixed(1)}/5</Rating>
        </RatingWrapper>
        <SummaryWrapper>
          <SummaryCard>
            <StyledEvautionIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>총평</SummaryTitle>
              <SummaryText>{reviewEnumConversion(data.reviewEnum)}</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
          <SummaryCard>
            <StyledMemberIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>플레이 인원</SummaryTitle>
              <SummaryText>{data.headcount}인</SummaryText>
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
              <SummaryText>{data.usedHint}개 사용</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
          <SummaryCard>
            <StyledTimeIcon/>
            <SummaryTextWrapper>
              <SummaryTitle>남긴 시간</SummaryTitle>
              <SummaryText>{convertTimeToMinutes(data.remainingTime)}</SummaryText>
            </SummaryTextWrapper>
          </SummaryCard>
        </SummaryWrapper>
        <ReviewDescription>
          재밌는데 스케일이 크진 않아요. 방린이 때 오시는 걸 추천합니다.<br/>
          재밌는데 스케일이 크진 않아요. 방린이 때 오시는 걸 추천합니다.
        </ReviewDescription>
        <ReviewPostDate>
          2025.05.26
        </ReviewPostDate>
      </SectionWrapper>

      {/* 방문 일자 */}
      <RowSectionWrapper>
        <SectionTitle>
          방문 일자
        </SectionTitle>
        <VisitDate>
          2025.05.26
        </VisitDate>
      </RowSectionWrapper>

      {/* 플레이 인원 */}
      <PlayMemberSection/>

      {/* 탈출 여부 */}
      <RowSectionWrapper>
        <SectionTitle>
          탈출 여부
        </SectionTitle>
        <EscapeWrapper>
          <EscapeTextWrapper>
            <EscapeResult>실패</EscapeResult>
            <EscapeFailureReason>(원인:힌트 개수 초과)</EscapeFailureReason>
          </EscapeTextWrapper>
          <EscapeEndingTag>
            <EscapeTagText>엔딩 열람</EscapeTagText>
          </EscapeEndingTag>
        </EscapeWrapper>
      </RowSectionWrapper>

      {/* 추천 인원 수 */}
      <RowSectionWrapper>
        <SectionTitle>
          추천 인원 수
        </SectionTitle>
        <VisitDate>
          3인
        </VisitDate>
      </RowSectionWrapper>

      {/* 특이사항 */}
      <SignificantSection/>

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
      <StarRatingSection
        type="난이도"
        rating={3}
      />

      {/* 공포도 */}
      <StarRatingSection
        type="공포도"
        rating={3.5}
      />

      {/* 활동성 */}
      <StarRatingSection
        type="활동성"
        rating={5}
        recommendedCloth={'PANTS'}
      />

      {/* 스토리 */}
      <StarRatingSection
        type="스토리"
        rating={4}
      />

      {/* 인테리어 */}
      <StarRatingSection
        type="인테리어"
        rating={4.5}
      />

      {/* 신고 영역 */}
      <ReportWrapper>
        <ReportText>
          이 후기에 문제가 있나요?
        </ReportText>
        <ReportButton>
          후기 신고하기
        </ReportButton>
      </ReportWrapper>
    </ComponentWrapper>
  )
}

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
`;

const StyledRatingStar = styled(RatingStar)`
  width: 1.875rem;
  height: 1.875rem;
`;

const Rating = styled.div`
  color: var(--RIU_Monochrome-500, #515467)
  font-family: 'Pretendard-SemiBold';
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 140%;
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
`;

const StyledEvautionIcon = styled(EvalutionIcon)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledMemberIcon = styled(MemberIcon)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledEscapeIcon = styled(EscapeIcon)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledHintIcon = styled(HintIcon)`
  width: 1.875rem;
  height: 1.875rem;
`;
const StyledTimeIcon = styled(TimeIcon)`
  width: 1.875rem;
  height: 1.875rem;
`;

const SummaryTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.125rem;
`;

const SummaryTitle = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.625rem;
  line-height: 140%;
`;

const SummaryText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.75rem;
  line-height: 140%;
`;

const ReviewDescription = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;
`;

const ReviewPostDate = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 140%;
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
`;

const EscapeFailureReason = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;
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
`;

const ReportWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReportText = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;
`;

const ReportButton = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 150%;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
  cursor: pointer;
`;

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
