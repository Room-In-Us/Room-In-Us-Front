import styled from 'styled-components'
import ReviewCard from './ReviewCard'
import { useRecoilState, useRecoilValue } from 'recoil';
import { reviewSortAtom } from '../../model/reviewSortAtom';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getMyReviewAPI } from '../../api/myReviewAPI';
import { reviewModalState } from '../../../themeDetail/model/reviewAtom';
import ReviewWriteModal from '../../../review/ui/ReviewWriteModal';
import NoDataImg from '../../../../shared/assets/images/common/noData/noDataImageLarge.png';
import type { MyReviewListItem } from '../../api/types';
import type { EditableMyReview } from '../../model/reviewView';

export default function ReviewCardSection() {

  const sortOption = useRecoilValue(reviewSortAtom);
  const [reviews, setReviews] = useState<MyReviewListItem[]>([]);
  const [selectedReview, setSelectedReview] = useState<EditableMyReview | null>(null);
  const [selectedEditGeneration, setSelectedEditGeneration] = useState(0);
  const [isModalOpen, setIsModalOpen] = useRecoilState(reviewModalState);
  const context = useMemo(() => ({ sortOption }), [sortOption]);
  const currentContext = useRef<typeof context | null>(null);
  const listGeneration = useRef(0);
  const editGeneration = useRef(0);
  const editTarget = useRef<{ themeId: number; reviewId: number } | null>(null);

  useLayoutEffect(() => {
    currentContext.current = context;
    listGeneration.current += 1;
    editGeneration.current += 1;
    editTarget.current = null;
    return () => {
      currentContext.current = null;
      listGeneration.current += 1;
      editGeneration.current += 1;
      editTarget.current = null;
    };
  }, [context]);

  const fetchReviews = useCallback(async () => {
    if (currentContext.current !== context) return;
    const generation = ++listGeneration.current;
    const isCurrent = () => currentContext.current === context && listGeneration.current === generation;
    try {
      const data = await getMyReviewAPI(1, 1000, context.sortOption);
      if (!isCurrent()) return;
      setReviews(data);
    } catch (error) {
      if (!isCurrent()) return;
      throw error;
    }
  }, [context]);

  useEffect(() => {
    void fetchReviews().catch((error: unknown) => {
      if (currentContext.current === context) console.error('내 후기 목록 조회 실패:', error);
    });
  }, [fetchReviews, context]);

  const handleReviewDeleted = (deletedReviewId: MyReviewListItem['reviewId']) => {
    if (currentContext.current !== context) return;
    // 삭제 전의 목록 응답이 삭제된 후기를 다시 추가하지 않게 한다.
    listGeneration.current += 1;
    setReviews((prev) => prev.filter((review) => review.reviewId !== deletedReviewId));
  };

  const handleEditStart = (themeId: number, reviewId: number) => {
    if (currentContext.current !== context) return null;
    const generation = ++editGeneration.current;
    const target = { themeId, reviewId };
    editTarget.current = target;
    // 새 조회가 끝날 때까지 이전 수정 폼을 렌더링하지 않는다.
    setSelectedReview(null);
    setIsModalOpen(false);
    return () => currentContext.current === context && editGeneration.current === generation
      && editTarget.current === target;
  };

  const handleEditReview = (reviewData: EditableMyReview) => {
    if (currentContext.current !== context || editTarget.current?.themeId !== reviewData.themeId
      || editTarget.current.reviewId !== reviewData.reviewId) return;
    setSelectedReview(reviewData);
    setSelectedEditGeneration(editGeneration.current);
    setIsModalOpen(true);
  };

  const handleReviewUpdated = async () => {
    await fetchReviews();
  };

  return (
    <>
      <Wrapper>
        {reviews.length === 0 ? (
        <NoDataWrapper>
          <img src={NoDataImg} alt="작성한 후기 없음" />
          <NonDataTextWrapper>
            <NonDataText>아직 작성한 후기가 없습니다.</NonDataText>
          </NonDataTextWrapper>
        </NoDataWrapper>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.reviewId} 
              data={review}
              onDeleted={handleReviewDeleted}
              onEdit={handleEditReview}
              onEditStart={handleEditStart}
            />
          ))
        )}
      </Wrapper>

      {isModalOpen && selectedReview && (
        <ModalBackdrop>
          <ReviewWriteModal
            key={selectedEditGeneration}
            themeData={{
              themeId: selectedReview.themeId,
              themeName: selectedReview.themeName,
              storeName: selectedReview.storeName,
              img: selectedReview.img,
            }}
            reviewId={selectedReview.reviewId}
            isEditMode={true}
            onUpdated={handleReviewUpdated}
          />
        </ModalBackdrop>
      )}
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25em;
  width: 100%;
`;

const NoDataWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  gap: 1.25em;

  img {
    width: 16rem;
    
    @media (max-width: 768px) {
      width: 10rem;
    }
  }
`;

const NonDataTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

const NonDataText = styled.div`
  color: var(--RIU_Monochrome-500, #515467);
  text-align: center;
  font-family: Pretendard-ExtraBold;
  font-size: 1.125rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3500;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;
