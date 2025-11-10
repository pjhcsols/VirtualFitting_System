import React from 'react';
import styled from "styled-components";
import { GlassBox } from "@/shared/components/glass-box";
import icon_cancel from "@/shared/assets/icons/icon-cancel2.svg"; 

type FittingResultModalProps = {
    open: boolean;
    onClose: () => void;
    imageUrl: string;
    delay: number | null;
};

export function FittingResultModal({ open, onClose, imageUrl, delay }: FittingResultModalProps) {
    if (!open) return null;

    const stop = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <ModalBackdrop onClick={onClose}>
            <ResultModalCard onClick={stop}>
                <ModalTitle>가상 착용 결과(처리 시간: {delay ?? '--'}ms)</ModalTitle>      
                <CloseBtn onClick={onClose} aria-label="닫기">
                    <CloseIcon src={icon_cancel} alt="" aria-hidden="true" />
                </CloseBtn>
                <ResultImage src={imageUrl} alt="Fitting Result" />
            </ResultModalCard>
        </ModalBackdrop>
    );
}

const ModalBackdrop = styled.div`
  position: fixed; 
  inset: 0;
  display: grid; 
  place-items: center;
  z-index: 10030;
  backdrop-filter: blur(10px);
`;

const ResultModalCard = styled(GlassBox)`
  width: 500px;
  height: auto;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: relative;
`;

const ModalTitle = styled.h3`
  margin: 0; 
  font-size: 24px; 
  font-weight: 700;
  color: #fff;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255,255,255,0.3);
  cursor: pointer;
  z-index: 10;
`;

const CloseIcon = styled.img`
  width: 18px;
  height: 18px;
  opacity: .95;
`;

const ResultImage = styled.img`
  width: 100%;
  height: 500px;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;
