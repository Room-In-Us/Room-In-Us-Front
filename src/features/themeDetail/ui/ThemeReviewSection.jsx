import styled from "styled-components";
import { useState, useEffect } from "react";
import RatingStar from "../../../shared/assets/icons/themeDetail/ratingStar.svg?react";
import ThemeReview from "./ThemeReview";
import RightArrowIcon from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrowIcon from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";
import NoDataIcon from "../../../shared/assets/images/common/noData/noDataIcon.png";
import { getThemeReviewsListAPI } from "../api/themeDetailAPI";
import PropTypes from 'prop-types';

function ThemeReviewSection({ themeId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [satisfactionAvg, setSatisfactionAvg] = useState(0);
  const [reviewCnt, setReviewCnt] = useState(0);
  const [reviews, setReviews] = useState([]);

  const pageSize = 3;

  useEffect(() => {
    const fetchData = async () => {
      const res = await getThemeReviewsListAPI(themeId, currentPage, pageSize);
      if (res) {
        setSatisfactionAvg(res.satisfactionAvg || 0);
        setReviewCnt(res.reviewCnt || 0);
        setReviews(res.reviewList || []);
        setTotalPages(Math.ceil((res.reviewCnt || 0) / pageSize));
      }
    };
    fetchData();
  }, [themeId, currentPage]);

  const handlePageClick = (page) => {
    if (page !== currentPage) setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <SectionWrapper>
      <SectionTitle>테마 후기</SectionTitle>
      <Divider />

      {reviews.length === 0 ? (
        <NoDataWrapper>
          <StyledNoDataIcon src={NoDataIcon}/>
          <NoDataText>
            작성된 후기가 없습니다.
          </NoDataText>
        </NoDataWrapper>
        ) : (
        <>
          <RatingContainer>
            <RatingText>이 테마의 평균 별점은</RatingText>
            <RatingWrapper>
              <StyledRatingStar />
              <Rating>{satisfactionAvg.toFixed(1)}/5</Rating>
              <RatingMember>({reviewCnt}명)</RatingMember>
            </RatingWrapper>
          </RatingContainer>

          {reviews.map((review) => (
            <ThemeReview key={review.reviewId} data={review} />
          ))}
        </>
      )}

      {totalPages > 1 && (
        <PagingWrapper>
          <StyledLeftArrowIcon
            hasNextPage={currentPage > 1}
            onClick={handlePrevPage}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <PageNumber
              key={idx}
              pageState={currentPage === idx + 1}
              onClick={() => handlePageClick(idx + 1)}
            >
              {idx + 1}
            </PageNumber>
          ))}
          <StyledRightArrowIcon
            hasNextPage={currentPage < totalPages}
            onClick={handleNextPage}
          />
        </PagingWrapper>
      )}
    </SectionWrapper>
  );
}

// eslint 에러 방지
ThemeReviewSection.propTypes = {
  themeId: PropTypes.number.isRequired,
};

export default ThemeReviewSection;

// CSS
const SectionWrapper = styled.div`
  border-radius: 0.625rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-self: stretch;
  background: var(--RIU_Monochrome-10, #F9F9FB);
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1rem;
`;

const Divider = styled.hr`
  border: none;
  width: 100%;
  height: 1px;
  background: #C4C6D1;
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

const RatingText = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const StyledRatingStar = styled(RatingStar)`
  width: 1.875rem;
  height: 1.875rem;
`;

const Rating = styled.div`
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-SemiBold';
  font-size: 1.25rem;
`;

const RatingMember = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
`;

const PagingWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.875rem;
  margin-top: 1rem;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.25rem;
  height: 1.25rem;
  fill: ${(props) => (props.hasNextPage ? '#5B6ACC' : '#A1A4B5')};
  cursor: ${(props) => (props.hasNextPage ? 'pointer' : 'default')};
`;

const StyledRightArrowIcon = styled(RightArrowIcon)`
  width: 1.25rem;
  height: 1.25rem;
  fill: ${(props) => (props.hasNextPage ? '#5B6ACC' : '#A1A4B5')};
  cursor: ${(props) => (props.hasNextPage ? 'pointer' : 'default')};
`;

const PageNumber = styled.div`
  color: ${(props) => (props.pageState ? '#5B6ACC' : '#A1A4B5')};
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875rem;
  cursor: pointer;
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