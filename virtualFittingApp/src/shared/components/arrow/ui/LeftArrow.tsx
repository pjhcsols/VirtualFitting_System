import { ICON_LEFT_ARROW } from "@/shared/constants";
import styled from "styled-components";

type LeftArrowType = {
  onClick?: () => void;
};

function LeftArrow({ onClick }: LeftArrowType) {
  return (
    <ArrowContainer onClick={onClick}>
      <Arrow src={ICON_LEFT_ARROW} alt="left-arrow" />
    </ArrowContainer>
  );
}

export { LeftArrow };

export const ArrowContainer = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #121212;
  border-radius: 100%;
  overflow: hidden;
  cursor: pointer;
  z-index: 10;
`;

export const Arrow = styled.img`
  width: 15px;
  height: 15px;
  object-fit: contain;
  transition: 0.3s all ease-out;
  &:hover {
    transform: scale(1.05);
  }
`;
