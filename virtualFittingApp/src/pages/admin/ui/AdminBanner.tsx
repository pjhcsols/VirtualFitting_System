import styled from "styled-components";
import { Text } from "@/pages/admin/components";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useBanner } from "../hooks/useBanner";

function AdminBanner() {
  const { banners, setBanners } = useBanner();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(false);

  const nextImage = () => {
    setCurrentIdx((prev) => (prev + 1) % banners.length);
  };

  const prevImage = () => {
    setCurrentIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToImage = (idx: number) => {
    setCurrentIdx(idx);
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
  };

  const saveEdit = () => {
    if (editingIdx !== null) {
      const updatedBanners = [...banners];
      updatedBanners[editingIdx] = {
        ...updatedBanners[editingIdx],
      };
      setBanners(updatedBanners);
      setEditingIdx(null);
    }
  };

  const deleteImage = (index: number) => {
    const updatedImages = banners.filter((_, i) => i !== index);
    setBanners(updatedImages);
    if (currentIdx >= updatedImages.length) {
      setCurrentIdx(Math.max(0, updatedImages.length - 1));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingIdx(null);
    }
  };

  return (
    <Wrapper>
      <TopLayerContainer>
        <DescBox>
          <Title>Banner Manager</Title>
          <Text>스토어 배너 관리 페이지입니다.</Text>
        </DescBox>
      </TopLayerContainer>
      <ContentLayerContainer>
        {banners.length === 0 ? (
          <CarouselContainer>
            <EmptyState>등록된 배너가 없습니다.</EmptyState>
          </CarouselContainer>
        ) : (
          <CarouselContainer>
            <CarouselWrapper
              showControls={showControls}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              {/* 메인 이미지 */}
              <ImageContainer>
                <CarouselImage
                  src={`http://www.${banners[currentIdx].url}`}
                  alt={banners[currentIdx].fileName}
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
                    onClick={() => startEdit(currentIdx)}
                    aria-label="이미지 편집"
                  >
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton
                    onClick={() => deleteImage(currentIdx)}
                    aria-label="이미지 삭제"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ActionButtonContainer>
              </ImageContainer>

              {/* 이미지 정보 */}
              <InfoSection>
                {editingIdx === currentIdx ? (
                  <EditContainer>
                    <EditButton variant="save" onClick={saveEdit}>
                      저장
                    </EditButton>
                    <EditButton
                      variant="cancel"
                      onClick={() => setEditingIdx(null)}
                    >
                      취소
                    </EditButton>
                  </EditContainer>
                ) : (
                  <InfoContainer>
                    <ImageTitle>{banners[currentIdx].fileName}</ImageTitle>
                    <Counter>
                      {currentIdx + 1} / {banners.length}
                    </Counter>
                  </InfoContainer>
                )}
              </InfoSection>

              {/* 도트 네비게이션 */}
              <DotsContainer>
                {banners.map((_, index) => (
                  <Dot
                    key={index}
                    isActive={index === currentIdx}
                    onClick={() => goToImage(index)}
                    aria-label={`${index + 1}번째 이미지로 이동`}
                  />
                ))}
              </DotsContainer>
            </CarouselWrapper>
          </CarouselContainer>
        )}
      </ContentLayerContainer>
    </Wrapper>
  );
}

export { AdminBanner };

const Wrapper = styled.main`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const TopLayerContainer = styled.section`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
`;

const DescBox = styled.div`
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const ContentLayerContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
