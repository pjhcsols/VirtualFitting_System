import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.header`
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  padding: 40px 20px;
  width: 16rem;
  height: 100vh;
  transition: 0.5s all ease-out;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background: #ffffff;
  z-index: 1000;
  border-right: 0.5px solid black;
  box-shadow: 4px 0 4px 0 #d9d9d9;
`;

export const MenuContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    cursor: pointer;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.span`
  margin: 0;
  padding: 0;
  font-family: "Prata-Regular";
  font-size: 2em;
  color: black;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
`;

export const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

export const InfoTitle = styled.p`
  width: 100%;
  font-size: 0.8rem;
  font-weight: 500;
  color: #d9d9d9;
`;

export const Navigation = styled(NavLink)`
  width: 100%;
`;

export const InfoBox = styled.div<{ isActive: boolean }>`
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  border-radius: 8px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  transition: 0.15s all ease-out;
  background: ${(props) => (props.isActive ? "#121519" : "transparent")};
  span {
    color: ${(props) => (props.isActive ? "#fffafa" : "black")};
  }
  &:hover {
    background: ${(props) => !props.isActive && "#d9d9d9"};
  }
`;

export const InfoText = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: black;
`;
