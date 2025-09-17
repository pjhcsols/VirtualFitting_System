import { useState, useEffect } from 'react';
import { getLikedList } from "@/entities/like";
import type { LikedItem } from '@/entities/like';

export const useLikeList = () => {
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLikedItems = async () => {
      try {
        setIsLoading(true);
        const userId = localStorage.getItem("userId"); // 🚨 주의: localStorage는 이상적인 방식이 아닙니다.
        if (!userId) {
          setLikedItems([]);
          return;
        };
        const data = await getLikedList(userId);
        setLikedItems(data);
      } catch (err) {
        console.error("좋아요 목록 불러오기 실패", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLikedItems();
  }, []);

  return { likedItems, isLoading, error };
};