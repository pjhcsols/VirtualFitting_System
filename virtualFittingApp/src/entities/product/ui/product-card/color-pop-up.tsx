import styled from "styled-components";
import { COLOR_MAP } from "@/shared";

type ColorPopupProps = {
  colors: string[];
  onClose: () => void;
};

export const ColorPopup = ({ colors, onClose }: ColorPopupProps) => {
  return (
    <PopupContainer onClick={(e) => {
      e.stopPropagation();
      onClose();
    }}>
      <Popup onClick={(e) => e.stopPropagation()}>
        <ColorList>
          {colors.map((color: string, index: number) => (
            <ColorItem key={index}>
              <ColorCircle $color={COLOR_MAP[color] ?? "transparent"} />
              <ColorName>{color}</ColorName>
            </ColorItem>
          ))}
        </ColorList>
      </Popup>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
  position: absolute;
  width: 80px;
  bottom: 8px;
  right: 16px;
  display: flex;
  flex-direction: column;
  z-index: 10;
  cursor: pointer;
`;

const Popup = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0.5em;
  width: 100%;
`;

const ColorList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ColorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
`;

const ColorCircle = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid rgba(255, 255, 255, 0.4);
`;

const ColorName = styled.span`
  font-size: 12px;
  font-family: 'Inter', sans-serif;
  color: white;
`;
