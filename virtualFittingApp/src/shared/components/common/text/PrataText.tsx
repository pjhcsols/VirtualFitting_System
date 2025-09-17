import styled from "styled-components";

interface PrataTextProps {
  color?: string;
  size?: string | number;
  $weight?: string | number;
  children: React.ReactNode;
}

function PrataText({ color, size, $weight, children }: PrataTextProps) {
  return (
    <PrataTextSpan color={color} size={size} $weight={$weight}>
      {children}
    </PrataTextSpan>
  );
}

export { PrataText };

const PrataTextSpan = styled.span<PrataTextProps>`
  font-family: "Prata-Regular";
  color: ${(props) => props.color || "#000"};
  font-size: ${(props) =>
    typeof props.size === "number" ? `${props.size}px` : props.size || "16px"};
  font-weight: ${(props) => props.$weight || "normal"};
`;
