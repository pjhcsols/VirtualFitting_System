import { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { authState } from '@/entities/auth';

export const useMyDashboard = () => {
  const { userId } = useRecoilValue(authState);

  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // [minjun] 리뷰 연동하슈
    try {
      const storedReviews = JSON.parse(
        localStorage.getItem('reviews') || '[]'
      );
      setReviewCount(storedReviews.length);
    } catch (error) {
      console.error('Failed to parse reviews from localStorage', error);
      setReviewCount(0);
    }
  }, []);

  return { userId, reviewCount };
};
