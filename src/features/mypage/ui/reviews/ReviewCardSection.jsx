import styled from 'styled-components'
import ReviewCard from './ReviewCard'
import { useRecoilState, useRecoilValue } from 'recoil';
import { reviewSortAtom } from '../../model/reviewSortAtom';
import { useCallback, useEffect, useState } from 'react';
import { getMyReviewAPI } from '../../api/myReviewAPI';
import { reviewModalState } from '../../../themeDetail/model/reviewAtom';
import ReviewWriteModal from '../../../review/ui/ReviewWriteModal';

export default function ReviewCardSection() {

  const sortOption = useRecoilValue(reviewSortAtom);
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useRecoilState(reviewModalState);

  const fetchReviews = useCallback(async () => {
    const data = await getMyReviewAPI(1, 1000, sortOption);
    setReviews(data);
  }, [sortOption]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleReviewDeleted = (deletedReviewId) => {
    setReviews((prev) => prev.filter((review) => review.reviewId !== deletedReviewId));
  };

  const handleEditReview = (reviewData) => {
    setSelectedReview(reviewData);
    setIsModalOpen(true);
  };

  const handleReviewUpdated = async () => {
    await fetchReviews();
  };

  return (
    <>
      <Wrapper>
        {reviews.map((review) => (
          <ReviewCard
            key={review.reviewId} 
            data={review}
            onDeleted={handleReviewDeleted}
            onEdit={handleEditReview}
          />
        ))}
      </Wrapper>

      {isModalOpen && selectedReview && (
        <ModalBackdrop>
          <ReviewWriteModal
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