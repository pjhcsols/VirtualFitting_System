import { NavLink } from "react-router-dom";
import styled from "styled-components";
import t_shirt from "@/assets/png/tshirt/Tshirt3D.png";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 40px 400px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

export const SubTitle = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: black;
`;

export const ContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

export const SignUpGuideContainer = styled(NavLink)`
  position: relative;
  box-sizing: border-box;
  padding: 16px 40px;
  max-width: 560px;
  min-width: 400px;
  min-height: 80px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 8px;
  border: 1px solid #111111;
  transition: 0.2s all ease-out;
  background-color: transparent;
  overflow: hidden;
  &:hover {
    transform: scale(1.01);
    background-color: #f1f1f1ff;
  }
  .title {
    font-size: 20px;
    font-weight: 600;
    color: black;
  }
  .desc {
    font-size: 12px;
    font-weight: 400;
    color: black;
  }
`;

export const TShirt = styled.img.attrs({ src: t_shirt, alt: "t-shirt" })`
  position: absolute;
  width: 120px;
  height: 120px;
  right: 0;
  top: 0;
  object-fit: contain;
`;
