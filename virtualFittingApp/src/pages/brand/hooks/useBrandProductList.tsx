import { useEffect, useState } from "react";
import { GET_BRAND_PRODUCT_LIST } from "../api/brand.action";
import { ServerProductDto } from "@/shared";

function useBrandProductList({ page, size }: { page: number; size: number }) {
  const [data, setData] = useState<ServerProductDto[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchData = async () => {
    const res = await GET_BRAND_PRODUCT_LIST({ page, size });
    if (res === undefined) {
      setError("");
      return;
    }
    setData(res);
  };

  useEffect(() => {
    fetchData();
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
  };
}

export { useBrandProductList };
