import styled from 'styled-components'
import ReviewCard from './ReviewCard'
import { useRecoilValue } from 'recoil';
import { reviewSortAtom } from '../../model/reviewSortAtom';
import { useEffect, useState } from 'react';
import { getMyReviewAPI } from '../../api/myReviewAPI';

export default function ReviewCardSection() {

  const sortOption = useRecoilValue(reviewSortAtom);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getMyReviewAPI(1, 1000, sortOption).then((data) => {
      setReviews(data);
    });
  }, [sortOption]);

  const handleReviewDeleted = (deletedReviewId) => {
    setReviews((prev) => prev.filter((review) => review.reviewId !== deletedReviewId));
  };

  return (
    <Wrapper>
      {reviews.map((review) => (
        <ReviewCard key={review.reviewId} data={review} onDeleted={handleReviewDeleted} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25em;
  width: 100%;
`;