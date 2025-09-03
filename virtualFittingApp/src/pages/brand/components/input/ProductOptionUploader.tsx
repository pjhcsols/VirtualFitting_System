import { DragEvent, useRef, useState } from "react";
import styled from "styled-components";
import { Upload, X } from "lucide-react";

type ImageFile = {
  id: string;
  file: File;
  url: string;
};

function ProductOptionUploader() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일을 ImageFile 객체로 변환
  const createImageFile = (file: File): ImageFile => ({
    id: Math.random().toString(36),
    file,
    url: URL.createObjectURL(file),
  });

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map(createImageFile);

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      const removedIndex = prev.findIndex((img) => img.id === id);

      // 메인 이미지가 삭제된 경우 첫 번째 이미지로 설정
      if (removedIndex === mainImageIndex) {
        setMainImageIndex(0);
      } else if (removedIndex < mainImageIndex) {
        setMainImageIndex((prev) => prev - 1);
      }

      return filtered;
    });
  };

  // 썸네일 드래그 시작
  const handleThumbnailDragStart = (
    e: DragEvent<HTMLDivElement>,
    index: number,
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  // 썸네일 드래그 오버
  const handleThumbnailDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleThumbnailDrop = (
    e: DragEvent<HTMLDivElement>,
    dropIndex: number,
  ) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) return;

    setImages((prev) => {
      const newImages = [...prev];
      const draggedImage = newImages[draggedIndex];

      // 드래그된 이미지를 제거하고 새 위치에 삽입
      newImages.splice(draggedIndex, 1);
      newImages.splice(dropIndex, 0, draggedImage);

      // 메인 이미지 인덱스 업데이트
      if (mainImageIndex === draggedIndex) {
        setMainImageIndex(dropIndex);
      } else if (draggedIndex < mainImageIndex && dropIndex >= mainImageIndex) {
        setMainImageIndex((prev) => prev - 1);
      } else if (draggedIndex > mainImageIndex && dropIndex <= mainImageIndex) {
        setMainImageIndex((prev) => prev + 1);
      }

      return newImages;
    });

    setDraggedIndex(null);
  };

  return (
    <Container>
      <MainContent>
        {/* 썸네일 리스트 */}
        {images.length > 0 && (
          <ThumbnailContainer>
            <ThumbnailScrollArea>
              {images.map((image, index) => (
                <ThumbnailWrapper
                  key={image.id}
                  $isActive={index === mainImageIndex}
                  onClick={() => setMainImageIndex(index)}
                  draggable
                  onDragStart={(e) => handleThumbnailDragStart(e, index)}
                  onDragOver={handleThumbnailDragOver}
                  onDrop={(e) => handleThumbnailDrop(e, index)}
                >
                  <ThumbnailImage src={image.url} alt={`썸네일 ${index + 1}`} />
                  <DeleteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(image.id);
                    }}
                  >
                    <X size={12} />
                  </DeleteButton>
                </ThumbnailWrapper>
              ))}
              {/* 추가 업로드 버튼 */}
              {images.length > 0 && (
                <AddButtonContainer>
                  <AddButton onClick={() => fileInputRef.current?.click()}>
                    이미지 추가
                  </AddButton>
                </AddButtonContainer>
              )}
            </ThumbnailScrollArea>
          </ThumbnailContainer>
        )}

        {/* 메인 이미지 영역 */}
        <MainImageContainer>
          {images.length > 0 ? (
            <MainImageWrapper>
              <MainImage src={images[mainImageIndex]?.url} alt="메인 이미지" />
            </MainImageWrapper>
          ) : (
            <UploadArea
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload
                size={48}
                color="#9ca3af"
                style={{ marginBottom: "16px" }}
              />
              <UploadText>
                이미지를 드래그해서 놓거나 클릭해서 선택하세요
              </UploadText>
              <UploadSubText>
                여러 이미지를 한 번에 업로드할 수 있습니다
              </UploadSubText>
            </UploadArea>
          )}
        </MainImageContainer>
      </MainContent>

      {/* 파일 입력 */}
      <HiddenInput
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </Container>
  );
}

export { ProductOptionUploader };

const Container = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 24px;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 384px;
`;

const ThumbnailContainer = styled.div`
  width: 100%;
  flex-shrink: 0;
`;

const ThumbnailScrollArea = styled.div`
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

const ThumbnailWrapper = styled.div<{ $isActive: boolean }>`
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid ${(props) => (props.$isActive ? "#3b82f6" : "#d1d5db")};
  aspect-ratio: 4/5;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => (props.$isActive ? "#3b82f6" : "#9ca3af")};
  }

  ${(props) =>
    props.$isActive &&
    `
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  `}
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #dc2626;
  }
`;

const MainImageContainer = styled.div`
  flex: 1;
`;

const MainImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #d1d5db;
  aspect-ratio: 4/5;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadArea = styled.div`
  width: 100%;
  height: 100%;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s ease;
  aspect-ratio: 4/5;

  &:hover {
    border-color: #9ca3af;
  }
`;

const UploadText = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 8px;
  font-size: 16px;
`;

const UploadSubText = styled.p`
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

const AddButtonContainer = styled.div`
  margin-top: 16px;
  text-align: center;
`;

const AddButton = styled.button`
  padding: 8px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;
