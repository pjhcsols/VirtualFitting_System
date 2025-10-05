import { ServerProductDto } from "@/shared";
import { useEffect, useState } from "react";
import { getBrandProductList } from "@/pages/brand/api/brand.action";

function useProduct({ page, size }: { page: number; size: number }) {
  const [products, setProducts] = useState<ServerProductDto[]>([]);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getBrandProductList({ page, size });
        if (res) {
          setProducts(res.data);
        }
      } catch (err) {
        if (err instanceof CustomException) {
          setErrMsg(err.message);
        }
      }
    };
    fetchData();
  }, []);

  return {
    products,
    errMsg,
  };
}

export { useProduct };