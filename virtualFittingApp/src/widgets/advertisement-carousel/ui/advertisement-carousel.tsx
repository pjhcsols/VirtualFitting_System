import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { fetchBanners } from "@/entities/advertisement";
import type { Banner } from "@/entities/advertisement";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { rawSvgContent } from "@/widgets/main/model/constants";

function AdvertisementCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
    if (banners.length === 0 || isPaused) return;

    const nextImage = () => {
      setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    };

    const intervalId = setInterval(nextImage, 5000);
    return () => clearInterval(intervalId);
  }, [banners.length, isPaused]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev); 
  };

  const cacheKey = banners.map(b => b.url).join('');
  let currentBannerUrl = banners[currentIndex]?.url;
  const uniqueUrl = currentBannerUrl 
    ? `${currentBannerUrl}?v=${encodeURIComponent(cacheKey)}` 
    : '';
    
  return (
    <Wrapper>
      <Image src={uniqueUrl} alt={`Banner ${currentIndex + 1}`} />
      
      <Pagination>
        {banners.map((_, index) => (
          <GaugeBarWrapper
            key={index}
            onClick={() => goToSlide(index)}
          >
            <GaugeFill $isActive={index === currentIndex} $isPaused={isPaused} />
          </GaugeBarWrapper>
        ))}
        <PlayPauseButton onClick={handleTogglePause}>
            {isPaused ? <PlayCircleIcon fontSize="large" /> : <PauseCircleIcon fontSize="large" />}
        </PlayPauseButton>
      </Pagination>
      <ScrollArrow dangerouslySetInnerHTML={{ __html: rawSvgContent }} />
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
  bottom: 36px;
  left: 36px;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const fillAnimation = keyframes`
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const GaugeBarWrapper = styled.div`
  width: 80px;
  height: 10px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.4);
  overflow: hidden;
  cursor: pointer;
`;

const GaugeFill = styled.div<{ $isActive: boolean, $isPaused: boolean }>`
  width: 100%;
  height: 100%;
  background-color: white;
  transform-origin: left;

  transform: scaleX(0);
  transition: transform 0.1s;

  ${({ $isActive, $isPaused }) =>
    $isActive &&
    css`
      animation: ${fillAnimation} 5s linear forwards;
      animation-play-state: ${$isPaused ? 'paused' : 'running'};
    `}
`;

const PlayPauseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  padding: 0 4px;
  margin-left: 8px;
  transition: color 0.2s;

  &:hover {
    color: white;
  }
`;

const ScrollArrow = styled.div`
  position: absolute;
  bottom: 36px;
  z-index: 10;
  animation: ${bounce} 2s infinite;
  border: none;
  color: #E9FAFF; 

  left: 50%;
  transform: translateX(-50%);
  transform: translateX(-50%) translateY(0);
  
  svg {
    width: 50px; 
    height: 80px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    display: block;
    vertical-align: middle;
  }
`;

export { AdvertisementCarousel };