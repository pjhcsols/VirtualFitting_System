import { useEffect, useMemo, useState } from "react";
import type { OrderItemWithReview, OrderItem } from "@/entities/order";
import type { ReviewData } from "@/entities/review";
import { readReviewPayloads, type ReviewPayloadRaw } from "../utils/review-payload";

export function useReviewList() {
  const [activeTab, setActiveTab] = useState<"작성가능" | "작성완료">("작성가능");
  const [orders, setOrders] = useState<OrderItemWithReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const injectedList: ReviewPayloadRaw[] = readReviewPayloads();
    const savedReviews: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");

    // 없음 → 빈 목록
    if (!injectedList.length) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const seen = new Set<string>();
    const rows: OrderItemWithReview[] = [];

    for (const injected of injectedList) {
      const normalizedItem: OrderItem = {
        id: String(injected.item?.id ?? injected.orderId),
        productName: String(injected.item?.productName ?? ""),
        date: injected.item?.date
          ? new Date(injected.item.date).toISOString()
          : new Date().toISOString(),
        productImageUrl: injected.item?.productImageUrl ?? "",
        brand: injected.item?.brand ?? "",
        category: injected.item?.category ?? "",
        price: Number(injected.item?.price ?? 0),
        productId: Number(injected.item?.productId ?? 0),
        options: injected.item?.options ?? { color: "", size: "", quantity: 1 },
      };

      const uniq = `${normalizedItem.id}__${normalizedItem.date}`;
      if (seen.has(uniq)) continue;
      seen.add(uniq);

      const matched = savedReviews.find((r) => r.id === normalizedItem.id);
      rows.push({
        ...normalizedItem,
        isReviewed: !!matched,
        reviewData: matched || undefined,
      });
    }

    setOrders(rows);
    setIsLoading(false);
  }, []);

  const filteredOrders = useMemo(() => {
    return activeTab === "작성완료"
      ? orders.filter((o) => o.isReviewed)
      : orders.filter((o) => !o.isReviewed);
  }, [orders, activeTab]);

  const handleDeleteReview = (id: string) => {
    const saved: ReviewData[] = JSON.parse(localStorage.getItem("reviews") || "[]");
    const updated = saved.filter((r) => r.id !== id);
    localStorage.setItem("reviews", JSON.stringify(updated));

    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isReviewed: false, reviewData: undefined } : o))
    );
    alert("리뷰가 삭제되었습니다.");
  };

   return { 
    filteredOrders, 
    activeTab, 
    setActiveTab, 
    isLoading, 
    handleDeleteReview 
  };
}
