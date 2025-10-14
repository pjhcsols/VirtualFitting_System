import styled from "styled-components";
import { ReactNode, HTMLAttributes } from "react";
import { BREAKPOINTS } from "@/shared";

type GlassBoxProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: string;
  height?: string;
  borderRadius?: string;
};

export function GlassBox({ children, className, width, height, borderRadius, ...rest }: GlassBoxProps) {
  return (
    <Wrapper 
      className={className} 
      $width={width} 
      $height={height} 
      $borderRadius={borderRadius}
      {...rest}
    >
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $width?: string; $height?: string; $borderRadius?: string}>`
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || 'auto'};
  
  position: relative;
  isolation: isolate;
  
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
  border-radius: ${({ $borderRadius }) => $borderRadius || '12px'};
  border: none;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    
    border-radius: ${({ $borderRadius }) => $borderRadius || '12px'};
    padding: 1px;
    
    background: linear-gradient(-30deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.4) 100%);

    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  @media (max-width: ${BREAKPOINTS.lg}px) {
    width: ${({ $width }) => $width || '100%'};
  }
`;

