import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import type { OrderItem } from "@/entities/order";
// import { OrderInfo } from "@/entities/order";
import { orderDummyData } from "@/entities/order";

export const useOrderList = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        setIsLoading(true);

        // [seah] 주문내역 연동해야함

        setTimeout(() => {
          setOrders(orderDummyData);
          setIsLoading(false);
        }, 500); // 딜레이 얼마나 줄지 고민해봐야할듯

      } catch (err) {
        // 나중에 연동했을 때 에러처리할거
        console.error("주문 정보를 불러오는 데 실패했습니다.", err);
        setError(err as Error);
        setIsLoading(false);
      }
    };

    fetchOrderList();
  }, []);

  return { orders, isLoading, error };
};

