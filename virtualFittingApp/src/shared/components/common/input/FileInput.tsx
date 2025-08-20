import { FileText, Image, Upload, X } from "lucide-react";
import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import styled from "styled-components";

interface IFileInput {
  onFileSelect?: (file: File | null) => void;
}

function FileInput({ onFileSelect }: IFileInput) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];
  const maxFileSize = 10 * 1024 * 1024;

  const validateFile = (file: File): boolean => {
    setError("");
    if (!allowedTypes.includes(file.type)) {
      setError("PDF, PNG, JPEG, JPG 파일만 업로드 가능합니다.");
      return false;
    }
    if (file.size > maxFileSize) {
      setError("파일 크기는 10MB 이하여야 합니다.");
      return false;
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError("");
    onFileSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => fileInputRef.current?.click();

  const getFileIcon = (fileType: string) => {
    if (fileType === "application/pdf") {
      return (
        <FileText style={{ width: "32px", height: "32px", color: "#dc2626" }} />
      );
    }
    return (
      <Image style={{ width: "32px", height: "32px", color: "#2563eb" }} />
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Container>
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpeg,.jpg"
        onChange={handleInputChange}
      />

      {!selectedFile ? (
        <DropZone
          $dragOver={isDragOver}
          onClick={handleClick}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={handleDrop}
        >
          <UploadIcon />
          <UploadText>파일을 드래그하거나 클릭하여 업로드</UploadText>
          <UploadSubText>PDF, PNG, JPEG, JPG (최대 10MB)</UploadSubText>
        </DropZone>
      ) : (
        <FilePreview>
          <FilePreviewContent>
            <FileInfo>
              {getFileIcon(selectedFile.type)}
              <FileDetails>
                <FileName>{selectedFile.name}</FileName>
                <FileSize>{formatFileSize(selectedFile.size)}</FileSize>
              </FileDetails>
            </FileInfo>
            <RemoveButton onClick={handleRemoveFile} title="파일 제거">
              <RemoveIcon />
            </RemoveButton>
          </FilePreviewContent>
        </FilePreview>
      )}

      {error && (
        <ErrorMessage>
          <ErrorText>{error}</ErrorText>
        </ErrorMessage>
      )}
    </Container>
  );
}

export { FileInput };

const Container = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
`;

const HiddenInput = styled.input`
  display: none;
`;

const DropZone = styled.div<{ $dragOver: boolean }>`
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #ffffff;

  &:hover {
    border-color: #9ca3af;
    background-color: #f9fafb;
  }

  ${({ $dragOver }) =>
    $dragOver &&
    `
    border-color: #3b82f6;
    background-color: #eff6ff;
  `}
`;

const UploadIcon = styled(Upload)`
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin: 0 auto 1rem auto;
`;

const UploadText = styled.p`
  color: #4b5563;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

const UploadSubText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

const FilePreview = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9fafb;
`;

const FilePreviewContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const FileDetails = styled.div`
  min-width: 0;
`;

const FileName = styled.p`
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12rem;
`;

const FileSize = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const RemoveButton = styled.button`
  padding: 0.5rem;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #fee2e2;
  }
`;

const RemoveIcon = styled(X)`
  width: 20px;
  height: 20px;
  color: #ef4444;
`;

const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #dc2626;
  margin: 0;
`;
