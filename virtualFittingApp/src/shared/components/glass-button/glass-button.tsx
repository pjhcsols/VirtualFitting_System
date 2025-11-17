import styled, { css } from "styled-components";
import { BREAKPOINTS } from "@/shared";
import { ReactNode } from "react";

type GlassButtonProps = {
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  width?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
};

export function GlassButton({ onClick, children, className, width, size = 'medium', disabled }: GlassButtonProps) {
  return (
    <Wrapper 
      onClick={onClick} 
      className={className} 
      $width={width}
      $size={size}
      disabled={disabled}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.button<{ $width?: string; $size: 'small' | 'medium' | 'large'; }>`
  width: ${({ $width }) => $width || 'auto'};
  height: 50px;
  padding: 0;
  border-radius: 24px;
  font-size: 16px;

  position: relative;
  isolation: isolate;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 8px 24px 0 rgba(0, 0, 0, 0.15);
  border: none;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(-30deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.4) 100%);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${({ $size }) =>
    $size === 'small' &&
    css`
      height: 36px;
      padding: 0 1.2rem;
      font-size: 14px;
      border-radius: 18px;
    `}

  ${({ $size }) =>
    $size === 'large' &&
    css`
      height: 56px;
      padding: 0 2.5rem;
      font-size: 18px;
      border-radius: 28px;
    `}

  &:hover {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
    // transform: translateY(-2px);
    box-shadow: 0 12px 28px 0 rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background: rgba(136, 136, 136, 0.2);
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
    box-shadow: none;
    &::before {
      background: none;
    }
  }

  @media (max-width: ${BREAKPOINTS.md}px) {
    ${({ $size }) =>
      css`
        ${$size === 'small'
          ? 'width: auto;'
          : 'width: 100%;'
        }
      `}
  }
`;

