import { Color } from "@/shared";
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ProductInfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

export const ProductPhotoContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const ProductPhotoBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;

export const ProductPhoto = styled.img`
  width: 12vw;
  height: 15vw;
  border-radius: 8px;
`;

export const ProductSubPhoto = styled.img`
  width: 4vw;
  height: 5vw;
  border-radius: 4px;
`;

export const ProductInfoBox = styled.div`
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ProductTitleBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  .desc-text {
    font-family: "Pretendard";
    font-size: 1.2rem;
    font-weight: 600;
    color: black;
  }
`;

export const ProductPriceBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
  .desc-text {
    font-family: "Pretendard";
    font-size: 1.1rem;
    font-weight: 600;
    color: black;
  }
`;

export const ProductColorBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  .desc-text {
    font-family: "Pretendard";
    font-size: 0.8rem;
    font-weight: 600;
    color: black;
  }
`;

export const ProductColor = styled.div<{ color: Color }>``;

export const ProductSizeContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ProductSize = styled.div`
  width: 120px;
  height: 35px;
  border: 1px solid #121212;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Pretendard";
  font-size: 0.5rem;
  font-weight: 600;
  color: black;
  cursor: pointer;
`;

export const ProductButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  div {
    width: 160px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
`;

export const Divider = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 100%;
  background-color: gray;
`;
