import styled from "styled-components";

type ColorPopupProps = {
  colors: any;
  onClose: () => void;
};

export const ColorPopup = ({ colors, onClose }: ColorPopupProps) => {
  return (
    <PopupContainer onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}>
        <Popup
        //   onClick={(e) => e.stopPropagation()}
        >
        <ColorList>
          {colors.map((color: string, index: number) => (
            <ColorItem key={index}>
              <ColorCircle $color={color} />
              <ColorName>black</ColorName>
            </ColorItem>
          ))}
        </ColorList>
      </Popup>
    </PopupContainer>
  );
};

const PopupContainer = styled.div`
  position: absolute;
  bottom: 8px;
  right: 16px;
  background: white;
  display: flex;
  flex-direction: column;
  z-index: 10;
  cursor: pointer;
  background-color: white;
`;

const Popup = styled.div`
  background-color: white;
  padding: 0.5em 0.5em;
  border: 1px solid black;
  width: 80%;
`;

const ColorList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ColorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
`;

const ColorCircle = styled.div<{ $color: string }>`
  width: 0.75em;
  height: 0.75em;
  border-radius: 50%;
  background-color: ${(props) => props.$color};
  border: 1px solid black;
`;

const ColorName = styled.span`
  font-size: 0.75em;
  font-family: 'Inter', sans-serif;
  color: black;
`;
