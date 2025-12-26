
import React from 'react';
import styled from 'styled-components';

interface AwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  title: string;
}

const AwardModal: React.FC<AwardModalProps> = ({ isOpen, onClose, imageSrc, title }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Image src={imageSrc} alt={title} />
      </ModalContainer>
    </Overlay>
  );
};

export default AwardModal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  position: relative;
  max-width: calc(100% - 40px);
  max-height: calc(100% - 40px);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
`;

const Image = styled.img`
  display: block;
  max-width: 100%;
  max-height: 80vh;
  height: auto;
`;
