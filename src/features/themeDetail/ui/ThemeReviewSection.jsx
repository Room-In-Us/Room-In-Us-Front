import styled from "styled-components";
import { useState } from "react";
import RatingStar from "../../../shared/assets/icons/themeDetail/ratingStar.svg?react";
import ThemeReview from "./ThemeReview";
import RightArrowIcon from "../../../shared/assets/icons/survey/rightArrowIcon.svg?react";
import LeftArrowIcon from "../../../shared/assets/icons/survey/leftArrowIcon.svg?react";

function ThemeReviewSection() {
  // 상태 관리
  const [currentPage, setCurrentPage] = useState(1); // 임시
  const [totalPages, ] = useState(10); // 임시
  
  // 임시 후기 데이터
  const reviewData = Array(3).fill(null);

  // 페이지 이동
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
  // 이전 페이지 이동
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // 다음 페이지 이동
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <SectionWrapper>
      <SectionTitle>
        테마 후기
      </SectionTitle>
      <Divider/>

      {/* 별점 파트 */}
      <RatingContainer>
        <RatingText>
          이 테마의 평균 별점은
        </RatingText>
        <RatingWrapper>
          <StyledRatingStar/>
          <Rating>
            4.5/5
          </Rating>
          <RatingMember>
            &#40;456명&#41;
          </RatingMember>
        </RatingWrapper>
      </RatingContainer>

      {/* 리뷰 파트 */}
      {reviewData.map((index) => (
        <ThemeReview key={index} />
      ))}

      {/* 페이징 파트 */}
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
    </SectionWrapper>
  )
}

export default ThemeReviewSection;

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

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  align-self: stretch;
`;

const RatingText = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 0.875rem;
  line-height: 140%;
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
  line-height: 140%;
`;

const RatingMember = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 140%;
`;

const PagingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 1.875rem;
  align-self: stretch;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)`
  width: 1.25rem;
  height: 1.25rem;
  fill: ${(props) => (props.hasNextPage) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  cursor: ${(props) => (props.hasNextPage) ? 'pointer' : 'default'};
`;
const StyledRightArrowIcon = styled(RightArrowIcon)`
  width: 1.25rem;
  height: 1.25rem;
  fill: ${(props) => (props.hasNextPage) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  cursor: ${(props) => (props.hasNextPage) ? 'pointer' : 'default'};
`;

const PageNumber = styled.div`
  color: ${(props) => (props.pageState) ? 'var(--RIU_Primary-300, #5B6ACC)' : 'var(--RIU_Monochrome-80, #A1A4B5)'};
  font-family: 'Pretendard-SemiBold';
  font-size: 0.875rem;
  line-height: 1.25rem;
  cursor: pointer;
`;