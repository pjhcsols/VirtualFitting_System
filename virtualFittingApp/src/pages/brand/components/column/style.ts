import styled from "styled-components";

export const Wrapper = styled.div<{ clicked: boolean }>`
  box-sizing: border-box;
  padding: 16px 48px;
  height: ${(props) => (props.clicked ? "140px" : "100px")};
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  transition: 0.2s all ease-out;
  border-bottom: 1px solid #c8c8c8;
`;

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  z-index: 0;
`;

export const Photo = styled.img`
  width: 80px;
  aspect-ratio: 4/5;
  object-fit: contain;
  border-radius: 8px;
`;

export const ProductTitle = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: black;
`;

export const Arrow = styled.div<{ clicked: boolean }>`
  width: 36px;
  height: 36px;
  z-index: 10;
  transition: 0.2s all ease-out;
  transform: ${(props) => props.clicked && "rotateX(90)"};
`;
