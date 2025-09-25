import * as S from "./style";

import { useEffect, useState } from "react";
import { TBanner } from "../../types/Banner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ImageCard } from "../../components/card/ImageCard";
import { getBanners } from "../../api/banner.action";

function BannerViewer() {
  const [images, setImages] = useState<TBanner[]>([]);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(false);

  const nextImage = () => {
    setCurrIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrIdx((prev) => (prev - 1) % images.length);
  };

  const goToImage = (idx: number) => {
    setCurrIdx(idx);
  };

  useEffect(() => {
    const fetchBanner = async () => {
      const res = await getBanners();
      if (res) {
        console.log(res);
        setImages(res.data);
      }
    };
    fetchBanner();
  }, []);

  if (images.length === 0) {
    return <S.CarouselImage></S.CarouselImage>;
  }

  return (
    <S.CarouselContainer>
      <S.CarouselWrapper
        showControls={showControls}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <S.ImageContainer>
          <ImageCard
            src={images[currIdx].url}
            alt={`image-${images[currIdx].fileName}`}
          />
          <S.NavigationContainer showControls={showControls}>
            <S.NavButton onClick={prevImage} aria-label="이전 이미지">
              <ChevronLeft size={20} />
            </S.NavButton>
            <S.NavButton onClick={nextImage} aria-label="다음 이미지">
              <ChevronRight size={20} />
            </S.NavButton>
          </S.NavigationContainer>
        </S.ImageContainer>
        <S.DotsContainer>
          {images.map((_, index) => (
            <S.Dot
              key={index}
              isActive={index === currIdx}
              onClick={() => goToImage(index)}
              aria-label={`${index + 1}번째로 이동`}
            />
          ))}
        </S.DotsContainer>
      </S.CarouselWrapper>
    </S.CarouselContainer>
  );
}

export { BannerViewer };
