import styled from 'styled-components';
import { COLOR_MAP } from "@/shared";

type ColorListProps = {
  colors: string[];
};

export const ColorSwatchesList = ({ colors }: ColorListProps) => {
  return (
    <ColorList>
      {colors.map((color: string, index: number) => (
        <ColorItem key={index}>
          <ColorCircle $color={COLOR_MAP[color] ?? "transparent"} />
        </ColorItem>
      ))}
    </ColorList>
  );
};

const ColorList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
`;

const ColorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
`;

const ColorCircle = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid #d5d5d5;
`;
