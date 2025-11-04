import { useState, useEffect } from "react";
import styled from "styled-components";
import { fetchBanners } from "@/entities/advertisement";
import type { Banner } from "@/entities/advertisement";

function AdvertisementCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners("super_ad");
        if (data) {
          setBanners(data);
        }
      } catch (error) {
        console.error("Failed to load banners:", error);
      } finally {
      }
    };

    loadBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const nextImage = () => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const intervalId = setInterval(nextImage, 5000);
    return () => clearInterval(intervalId);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  if (banners.length === 0) {
    return;
  }

  const currentBannerUrl = banners[currentIndex]?.url;
  // [seah] 나중에 수정해돌라고 부탁해야됨!
  const imageUrl = currentBannerUrl && !currentBannerUrl.startsWith('http') 
    ? `http://${currentBannerUrl}` 
    : currentBannerUrl;

  return (
    <Wrapper>
      <Image src={imageUrl} alt={`Banner ${currentIndex + 1}`} />
      
      <Pagination>
        {banners.map((_, index) => (
          <Dot
            key={index}
            $isActive={index === currentIndex}
            onClick={() => goToSlide(index)}
          />
        ))}
      </Pagination>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: auto;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  min-height: 200px;
  max-height: 400px;
  object-fit: cover;
`;

const Pagination = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const Dot = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isActive ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)")};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export { AdvertisementCarousel };