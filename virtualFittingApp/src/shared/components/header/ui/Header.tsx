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
        <HeaderContent onClick={() => router("/store")}>
          스토어
        </HeaderContent>
        <HeaderContent onClick={() => router("/shopping-cart")}>
          장바구니
        </HeaderContent>
        <HeaderContent onClick={() => router("/myPage")}>
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
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 50;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 24px;
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
  gap: 18px;
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