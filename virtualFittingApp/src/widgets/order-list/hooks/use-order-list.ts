import { useState, useEffect } from "react";
// import Cookies from "js-cookie";
import type { OrderItem } from "@/entities/order";
import { readReviewPayloads, type ReviewPayloadRaw } from "@/widgets/review-list/utils/review-payload";

export const useOrderList = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);

      const injectedList: ReviewPayloadRaw[] = readReviewPayloads();

      // 2) 없으면 빈배열
      if (!injectedList.length) {
        setOrders([]);
        setIsLoading(false);
        return;
      }

      const seen = new Set<string>();
      const rows: OrderItem[] = [];

      for (const injected of injectedList) {
        const item = injected.item ?? {};
        const normalized: OrderItem = {
          id: String(item?.id ?? injected.orderId),
          productId: Number(item?.productId ?? 0),
          productName: String(item?.productName ?? ""),
          date: item?.date ? new Date(item.date).toISOString() : new Date().toISOString(),
          productImageUrl:
            item?.productImageUrl ||
            (Array.isArray(item?.productPhotoUrls) && item.productPhotoUrls[0]) ||
            "",
          brand: String(item?.brand ?? "Basilium"),
          category: String(item?.category ?? ""),
          price: Number(item?.price ?? 0),
          options: item?.options ?? { color: "", size: "", quantity: 1 },
        };

        const key = `${normalized.id}__${normalized.date}`;
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push(normalized);
      }

      // 최신순
      rows.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setOrders(rows);
      setIsLoading(false);
    } catch (err) {
      console.error("주문 정보를 불러오는 데 실패했습니다.", err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  return { orders, isLoading, error };
};

