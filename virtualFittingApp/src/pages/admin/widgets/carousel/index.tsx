import * as S from "./style";

import { useEffect, useState } from "react";
import { deleteBanner, getBanners } from "../../api/banner.action";
import { TBanner } from "../../types/Banner";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { ImageCard } from "../../components/card/ImageCard";

function BannerCarousel() {
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

  const onDeleteBanner = async (fileName: string, index: number) => {
    try {
      await deleteBanner(fileName);
    } catch (err) {
      if (err instanceof CustomException) {
        console.log(err);
      }
    }
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (currIdx >= updatedImages.length) {
      setCurrIdx(Math.max(0, updatedImages.length - 1));
    }
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
          <S.ActionButtonContainer showControls={showControls}>
            <S.ActionButton
              onClick={() => onDeleteBanner(images[currIdx].fileName, currIdx)}
              aria-label="이미지 삭제"
            >
              <Trash2 size={16} />
            </S.ActionButton>
          </S.ActionButtonContainer>
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

export { BannerCarousel };
