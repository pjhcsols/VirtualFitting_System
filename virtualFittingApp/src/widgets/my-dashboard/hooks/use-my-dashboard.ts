import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const 
useMyDashboard = () => {
  const userId = Cookies.get("userId") as string;

  
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // [minjun] 리뷰 연동하슈
    try {
      const storedReviews = JSON.parse(localStorage.getItem("reviews") || "[]");
      setReviewCount(storedReviews.length);
    } catch (error) {
      console.error("Failed to parse reviews from localStorage", error);
      setReviewCount(0);
    }
  }, []);

  return { userId, reviewCount };
};
