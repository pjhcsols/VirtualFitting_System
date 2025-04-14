import styled from "styled-components";

export const Wrapper = styled.header<{ isScrolled: boolean }>`
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  padding: 0px 40px;
  width: 100%;
  height: ${(props) => (props.isScrolled ? "60px" : "80px")};
  transition: 0.5s all ease-out;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: #ffffff;
  z-index: 50;
  border-bottom: 0.5px solid black;
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

export const MENU_ICON = styled.img.attrs({ width: 24, height: 24 })``;
