import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import type { ProductInputType } from "@/pages/admin/types/Product";
import { getStoreProductsAPI } from "@/shared";

function useWholeProducts() {
  const [productInfos, setProductInfos] = useState<ProductInputType[] | null>(
    []
  );

  const location = useLocation();
  const categorySelector = location.state?.category || "New Arrival";

  useEffect(() => {
    if (categorySelector === "New Arrival") {
      const getProductAll = async () => {
        const res = await getStoreProductsAPI();
        if (res) {
          setProductInfos(res);
        } else {
          setProductInfos(null);
        }
      };
      getProductAll();
    } else {
      //　선택된 Category 에 따라서 Category Id 목록 Get
      // Category Id 목록에 따라 상품 Parallel Fetch
      // 모든 Category 상품 -> 하나의 배열로 합침.
      // flat 함수 사용
      // Product Id 기준으로 정렬한다.
    }
  }, [categorySelector]);

  return productInfos;
}

export { useWholeProducts };
