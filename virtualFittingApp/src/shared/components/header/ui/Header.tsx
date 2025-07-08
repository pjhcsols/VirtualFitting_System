import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ICON_BAG, ICON_USER, ICON_MENU } from "@/shared";
function Header() {
  const router = useNavigate();

  return (
    <Wrapper>
      <MenuContainer>
        <img src={ICON_MENU} alt="Menu" width={24} height={24} />
      </MenuContainer>
      <LogoContainer>
        <LogoTitle onClick={() => router("/")}>
          Basilium
        </LogoTitle>
      </LogoContainer>

      <RouterList>
        <HeaderContent>
          <img src={ICON_BAG} alt="Cart" width={24} height={24} />
        </HeaderContent>
        <HeaderContent>
          <img src={ICON_USER} alt="User" width={40} height={40} />
        </HeaderContent>
      </RouterList>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  padding: 0px 40px;
  width: 100%;
  height: 80px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: #FFFFFF;
  z-index: 50;
  border-bottom: 0.5px solid black;
`;


const MenuContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  img {
    cursor: pointer;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 2em;
  color: #000000;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  margin: 0;
  padding: 0;
`;

const RouterList = styled.ul`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

const HeaderContent = styled.li`
  list-style: none;
  font-family: "Prata-Regular";
  font-size: 1vw;
  font-weight: 700;
  color: black;
  cursor: pointer;
`;

export { Header };
