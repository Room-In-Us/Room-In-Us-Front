import styled from 'styled-components'
import ReviewCard from './ReviewCard'
import { useRecoilValue } from 'recoil';
import { reviewSortAtom } from '../../model/reviewSortAtom';
import { useEffect, useState } from 'react';
import { getMyReviewAPI } from '../../api/myReviewAPI';

export default function ReviewCardSection() {

  const sort = useRecoilValue(reviewSortAtom);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    getMyReviewAPI(1, 1000, sort).then((data) => {
      setReviews(data.contents);
    });
  }, [sort]);

  return (
    <Wrapper>
      {reviews.map((review) => (
        <ReviewCard key={review.reviewId} data={review} />
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.25em;
`;