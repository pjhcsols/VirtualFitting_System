import { useNavigate } from "react-router-dom";
import styled from "styled-components";
function Header() {
  const router = useNavigate();

  return (
    <Wrapper>
      <LogoContainer>
        <LogoTitle onClick={() => router("/")}>
          Basilium
        </LogoTitle>
      </LogoContainer>
      <RouterList>
        <HeaderContent onClick={() => router("/shopping-cart")}>
          장바구니
        </HeaderContent>
        <HeaderContent>
          마이
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
  padding: 0 40px;
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #FFFFFF;
  z-index: 50;
  border-bottom: 0.5px solid black;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 28px;
  color: #000000;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  margin: 0;
  padding: 0;
`;

const RouterList = styled.ul`
  display: flex;
  align-items: center;
  gap: 24px; /* 메뉴 간격 */
`;

const HeaderContent = styled.li`
  list-style: none;
  font-family: "Prata-Regular";
  font-size: 14px;
  font-weight: 700;
  color: black;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export { Header };