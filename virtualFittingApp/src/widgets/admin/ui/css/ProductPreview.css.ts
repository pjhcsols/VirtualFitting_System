import styled from "styled-components";
import { blackColorCode } from "@/widgets/admin/constants";

export const Wrapper = styled.div`
  z-index: 10;
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: start;
`;

export const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

export const Image = styled.img<{ hv: string }>`
  min-width: 20vw;
  width: 100%;
  height: ${(props) => props.hv ?? "20vh"};
  min-height: 8vh;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
`;

export const NoImage = styled.div<{ hv: string }>`
  width: 100%;
  min-width: 20vw;
  height: ${(props) => props.hv ?? "20vh"};
  min-height: 8vh;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  background-color: gray;
`;

export const ImageBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

export const SubImages = styled.img`
  width: 6vw;
  height: 7.5vw;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  overflow-x: auto;

  /* Firefox Web Browser */
  scrollbar-width: none;

  /* Chrome, Safari Web Browser */
  &::-webkit-scrollbar {
    display: none;
  }
  & > * {
    flex-shrink: 0;
  }
`;

export const ProductInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const ProductTitleBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.8rem;
    font-weight: 600;
    color: black;
  }
  .name-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  .price-text {
    font-family: "Pretendard";
    font-size: 1.25rem;
    font-weight: 500;
    color: black;
  }
  .desc-text {
    font-family: "Pretendard";
    font-size: 1.1rem;
    font-weight: 500;
    color: black;
  }
`;

export const ProductOptionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const ProductPallete = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
`;

export const ColorDot = styled.div<{ color: string }>`
  transition: 0.15s all ease-out;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  border: 1px solid black;
  background-color: ${(props) => props.color ?? blackColorCode};
`;

export const ProductMaterial = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;

  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
  .material-container {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    gap: 4px;
  }
`;

export const Material = styled.div<{ clicked: boolean }>`
  transition: 0.3s all ease-out;
  box-sizing: border-box;
  padding: 12px 20px;
  min-width: 100px;
  height: 32px;
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid black;
  background-color: ${(props) => (props.clicked ? "black" : "white")};
  color: ${(props) => (props.clicked ? "white" : "black")};
`;

export const ProductSizeTableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  .title-text {
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
  }
`;

export const ProductTable = styled.table``;

export const ProductTableTitle = styled.thead``;

export const ProductTableBody = styled.tbody``;

export const ProductTableColumn = styled.td``;

export const ProductTableSize = styled.div`
  li a {
    text-decoration: none;
    color: #2d2f31;
  }

  nav {
    width: 300px;
    background: #d9d9d9;
    margin: 40px auto;
  }

  span {
    padding: 30px;
    background: #2d2f31;
    color: white;
    font-size: 1.2em;
    font-variant: small-caps;
    cursor: pointer;
    display: block;
  }

  span::after {
    float: right;
    right: 10%;
    content: "+";
  }

  .slide {
    clear: both;
    width: 100%;
    height: 0px;
    overflow: hidden;
    text-align: center;
    transition: height 0.4s ease;
  }

  .slide li {
    padding: 30px;
  }

  #touch {
    position: absolute;
    opacity: 0;
    height: 0px;
  }

  #touch:checked + .slide {
    height: 300px;
  }
`;

export const ProductCategoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;
