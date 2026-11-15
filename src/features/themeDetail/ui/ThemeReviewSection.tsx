import styled from "styled-components";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import RatingStar from "../../../shared/assets/icons/themeDetail/ratingStar.svg?react";
import ThemeReview from "./ThemeReview";
import RightArrowIcon from "../../../shared/assets/icons/common/arrow/rightArrow.svg?react";
import LeftArrowIcon from "../../../shared/assets/icons/common/arrow/leftArrow.svg?react";
import NoDataIcon from "../../../shared/assets/images/common/noData/noDataImageSmall.png";
import PencilIcon from "../../../shared/assets/icons/themeDetail/pencilIcon.svg?react";
import { getThemeReviewsListAPI } from "../api/themeDetailAPI";
import { useSetRecoilState } from 'recoil';
import { reviewModalState } from "../model/reviewAtom";
import PropTypes from 'prop-types';
import useAuthSession from "../../../shared/hooks/useAuthSession";
import PopUpModal from "../../../shared/components/PopUpModal";
import { useNavigate } from "react-router-dom";
import type { ThemeDetailResponse, ThemeReviewDto } from '../api/types';

type ThemeReviewSectionProps = { themeId?: ThemeDetailResponse['themeId']; reviewRefetchKey?: number };

function ThemeReviewSection({ themeId, reviewRefetchKey }: ThemeReviewSectionProps) {
  const [pageSelection, setPageSelection] = useState({ themeId, page: 1 });
  // 이전 테마의 페이지로 새 조회가 시작되는 중간 렌더도 방지한다.
  const currentPage = pageSelection.themeId === themeId ? pageSelection.page : 1;
  const [totalPages, setTotalPages] = useState(1);
  const [satisfactionAvg, setSatisfactionAvg] = useState(0);
  const [reviewCnt, setReviewCnt] = useState(0);
  const [reviews, setReviews] = useState<ThemeReviewDto[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [resolvedThemeId, setResolvedThemeId] = useState(themeId);
  const requestGeneration = useRef(0);
  const requestContext = useRef({ themeId, currentPage, reviewRefetchKey });
  const displayedReviews = resolvedThemeId === themeId ? reviews : [];
  const displayedSatisfactionAvg = resolvedThemeId === themeId ? satisfactionAvg : 0;
  const displayedReviewCnt = resolvedThemeId === themeId ? reviewCnt : 0;
  const displayedTotalPages = resolvedThemeId === themeId ? totalPages : 1;

  const setModal = useSetRecoilState(reviewModalState);

  const navigate = useNavigate();

  // 로그인 상태 검증
  const isLoggedIn = useAuthSession();

  const pageSize = 3;

  useLayoutEffect(() => {
    requestContext.current = { themeId, currentPage, reviewRefetchKey };
    requestGeneration.current += 1;
    return () => { requestGeneration.current += 1; };
  }, [themeId, currentPage, reviewRefetchKey]);

  useLayoutEffect(() => {
    setPageSelection({ themeId, page: 1 });
    setSatisfactionAvg(0);
    setReviewCnt(0);
    setReviews([]);
    setTotalPages(1);
    setResolvedThemeId(themeId);
  }, [themeId]);

  useEffect(() => {
    if (themeId == null) return;
    let active = true;
    const generation = requestGeneration.current;
    const isCurrent = () => active && generation === requestGeneration.current
      && requestContext.current.themeId === themeId && requestContext.current.currentPage === currentPage
      && requestContext.current.reviewRefetchKey === reviewRefetchKey;

    const fetchData = async () => {
      try {
        const res = await getThemeReviewsListAPI(themeId, currentPage, pageSize);
        if (!isCurrent()) return;
        if (res) {
          setSatisfactionAvg(res.satisfactionAvg || 0);
          setReviewCnt(res.reviewCnt || 0);
          setReviews(res.reviewList || []);
          setTotalPages(Math.ceil((res.reviewCnt || 0) / pageSize));
          setResolvedThemeId(themeId);
        }
      } catch (error) {
        if (isCurrent()) console.error('테마 후기 목록 조회 중 오류 발생:', error);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [themeId, currentPage, reviewRefetchKey]);

  const handlePageClick = (page: number) => {
    if (page !== currentPage) setPageSelection({ themeId, page });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setPageSelection({ themeId, page: currentPage - 1 });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setPageSelection({ themeId, page: currentPage + 1 });
  };

  return (
    <SectionWrapper>
      <SectionTitle>테마 후기</SectionTitle>
      <Divider />

      {displayedReviews.length === 0 ? (
        <>
          {/* 정보 미상 섹션 */}
          <NoDataWrapper>
            <StyledNoDataIcon src={NoDataIcon}/>
            <NoDataText>
              작성된 후기가 없습니다.
            </NoDataText>
          </NoDataWrapper>

          {/* 리뷰 작성 버튼 */}
          <ReviewWriteButton
            onClick={() => {
              if (!isLoggedIn) {
                setIsLoginModalOpen(true);
                return;
              }
              setModal(true);
          }}>
            <StyledPencilIcon/>
            <ReviewWriteButtonText>
              후기 작성하기
            </ReviewWriteButtonText>
          </ReviewWriteButton>
        </>
        ) : (
        <>
          {/* 평균 별점 섹션 */}
          <RatingContainer>
            <RatingText>이 테마의 평균 별점은</RatingText>
            <RatingWrapper>
              <StyledRatingStar />
              <Rating>{displayedSatisfactionAvg.toFixed(1)}/5</Rating>
              <RatingMember>({displayedReviewCnt}명)</RatingMember>
            </RatingWrapper>
          </RatingContainer>

          {/* 리뷰 작성 버튼 */}
          <ReviewWriteButton
            onClick={() => {
              if (!isLoggedIn) {
                setIsLoginModalOpen(true);
                return;
              }
              setModal(true);
          }}>
            <StyledPencilIcon/>
            <ReviewWriteButtonText>
              후기 작성하기
            </ReviewWriteButtonText>
          </ReviewWriteButton>

          {/* 후기 목록 */}
          {displayedReviews.map((review) => (
            <ThemeReview key={review.reviewId} data={review} />
          ))}
        </>
      )}

      {displayedTotalPages > 1 && (
        <PagingWrapper>
          <StyledLeftArrowIcon
            hasNextPage={currentPage > 1}
            onClick={handlePrevPage}
          />
          <PageNumberWrapper>
            {[...Array(displayedTotalPages)].map((_: unknown, idx) => (
              <PageNumber
                key={idx}
                pageState={currentPage === idx + 1}
                onClick={() => handlePageClick(idx + 1)}
              >
                {idx + 1}
              </PageNumber>
            ))}
          </PageNumberWrapper>
          <StyledRightArrowIcon
            hasNextPage={currentPage < totalPages}
            onClick={handleNextPage}
          />
        </PagingWrapper>
      )}

      {/* 로그인 모달 */}
      <PopUpModal
        isOpen={isLoginModalOpen}
        message="로그인 후 사용할 수 있는 기능입니다."
        subMessage="로그인하시겠습니까?"
        confirmText="확인"
        cancelText="취소"
        onConfirm={() => navigate('/login')}
        onCancel={() => setIsLoginModalOpen(false)}
      />

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

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

const SectionTitle = styled.div`
  color: var(--RIU_Primary-100, #718FF2);
  font-family: 'Pretendard-Bold';
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
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

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
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
  color: var(--RIU_Monochrome-400, #616277);
  font-family: 'Pretendard-SemiBold';
  font-size: 1.25rem;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const RatingMember = styled.div`
  color: var(--RIU_Monochrome-100, #818496);
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
`;

const ReviewWriteButton = styled.div`
  border-radius: 2.5rem;
  padding: 0.875rem 0rem;
  box-sizing: border-box;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  align-self: stretch;
  background: var(--RIU_Primary-Gradient-02, linear-gradient(282deg, #5B6ACC 0%, #718FF2 100%));
  cursor: pointer;

  @media (max-width: 768px) {
    height: 1.5625rem;
    gap: 0.3125rem;
  }
`;

const StyledPencilIcon = styled(PencilIcon)`
  width: 1.25rem;
  height: 1.25rem;
  color: var(--RIU_Monochrome-10, #F9F9FB);

  @media (max-width: 768px) {
    width: 0.625rem;
    height: 0.625rem;
  }
`;

const ReviewWriteButtonText = styled.div`
  color: var(--RIU_Monochrome-10, #F9F9FB);
  font-family: 'Pretendard-Bold';
  font-size: 0.875rem;
  line-height: 130%;

  @media (max-width: 768px) {
    font-size: 0.625rem;
  }
`;

const PagingWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.875rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const PageNumberWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.875rem;
`;

const StyledLeftArrowIcon = styled(LeftArrowIcon)<{ hasNextPage: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  fill: ${(props) => (props.hasNextPage ? '#5B6ACC' : '#A1A4B5')};
  cursor: ${(props) => (props.hasNextPage ? 'pointer' : 'default')};
`;

const StyledRightArrowIcon = styled(RightArrowIcon)<{ hasNextPage: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  fill: ${(props) => (props.hasNextPage ? '#5B6ACC' : '#A1A4B5')};
  cursor: ${(props) => (props.hasNextPage ? 'pointer' : 'default')};
`;

const PageNumber = styled.div<{ pageState: boolean }>`
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

  @media (max-width: 768px) {
    height: 10.625rem;
    gap: 0.3125rem;
  }
`;

const StyledNoDataIcon = styled.img`
  width: 3.75rem;
  height: 3.75rem;

  @media (max-width: 768px) {
    width: 3.125rem;
    height: 3.125rem;
  }
`;

const NoDataText = styled.div`
  color: var(--RIU_Monochrome-90, #9192A5);
  text-align: center;
  font-family: 'Pretendard-Medium';
  font-size: 0.75rem;
  line-height: 150%;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }
`;
