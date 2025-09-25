import { useEffect, useState } from "react";
import { BannerCarousel } from "../../widgets/carousel";
import * as S from "./style";
import { type TBanner } from "../../types/Banner";
import { getBanners } from "../../api/banner.action";
import { BannerFileUploadList } from "../../widgets";

function AdminBanner() {
  const [images, setImages] = useState<TBanner[]>([]);

  useEffect(() => {
    const fetchBanner = async () => {
      const res = await getBanners();
      if (res) {
        setImages(res.data);
      }
    };
    fetchBanner();
  }, []);

  return (
    <S.Wrapper>
      <S.BannerContainer>
        <BannerCarousel />
      </S.BannerContainer>
      <S.BannerControllerContainer>
        <BannerFileUploadList images={images} />
      </S.BannerControllerContainer>
    </S.Wrapper>
  );
}

export { AdminBanner };
