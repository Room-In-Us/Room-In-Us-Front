import styled from "styled-components";
import BlueStar from "../../../shared/assets/icons/themeDetail/blueStar.svg?react";
import EvalutionIcon from "../../../shared/assets/icons/themeDetail/reviewEvalutionIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/reviewMemberIcon.svg?react";
import EscapeIcon from "../../../shared/assets/icons/themeDetail/reviewEscapeIcon.svg?react";
import HintIcon from "../../../shared/assets/icons/themeDetail/reviewHintIcon.svg?react";
import TimeIcon from "../../../shared/assets/icons/themeDetail/reviewTimeIcon.svg?react";
import PropTypes from 'prop-types';

function ThemeReview({ data }) {
  return (
    <ComponentWrapper>
      {/* 타이틀 파트 */}
      <TitleWrapper>
        <TitleLeftWrapper>
          <NickName>{data.memberNickname}</NickName>
          <Divider>|</Divider>
          <TitleText>{data.memberProficiency}</TitleText>
          <Divider>|</Divider>
          <TitleText>{data.memberHorrorPos}</TitleText>
        </TitleLeftWrapper>
        <TitleRightWrapper>
          <StarIcon/>
          <Rating>{data.satisfactionLevel}</Rating>
        </TitleRightWrapper>
      </TitleWrapper>

      {/* 요약 파트 */}
      <SummaryWrapper>
        <SummaryCard>
          <StyledEvautionIcon/>
          <SummaryTextWrapper>
            <SummaryTitle>총평</SummaryTitle>
            <SummaryText>{data.reviewEnum}</SummaryText>
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
            <SummaryText>{data.isEscaped}</SummaryText>
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
            <SummaryText>{data.remainingTime}분 남김</SummaryText>
          </SummaryTextWrapper>
        </SummaryCard>
      </SummaryWrapper>

      {/* 설명 파트 */}
      <Description>
        재밌는데 스케일이 크진 않아요. 방린이 때 오시는 걸 추천합니다.<br/>
        재밌는데 스케일이 크진 않아요. 방린이 때 오시는 걸 추천합니다.
      </Description>

      {/* 날짜 파트 */}
      <DateWrapper>
        <Date>
          방문일자 : {data.playedAt}
        </Date>
        <Date>
          작성일자 : {data.createdAt}
        </Date>
      </DateWrapper>

      {/* 상세 버튼 */}
      <DetailButton>
        <ButtonText>
          후기 상세보기
        </ButtonText>
      </DetailButton>
    </ComponentWrapper>
  )
}

// eslint 에러 방지
ThemeReview.propTypes = {
  data: PropTypes.shape({
    reviewId: PropTypes.number.isRequired,
    memberId: PropTypes.number.isRequired,
    memberNickname: PropTypes.string.isRequired,
    memberProficiency: PropTypes.string, // "BEGINNER" | "EXPERT" 등일 수 있음
    memberHorrorPos: PropTypes.string,   // "FEARLESS" | "SCARED" 등일 수 있음
    satisfactionLevel: PropTypes.number.isRequired,
    reviewEnum: PropTypes.string.isRequired, // "FAVORITE" 등
    headcount: PropTypes.number.isRequired,
    isEscaped: PropTypes.bool,
    usedHint: PropTypes.number,
    remainingTime: PropTypes.string,
    playedAt: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ThemeReview;

// CSS
const ComponentWrapper = styled.div`
  border-radius: 0.625rem;
  border: 1px solid var(--RIU_Monochrome-50, #D6D6DF);
  padding: 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
`;

const TitleLeftWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const NickName = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 140%;
`;

const Divider = styled.div`
  color: var(--RIU_Monochrome-50, #D6D6DF);
`;

const TitleText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875rem;
  line-height: 140%;
`;

const TitleRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const StarIcon = styled(BlueStar)`
  width: 1.25rem;
  height: 1.25rem;
`;

const Rating = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 1.125rem;
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

const Description = styled.div`
  align-self: stretch;
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

const Date = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 140%;
`;

const DetailButton = styled.div`
  border-radius: 2.5rem;
  padding: 0.875rem 0rem;
  box-sizing: border-box;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  background: var(--RIU_Primary-0, #E8EAFF);
  cursor: pointer;
`;

const ButtonText = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 130%;
`;