import {
  useState,
  useRef,
  type DragEvent,
  type ChangeEvent,
  Dispatch,
  SetStateAction,
} from "react";
import styled, { keyframes } from "styled-components";
import { Upload, File, X, Check } from "lucide-react";
import { FileItem } from "@/shared";

type StyledProps = {
  isDragOver?: boolean;
};

type DragDropFileUploadType = {
  files: FileItem[];
  setFiles: Dispatch<SetStateAction<FileItem[]>>;
};

function DragAndDropFile({ files, setFiles }: DragDropFileUploadType) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]): void => {
    const processedFiles: FileItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "ready",
    }));

    setFiles((prev) => [...prev, ...processedFiles]);
  };

  const removeFile = (id: string): void => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const simulateUpload = (fileId: string): void => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, status: "uploading" } : file,
      ),
    );

    setTimeout(() => {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId ? { ...file, status: "success" } : file,
        ),
      );
    }, 2000);
  };

  const uploadAllFiles = (): void => {
    files
      .filter((f) => f.status === "ready")
      .forEach((f) => simulateUpload(f.id));
  };

  const clearAllFiles = (): void => {
    setFiles([]);
  };

  const hasReadyFiles = files.some((f) => f.status === "ready");

  return (
    <Container>
      <Title>파일 업로드</Title>

      <DropZone
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <HiddenInput
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          accept="*/*"
        />

        <UploadIcon isDragOver={isDragOver} />

        <MainText isDragOver={isDragOver}>
          {isDragOver
            ? "파일을 여기에 놓으세요"
            : "파일을 드래그하거나 클릭하여 선택"}
        </MainText>

        <SubText>모든 파일 형식 지원 • 여러 파일 선택 가능</SubText>
      </DropZone>

      {files.length > 0 && (
        <FileSection>
          <FileSectionTitle>선택된 파일 ({files.length}개)</FileSectionTitle>

          <FileList>
            {files.map((fileItem) => (
              <FileItemContainer key={fileItem.id}>
                <FileIcon />

                <FileInfo>
                  <FileName>{fileItem.name}</FileName>
                  <FileDetails>
                    {formatFileSize(fileItem.size)} •{" "}
                    {fileItem.type || "Unknown type"}
                  </FileDetails>
                </FileInfo>

                <ActionArea>
                  {fileItem.status === "uploading" && (
                    <UploadingIndicator>
                      <Spinner />
                      <UploadingText>업로드 중...</UploadingText>
                    </UploadingIndicator>
                  )}

                  {fileItem.status === "success" && (
                    <SuccessIndicator>
                      <Check size={16} color="#10b981" />
                      <SuccessText>완료</SuccessText>
                    </SuccessIndicator>
                  )}

                  <RemoveButton onClick={() => removeFile(fileItem.id)}>
                    <X size={16} />
                  </RemoveButton>
                </ActionArea>
              </FileItemContainer>
            ))}
          </FileList>

          <ButtonGroup>
            <ClearAllButton onClick={clearAllFiles}>모두 제거</ClearAllButton>
          </ButtonGroup>
        </FileSection>
      )}
    </Container>
  );
}

export { DragAndDropFile };

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled Components
const Container = styled.div`
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const DropZone = styled.div<StyledProps>`
  position: relative;
  border: 2px dashed ${(props) => (props.isDragOver ? "#3b82f6" : "#d1d5db")};
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: ${(props) => (props.isDragOver ? "#dbeafe" : "transparent")};
  transform: ${(props) => (props.isDragOver ? "scale(1.05)" : "scale(1)")};

  &:hover {
    border-color: ${(props) => (props.isDragOver ? "#3b82f6" : "#9ca3af")};
    background: ${(props) => (props.isDragOver ? "#dbeafe" : "#f9fafb")};
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadIcon = styled(Upload)<StyledProps>`
  margin: 0 auto 1rem auto;
  height: 3rem;
  width: 3rem;
  color: ${(props) => (props.isDragOver ? "#3b82f6" : "#9ca3af")};
  transition: color 0.2s ease-in-out;
`;

const MainText = styled.p<StyledProps>`
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${(props) => (props.isDragOver ? "#2563eb" : "#4b5563")};
`;

const SubText = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const FileSection = styled.div`
  margin-top: 1.5rem;
`;

const FileSectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FileItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`;

const FileIcon = styled(File)`
  height: 2rem;
  width: 2rem;
  color: #3b82f6;
  margin-right: 0.75rem;
  flex-shrink: 0;
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileDetails = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 1rem;
`;

const UploadButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  background: #3b82f6;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background: #2563eb;
  }
`;

const UploadingIndicator = styled.div`
  display: flex;
  align-items: center;
`;

const Spinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-bottom: 2px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const UploadingText = styled.span`
  font-size: 0.75rem;
  color: #3b82f6;
  margin-left: 0.5rem;
`;

const SuccessIndicator = styled.div`
  display: flex;
  align-items: center;
`;

const SuccessText = styled.span`
  font-size: 0.75rem;
  color: #10b981;
  margin-left: 0.25rem;
`;

const RemoveButton = styled.button`
  padding: 0.25rem;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #ef4444;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const UploadAllButton = styled(ActionButton)`
  background: #10b981;

  &:hover:not(:disabled) {
    background: #059669;
  }
`;

const ClearAllButton = styled(ActionButton)`
  background: #6b7280;

  &:hover {
    background: #4b5563;
  }
`;
