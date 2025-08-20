import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import styled from "styled-components";

const sampleImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    title: "산 풍경",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    title: "해변",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
    title: "숲",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    title: "도시",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=600&fit=crop",
    title: "강",
  },
];

// Styled Components
const CarouselContainer = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  color: #1f2937;
`;

const CarouselWrapper = styled.div<{ showControls: boolean }>`
  position: relative;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ImageContainer = styled.div`
  position: relative;
  height: 384px;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NavigationContainer = styled.div<{ showControls: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: ${(props) => (props.showControls ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const NavButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f9fafb;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionButtonContainer = styled.div<{ showControls: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: ${(props) => (props.showControls ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const ActionButton = styled.button`
  background-color: white;
  color: #374151;
  padding: 0.5rem;
  border-radius: 50%;
  border: none;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f9fafb;
  }
`;

const InfoSection = styled.div`
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e5e7eb;
`;

const EditContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EditInput = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const EditButton = styled.button<{ variant: "save" | "cancel" }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;

  ${(props) =>
    props.variant === "save"
      ? `
    background-color: #3b82f6;
    color: white;
    &:hover {
      background-color: #2563eb;
    }
  `
      : `
    background-color: #d1d5db;
    color: #374151;
    &:hover {
      background-color: #9ca3af;
    }
  `}
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ImageTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin: 0;
`;

const Counter = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const DotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  padding-bottom: 1rem;
`;

const Dot = styled.button<{ isActive: boolean }>`
  width: ${(props) => (props.isActive ? "1.5rem" : "0.5rem")};
  height: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  background-color: ${(props) => (props.isActive ? "#3b82f6" : "#d1d5db")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => (props.isActive ? "#3b82f6" : "#9ca3af")};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
`;

function BannerCarousel() {
  const [images, setImages] = useState([...sampleImages]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showControls, setShowControls] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditTitle(images[index].title);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const updatedImages = [...images];
      updatedImages[editingIndex] = {
        ...updatedImages[editingIndex],
        title: editTitle,
      };
      setImages(updatedImages);
      setEditingIndex(null);
    }
  };

  const deleteImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    if (currentIndex >= updatedImages.length) {
      setCurrentIndex(Math.max(0, updatedImages.length - 1));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingIndex(null);
    }
  };

  if (images.length === 0) {
    return (
      <CarouselContainer>
        <Title>미니멀 카루셀</Title>
        <EmptyState>이미지가 없습니다.</EmptyState>
      </CarouselContainer>
    );
  }

  return (
    <CarouselContainer>
      <CarouselWrapper
        showControls={showControls}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* 메인 이미지 */}
        <ImageContainer>
          <CarouselImage
            src={images[currentIndex].url}
            alt={images[currentIndex].title}
          />

          {/* 네비게이션 버튼 (hover 시에만 표시) */}
          <NavigationContainer showControls={showControls}>
            <NavButton onClick={prevImage} aria-label="이전 이미지">
              <ChevronLeft size={20} />
            </NavButton>
            <NavButton onClick={nextImage} aria-label="다음 이미지">
              <ChevronRight size={20} />
            </NavButton>
          </NavigationContainer>

          {/* 액션 버튼 (hover 시에만 표시) */}
          <ActionButtonContainer showControls={showControls}>
            <ActionButton
              onClick={() => startEdit(currentIndex)}
              aria-label="이미지 편집"
            >
              <Edit size={16} />
            </ActionButton>
            <ActionButton
              onClick={() => deleteImage(currentIndex)}
              aria-label="이미지 삭제"
            >
              <Trash2 size={16} />
            </ActionButton>
          </ActionButtonContainer>
        </ImageContainer>

        {/* 이미지 정보 */}
        <InfoSection>
          {editingIndex === currentIndex ? (
            <EditContainer>
              <EditInput
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="이미지 제목"
                autoFocus
              />
              <EditButton variant="save" onClick={saveEdit}>
                저장
              </EditButton>
              <EditButton
                variant="cancel"
                onClick={() => setEditingIndex(null)}
              >
                취소
              </EditButton>
            </EditContainer>
          ) : (
            <InfoContainer>
              <ImageTitle>{images[currentIndex].title}</ImageTitle>
              <Counter>
                {currentIndex + 1} / {images.length}
              </Counter>
            </InfoContainer>
          )}
        </InfoSection>

        {/* 도트 네비게이션 */}
        <DotsContainer>
          {images.map((_, index) => (
            <Dot
              key={index}
              isActive={index === currentIndex}
              onClick={() => goToImage(index)}
              aria-label={`${index + 1}번째 이미지로 이동`}
            />
          ))}
        </DotsContainer>
      </CarouselWrapper>
    </CarouselContainer>
  );
}

export { BannerCarousel };
