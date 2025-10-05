import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 0 140px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const OptionContainer = styled.div`
  box-sizing: border-box;
  padding: 0 0 16px 0;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
  .blue-text {
    font-size: 20px;
    font-weight: 600;
    color: #0991ebff;
  }
  .text {
    font-size: 20px;
    font-weight: 500;
    color: black;
  }
`;

export const OptionBox = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 8px;
`;

export const ProductContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const ProductCreateButton = styled(NavLink)`
  width: 120px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background-color: #333d51;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #444f65;
  }
  span {
    font-size: 16px;
    font-weight: 500;
    color: white;
  }
`;
