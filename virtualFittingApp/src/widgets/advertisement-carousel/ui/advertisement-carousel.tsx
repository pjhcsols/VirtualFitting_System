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

  const cacheKey = banners.map(b => b.url).join('');
  const currentBannerUrl = banners[currentIndex]?.url;
  const uniqueUrl = currentBannerUrl 
    ? `${currentBannerUrl}?v=${encodeURIComponent(cacheKey)}` 
    : '';
    
  return (
    <Wrapper>
      <Image src={uniqueUrl} alt={`Banner ${currentIndex + 1}`} />
      
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
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%; 
  height: 100%; 
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