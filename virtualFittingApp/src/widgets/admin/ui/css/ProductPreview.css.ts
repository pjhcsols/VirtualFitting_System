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
  flex-flow: row nowrap;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
`;

export const UploadedImageContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
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

export const ProductCategoryContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const SizeTable = styled.table`
  border-collapse: collapse;
  border: 0;
  color: black;
  th,
  td {
    border: 1px solid #aaa;
    background-clip: padding-box;
    scroll-snap-align: start;
  }
  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: 0;
  }
  thead {
    z-index: 1000;
    position: relative;
  }
  th,
  td {
    padding: 0.4rem;
    min-width: 5rem;
    text-align: center;
    margin: 0;
  }
  thead th {
    position: sticky;
    top: 0;
    border-top: 0;
    background-clip: padding-box;
  }
  thead th.pin {
    left: 0;
    z-index: 1001;
    border-left: 0;
  }
  tbody th {
    background-clip: padding-box;
    border-left: 0;
  }
  tbody {
    z-index: 10;
    position: relative;
  }
  tbody th {
    position: sticky;
    left: 0;
  }
  thead th,
  tbody th {
    background-color: #f8f8f8;
  }
`;
