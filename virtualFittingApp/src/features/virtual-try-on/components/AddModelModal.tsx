import { useEffect } from "react";
import styled from "styled-components";
import { BREAKPOINTS } from "@/shared";
import icon_cancel from "@/shared/assets/icons/icon-cancel2.svg";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type AddModelModalProps = {
  open: boolean;
  onClose: () => void;
  registeredLoading?: boolean;          
  registeredImageUrl?: string | null;
  onUseExisting: () => void;
  onFileChange: React.ChangeEventHandler<HTMLInputElement>;
  onConfirmUpload: () => void;
  previewUrl: string | null;
};

function AddModelModal({
  open, onClose, registeredLoading = false, registeredImageUrl, onUseExisting, onFileChange, onConfirmUpload, previewUrl
}: AddModelModalProps) {
  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <ModalBackdrop onClick={onClose} role="dialog" aria-modal="true" aria-label="모델 사진 선택">
      <ModalCard onClick={stop}>
        <ModalHeader>
            <ModalTitle>가상착용 이미지</ModalTitle>
            <CloseBtn onClick={onClose} aria-label="닫기">
                <CloseIcon src={icon_cancel} alt="" aria-hidden="true" />
            </CloseBtn>
        </ModalHeader>

        <ModalBody>
          <HalfPane>
            <PaneTitle>기존 이미지</PaneTitle>
            <PreviewBox>
              {registeredLoading ? (
                <EmptyText>불러오는 중…</EmptyText>
              ) : registeredImageUrl ? (
                <img src={registeredImageUrl} />
              ) : (
                <LabelInner>
                  <UploadIcon aria-hidden="true">
                      <ErrorOutlineIcon />
                  </UploadIcon>
                  <span>등록된 이미지가 없습니다.</span>
                </LabelInner>
              )}
            </PreviewBox>
            <PrimaryButton disabled={registeredLoading || !registeredImageUrl} onClick={onUseExisting}>현재 이미지로 가상착용</PrimaryButton>
          </HalfPane>

          <VerticalDivider />

          <HalfPane>
            <PaneTitle>새로운 이미지 </PaneTitle>
            <UploadArea>
              {previewUrl ? (
                <img src={previewUrl} alt="업로드 미리보기" />
              ) : (
                <UploadLabel>
                    <LabelInner>
                        <UploadIcon aria-hidden="true">
                            <FileUploadIcon />
                        </UploadIcon>
                        <span>이미지를 드래그하거나 클릭해 업로드</span>
                    </LabelInner>
                    <input type="file" accept="image/*" onChange={onFileChange} />
                </UploadLabel>
              )}
            </UploadArea>
            <PrimaryButton disabled={!previewUrl} onClick={onConfirmUpload}>
              새로운 이미지로 가상착용
            </PrimaryButton>
          </HalfPane>
        </ModalBody>
      </ModalCard>
    </ModalBackdrop>
  );
}

export {AddModelModal}


const ModalBackdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.35);
  display: grid; place-items: center;
  z-index: 10020;
  backdrop-filter: blur(2px);
`;

const ModalCard = styled.div`
  width: min(960px, 92vw);
  border-radius: 18px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(255,255,255,0.14), rgba(255,255,255,0.07));
  border: 1px solid rgba(255,255,255,0.35);
  box-shadow: 0 18px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  color: #fff;
`;

const ModalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
`;

const ModalTitle = styled.h3`
  margin: 0; font-size: 20px; font-weight: 700;
`;

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255,255,255,0.35);
  cursor: pointer;
  transition: background .18s ease, transform .18s ease;

  &:hover { background: rgba(255,255,255,0.18); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:focus-visible { outline: 2px solid rgba(255,255,255,0.6); outline-offset: 2px; }
`;

const CloseIcon = styled.img`
  width: 20px;
  height: 20px;
  user-select: none;
  pointer-events: none;
  opacity: .95;
`;

const ModalBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 16px;

  @media (max-width: ${BREAKPOINTS.md}px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const HalfPane = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`;

const PaneTitle = styled.h4`
  margin: 4px 0 0; font-size: 16px; font-weight: 700; letter-spacing: .2px;
`;

const PreviewBox = styled.div`
  width: 100%; aspect-ratio: 4/3;
  border-radius: 14px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.25);
  background: rgba(255,255,255,0.06);
  display: grid; place-items: center;

  img { width: 100%; height: 100%; object-fit: contain; }
`;

const UploadArea = styled(PreviewBox)`
  position: relative;
`;

const UploadLabel = styled.label`
  width: 100%; height: 100%;
  position: relative;
  display: flex;                 
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;                     
  text-align: center;
  color: rgba(255,255,255,0.92);
  cursor: pointer;
  padding: 8px;

  input {
    position: absolute; inset: 0;
    opacity: 0; cursor: pointer;
  }
`;

const LabelInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;                     
  pointer-events: none;          
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  margin-top: 6px;
  height: 44px; border-radius: 10px;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.35);
  color: #fff; font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  transition: transform .18s ease, background .18s ease;

  &:hover { transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
    background: ${({ disabled }) => (disabled ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.22)")};
  }
`;

const UploadIcon = styled.div`
  line-height: 0;
  svg {
    font-size: 2.2rem;           
    color: #E9FAFF;              
    opacity: 0.95;
    transition: transform .18s ease, opacity .18s ease;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.35) 50%,
    rgba(255,255,255,0) 100%
  );
  opacity: .8;

  @media (max-width: ${BREAKPOINTS.md}px) {
    display: none;
  }
`;

const EmptyText = styled.div`
  color: rgba(255,255,255,0.78);
  font-size: 14px;
`;
