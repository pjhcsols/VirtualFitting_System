import { useState, useEffect } from 'react';
import type { OrderItem } from '@/entities/order';
// import { fetchCancelListApi } from '../api/cancel.api';
// [민준] 나중에 연동하슈.

export const useCancelList = () => {
  const [activeTab, setActiveTab] = useState<string>("전체");
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        // const data = await fetchCancelListApi();
        // setAllOrders(data);

      } catch (err) {
        setError(err as Error);
        console.error("취소/반품 목록을 불러오는 데 실패했습니다.", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (activeTab === "전체") {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(
        allOrders.filter((order) => order.category === activeTab)
      );
    }
  }, [activeTab, allOrders]);

  return {
    filteredOrders,
    activeTab,
    setActiveTab,
    isLoading,
    error,
  };
};