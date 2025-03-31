import { useState, useEffect } from "react";
import styled from "styled-components";
import { images } from "../constants";

function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const intervalId = setInterval(nextImage, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <Wrapper>
        <Image src={images[currentIndex]} alt="carousel image" />
        <Pagination>
        {images.map((_, index) => (
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
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => (props.$isActive ? "#fff" : "#888")};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #fff;
  }
`;

export { Carousel };
