import styled from "styled-components";
import PropTypes from "prop-types";
import StarIcon from "../../../shared/assets/icons/reviewWrite/star.svg?react";
import EmptyStar from "../../../shared/assets/icons/reviewWrite/starEmpty.svg?react";
import HalfStar from '../../../shared/assets/icons/reviewWrite/starhalf.svg?react';
import NoDataIcon from "../../../shared/assets/images/common/noData/noDataIcon.png";

function StarRatingSection({ type, rating, comment, recommendedCloth }) {
  // 별 배열 생성
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const starValue = i + 1;
      if (rating >= starValue) {
        return <StyledStarIcon key={i} />;
      } else if (rating >= starValue - 0.5) {
        return <StyledHalfStarIcon key={i} />;
      } else {
        return <StyledEmptyStarIcon key={i} />;
      }
    });
  };

  // 복장 추천 리스트
  const recommendedClothList = [
    'PANTS', 'LONG_SKIRT', 'SHORT_SKIRT'
  ];
  // 복장 추천 텍스트 매핑 함수
  const clothTextMap = {
    PANTS: '바지 추천',
    LONG_SKIRT: '긴 치마 가능',
    SHORT_SKIRT: '짧은 치마 가능',
  };

  return (
    <SectionWrapper>
      <TitleWrapper>
          {/* 타이틀 */}
          <SectionTitle>{type}</SectionTitle>
          {/* 별점 */}
          <StarRatingWrapper>{renderStars()}</StarRatingWrapper>
        </TitleWrapper>
      <Divider/>
      {/* 설명 */}
      {comment !== '' ? (
        <Description>
          {comment}
        </Description>
      ) : (
        <NoDataWrapper>
          <StyledNoDataIcon src={NoDataIcon}/>
          <NoDataText>
            작성된 내용이 없습니다.
          </NoDataText>
        </NoDataWrapper>
      ) }

      {/* 복장 추천 */}
      {type === '활동성' &&
        <RecommendedClothWrapper>
          {recommendedClothList.map((cloth, index) => (
            <ClothOptionWrapper key={index}>
            <RadioButton
              selected={recommendedCloth === cloth}
            />
            <ClothText selected={recommendedCloth === cloth}>
              {clothTextMap[cloth]}
            </ClothText>
          </ClothOptionWrapper>
          ))}
        </RecommendedClothWrapper>
      }
    </SectionWrapper>
  )
}

// PropTypes 정의 (eslint 에러 방지)
StarRatingSection.propTypes = {
  type: PropTypes.string.isRequired,
  rating: PropTypes.number,
  comment: PropTypes.string,
  recommendedCloth: PropTypes.string,
};

export default StarRatingSection;

// CSS
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
const StyledHalfStarIcon = styled(HalfStar)`
  width: 0.75rem;
  height: 0.75rem;
`;
const StyledEmptyStarIcon = styled(EmptyStar)`
  width: 0.75rem;
  height: 0.75rem;
`;

const RecommendedClothWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  align-content: flex-start;
  gap: 0.625rem;
  align-self: stretch;
  flex-wrap: wrap;
`;

const ClothOptionWrapper = styled.div`  
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RadioButton = styled.button`
  all: unset;
  border: 1.4px solid ${(props) => (props.selected ? 'var(--RIU_Primary-100, #718FF2)' : 'var(--RIU_Primary-40, #B9C3FF)')};
  border-radius: 1.875rem;
  margin: 0.09375rem;
  width: 0.75rem;
  height: 0.75rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.35rem;
    height: 0.35rem;
    background-color: var(--RIU_Primary-100, #718FF2);
    border-radius: 1.875rem;
    transform: translate(-50%, -50%);
    opacity: ${props => (props.selected ? 1 : 0)};
    transition: opacity 0.2s ease-in-out;
  }
`;

const ClothText = styled.div`
  color: ${(props) => (props.selected ? 'var(--RIU_Monochrome-300, #696C7E)' : 'var(--RIU_Monochrome-70, #B3B6C3)')};
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: normal;
`;

const NoDataWrapper = styled.div`
  height: 18.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  align-self: stretch;
`;

const StyledNoDataIcon = styled.img`
  width: 11.25rem;
  height: 11.25rem;
`;

const NoDataText = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 150%;
`;