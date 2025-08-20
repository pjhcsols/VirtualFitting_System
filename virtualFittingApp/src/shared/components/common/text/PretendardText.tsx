import React from "react";
import styled from "styled-components";

interface PretendardTextProps {
  color?: string;
  size?: string | number;
  weight?: string | number;
  children: React.ReactNode;
}

function PretendardText({
  children,
  color,
  size,
  weight,
}: PretendardTextProps) {
  return (
    <PretendardTextSpan size={size} color={color} weight={weight}>
      {children}
    </PretendardTextSpan>
  );
}

export { PretendardText };

const PretendardTextSpan = styled.span<PretendardTextProps>`
  color: ${(props) => props.color || "#000"};
  font-size: ${(props) =>
    typeof props.size === "number" ? `${props.size}px` : props.size || "16px"};
  font-weight: ${(props) => props.weight || "normal"};
`;
