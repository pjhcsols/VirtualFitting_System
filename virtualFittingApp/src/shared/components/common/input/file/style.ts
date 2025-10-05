import { Upload, X } from "lucide-react";

import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const DropZone = styled.div<{ $dragOver: boolean }>`
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

export const UploadIcon = styled(Upload)`
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin: 0 auto 1rem auto;
`;

export const UploadText = styled.p`
  color: #4b5563;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`;

export const UploadSubText = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
`;

export const FilePreview = styled.div`
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f9fafb;
`;

export const FilePreviewContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const FileDetails = styled.div`
  min-width: 0;
`;

export const FileName = styled.p`
  font-weight: 500;
  color: #111827;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12rem;
`;

export const FileSize = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

export const RemoveButton = styled.button`
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

export const RemoveIcon = styled(X)`
  width: 20px;
  height: 20px;
  color: #ef4444;
`;

export const ErrorMessage = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
`;

export const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #dc2626;
  margin: 0;
`;
