import { useState, useEffect } from 'react';
import { fetchMyUserDetails } from '../api/user.api';
import type { UserDetail } from '../model/types';

export const useOrderForm = () => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchMyUserDetails();
        if (response && response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveAddress = () => {
    // [seah] 배송지 정보 저장 기능 만두러야함
  };

  return { user, isLoading, handleSaveAddress };
};
