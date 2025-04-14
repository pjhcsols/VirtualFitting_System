import styled from "styled-components";
import { ICON_BASILIUM } from "@/shared/constants";

export const Card = styled.div`
  width: 500px;
  height: 300px;
  transition: 0.5s all ease-out;
  color: #fff;
  cursor: pointer;
  @media (max-width: 1024px) {
    width: 400px;
    height: 240px;
  }
  @media (max-width: 768px) {
    width: 300px;
    height: 180px;
  }
`;

export const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export const CardFront = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px 30px;
  background: linear-gradient(to bottom, #292e49, #536976 50%, #bbd2c5 100%);
  box-shadow: gray 6px 6px 8px 0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-flow: column wrap;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const BasiliumLogo = styled.img.attrs({
  src: ICON_BASILIUM,
  alt: "basilium-icon",
})`
  width: 60px;
  height: 60px;
  @media (max-width: 1024px) {
    width: 40px;
    height: 40px;
  }
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

export const BasiliumText = styled.span`
  font-family: "Prata-Regular";
  font-size: 32px;
  color: white;
  text-transform: uppercase;
  @media (max-width: 1024px) {
    font-size: 16px;
  }
  @media (max-width: 768px) {
    font-size: 8px;
  }
`;

export const CardInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: "Prata-Regular";
  color: white;
  text-transform: uppercase;
  gap: 4px;
  .firm-text {
    font-size: 16px;
    @media (max-width: 1024px) {
      font-size: 12px;
    }
    @media (max-width: 768px) {
      font-size: 8px;
    }
  }
  .address-text {
    font-size: 14px;
    @media (max-width: 1024px) {
      font-size: 10px;
    }
    @media (max-width: 768px) {
      font-size: 7px;
    }
  }
`;
