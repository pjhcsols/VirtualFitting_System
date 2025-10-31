import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useCookies } from 'react-cookie';
import { useCartPeekQuery } from "@/entities/cart";

type HeaderProps = { 
  theme?: 'light' | 'dark';
  $sticky?: boolean;
}

function Header({ theme = 'light', $sticky = true }: HeaderProps) {
  const router = useNavigate();
  const [cookies] = useCookies(['access-token']);
  const accessToken = cookies['access-token'];
  const { data: cartItemCount = 0 } = useCartPeekQuery(accessToken);

  return (
    <Wrapper theme={theme} $sticky={$sticky} >
      <LogoContainer onClick={() => router("/")}>
        <LogoTitle theme={theme}>Basilium</LogoTitle>
      </LogoContainer>
      <nav>
        <RouterList>
          <li>
            <HeaderContent to="/products" theme={theme}>
              스토어
            </HeaderContent>
          </li>
          <li>
            <CartLinkWrapper>
              <HeaderContent to="/cart" theme={theme}>
                장바구니
              </HeaderContent>
              {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
            </CartLinkWrapper>
          </li>
          <li>
            <HeaderContent to="/mypage" theme={theme}>
              마이
            </HeaderContent>
          </li>
        </RouterList>
      </nav>
    </Wrapper>
  );
}


const Wrapper = styled.header<{ $sticky?: boolean; }>`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 48px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  background: ${props => props.theme === 'dark' ? 'rgba(41, 46, 73, 0.85)' : 'transparent'};
  
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  
  border-bottom: 1px solid ${props => props.theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  z-index: 50;
  
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const LogoTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 20px;
  text-transform: uppercase;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  
  color: ${props => props.theme === 'dark' ? '#ffffff' : '#ffffff'};
  transition: color 0.3s ease;
`;

const RouterList = styled.ul`
  display: flex;
  align-items: center;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const HeaderContent = styled(NavLink)`
  background: none;
  border: none;
  padding: 4px 2px;
  position: relative;
  
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;

  text-decoration: none; 
  
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-color: rgb(255, 255, 255);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.3s ease-out;
  }

  &:hover {
    color: rgb(255, 255, 255);
  }

  &:hover::after {
    transform: scaleX(1);
  }

  &.active {
    color: rgb(255, 255, 255);
  }

  &.active::after {
    transform: scaleX(1);
  }
`;

const CartLinkWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -12px;
  background-color: #ff4d4d;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  font-weight: bold;
  pointer-events: none;
`;

export { Header };