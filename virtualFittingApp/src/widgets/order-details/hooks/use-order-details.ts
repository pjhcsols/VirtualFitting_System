import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getOrderinfoDetail } from "@/entities/order";

type DetailVM = {
  orderId: string;
  createdAt: string;
  recipientName: string;
  recipientPhone: string;
  addressFull: string;
  items: Array<{
    id: string;                
    productName: string;
    productImageUrl: string;  
    brand: string;            
    price: number;
    options: { color: string; size: string; quantity: number };
  }>;
  amounts: {
    productAmount: number;
    brandDiscount: number;
    couponDiscount: number;
    walletUsed: number;
    finalPay: number;
  };
};

type OrderStatusResponseData = {
  orderId: string;
  createdAt: string;
  recipientName: string;
  recipientPhone: string;
  addr1: string;
  addr2: string;
  originalAmount: number;
  brandDiscountAmount: number;
  userExtraDiscountAmount: number;
  couponUsedAmount: number;
  walletUsedAmount: number;
  finalPayAmount: number;
  items: Array<{
    productId: number;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    unitPriceAfterBrandDiscount: number;
  }>;
};

export const useOrderDetails = (authUserId?: string | null) => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<DetailVM | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {  
      try {
        setIsLoading(true);
        if (!id) throw new Error("Order ID is missing");
        if (!authUserId) throw new Error("authUserId is missing");

        const res = await getOrderinfoDetail(authUserId, id);
        if (!res?.data) throw new Error("Empty response");

        const data = res.data as OrderStatusResponseData;

        const items = data.items.map((it, idx) => ({
          id: `${data.orderId}-${idx}`,
          productName: it.productName,
          productImageUrl: "",      
          brand: "Basilium",        
          price: it.unitPriceAfterBrandDiscount,
          options: {
            color: it.color,
            size: it.size,
            quantity: it.quantity,
          },
        }));

        const vm: DetailVM = {
          orderId: data.orderId,
          createdAt: data.createdAt,
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
          addressFull: [data.addr1, data.addr2].filter(Boolean).join(" "),
          items,
          amounts: {
            productAmount: data.originalAmount,
            brandDiscount: data.brandDiscountAmount + data.userExtraDiscountAmount,
            couponDiscount: data.couponUsedAmount,
            walletUsed: data.walletUsedAmount,
            finalPay: data.finalPayAmount,
          },
        };

        setDetail(vm);
      } catch (err) {
        setError(err as Error);
        console.error("주문 상세 정보를 불러오는 데 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [id, authUserId]);

  return { detail, isLoading, error };
};