import { useEffect, useState } from "react";
import { TBanner } from "../types/Banner";
import { deleteBanner, getBanners } from "../api/banner.action";

function useBanner() {
  const [banners, setBanners] = useState<TBanner[]>([]);

  const onDeleteBanner = async (index: number) => {
    banners.filter((_, idx) => idx !== index);
    const res = await deleteBanner(banners[index].fileName);
    if (res) {
      alert("삭제하였습니다.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getBanners();
      setBanners(res.data);
    };
    fetchData();
  }, []);

  return {
    banners,
    onDeleteBanner,
    setBanners,
  };
}

export { useBanner };
