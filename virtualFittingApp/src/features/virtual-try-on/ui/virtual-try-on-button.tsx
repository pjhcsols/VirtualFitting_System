import styled from "styled-components";
import { GlassButton } from "@/shared/components/glass-button";
import icon_ai from "../assets/icon-ai.svg";

type VirtualTryOnButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

function VirtualTryOnButton({ onClick, disabled }: VirtualTryOnButtonProps) {
  return (
    <GlassButton onClick={onClick} width="408px" disabled={disabled}>
      <>
        <Icon src={icon_ai} alt="ai icon"/>
        AI 착용하기
      </>
    </GlassButton>
  );
}

const Icon = styled.img`
  width: 18px;
  height: 18px;
  margin-right: 8px;
  object-fit: contain;
  filter: brightness(0) invert(1);
`;

export { VirtualTryOnButton };