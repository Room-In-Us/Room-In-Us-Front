import styled from "styled-components";
import BlueStar from "../../../shared/assets/icons/themeDetail/blueStar.svg?react";
import EvalutionIcon from "../../../shared/assets/icons/themeDetail/reviewEvalutionIcon.svg?react";
import MemberIcon from "../../../shared/assets/icons/themeDetail/reviewMemberIcon.svg?react";
import EscapeIcon from "../../../shared/assets/icons/themeDetail/reviewEscapeIcon.svg?react";
import HintIcon from "../../../shared/assets/icons/themeDetail/reviewHintIcon.svg?react";
import TimeIcon from "../../../shared/assets/icons/themeDetail/reviewTimeIcon.svg?react";
import RightArrowIcon from "../../../shared/assets/icons/common/arrow/rightArrow.svg?react";
import PropTypes from 'prop-types';
import { reviewEnumConversion, proficiencyConversion, horrorPositionConversion, formatDateToDot, convertTimeToMinutes } from "../../../shared/utils/dataUtils";
import { useNavigate, useParams } from "react-router-dom";
import { useSetRecoilState } from 'recoil';
import { userInfoModalState, userInfoIdState, userInfoNameState } from "../../auth/model/authAtom";

function ThemeReview({ data }) {
  // 상태 관리
  const setModal = useSetRecoilState(userInfoModalState);
  const setUserId = useSetRecoilState(userInfoIdState);
  const setUserName = useSetRecoilState(userInfoNameState);

  const escapeState = data.isEscaped ? '탈출 성공' : '탈출 실패';
  const navigate = useNavigate();
  const { themeId } = useParams();

  // 유저 ID 저장
  const handleClickUserName = () => {
    setUserId(data.memberId);
    setUserName(data.memberNickname);
    setModal(true);
  }
  
  return (
    <ComponentWrapper>
      <ContentWrapper>
        {/* 타이틀 파트 */}
        <TitleWrapper>
          <TitleLeftWrapper>
            <NickName onClick={handleClickUserName}>{data.memberNickname}</NickName>
            <Divider>|</Divider>
            <TitleText>{proficiencyConversion(data.memberProficiency)}</TitleText>
            <Divider>|</Divider>
            <TitleText>{horrorPositionConversion(data.memberHorrorPos)}</TitleText>
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

        {/* 설명 파트 */}
        <Description>
          {data.reviewComment}
        </Description>

        {/* 날짜 파트 */}
        <DateWrapper>
          <Date>
            방문일자 : {formatDateToDot(data.playedAt)}
          </Date>
          <Date>
            작성일자 : {formatDateToDot(data.createdAt)}
          </Date>
        </DateWrapper>

      </ContentWrapper>

      {/* 상세 버튼 */}
      <DetailButton onClick={() => navigate(`/theme/${themeId}/review/${data.reviewId}`)}>
        <div className="button-text">후기 상세보기</div>
        <RightArrowIcon className="arrow-icon" />
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
    memberProficiency: PropTypes.string,
    memberHorrorPos: PropTypes.string,
    satisfactionLevel: PropTypes.number.isRequired,
    reviewEnum: PropTypes.string.isRequired,
    headcount: PropTypes.number.isRequired,
    isEscaped: PropTypes.bool,
    usedHint: PropTypes.number,
    remainingTime: PropTypes.string,
    reviewComment: PropTypes.string,
    playedAt: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default ThemeReview;

// CSS
const ComponentWrapper = styled.div`
  border-radius: 0.625rem;
  border: 1px solid var(--RIU_Primary-20, #D0D8FF);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const ContentWrapper = styled.div`
  padding: 1.25rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  align-self: stretch;

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
  }
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
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Divider = styled.div`
  color: var(--RIU_Monochrome-50, #D6D6DF);
`;

const TitleText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875rem;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const TitleRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const StarIcon = styled(BlueStar)`
  width: 1.25rem;
  height: 1.25rem;

  @media (max-width: 768px) {
    width: 0.9375rem;
    height: 0.9375rem;
  }
`;

const Rating = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  font-family: 'Pretendard-SemiBold';
  font-size: 1.125rem;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 1rem;
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

const Description = styled.div`
  align-self: stretch;
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const DateWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;

  @media (max-width: 768px) {
    gap: 0.125rem;
  }
`;

const Date = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const DetailButton = styled.div`
  border-radius: 0rem 0rem 0.625rem 0.625rem;
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
  transition: all 0.1s ease-in-out;

  .button-text {
    color: var(--RIU_Primary-100, #718FF2);
    font-family: 'Pretendard-Bold';
    font-size: 0.875rem;
    line-height: 130%;
  }

  .arrow-icon {
    width: 1.25rem;
    height: 1.25rem;
    fill: var(--RIU_Primary-100, #718FF2);
  }

  &:hover {
    background: var(--RIU_Primary-60, #A2ADFF);

    .button-text {
      color: var(--RIU_Monochrome-10, #F9F9FB);
    }

    .arrow-icon {
      fill: var(--RIU_Monochrome-10, #F9F9FB);
    }
  }

  @media (max-width: 768px) {
    height: 2rem;
    padding: 0;

    .button-text {
      font-size: 0.75rem;
    }

    .arrow-icon {
      width: 0.9375rem;
      height: 0.9375rem;
    }
  }
`;