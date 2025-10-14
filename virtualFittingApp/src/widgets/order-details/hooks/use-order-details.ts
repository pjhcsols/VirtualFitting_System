import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import type { OrderItem } from "@/entities/order";
import { orderDummyData } from "@/entities/order";

// import { fetchOrderDetail } from '../api/order.api';

export const useOrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error("Order ID is missing");
        }

        // [세아] 주문내역 연동해야댐

        const foundOrder = orderDummyData.find((item) => item.id === id);
        setOrder(foundOrder || null);

      } catch (err) {
        setError(err as Error);
        console.error("주문 상세 정보를 불러오는 데 실패했습니다.", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrderDetails();
  }, [id]);

  return { order, isLoading, error };
};
