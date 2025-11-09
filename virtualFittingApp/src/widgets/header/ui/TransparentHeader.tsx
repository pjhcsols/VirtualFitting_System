import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import { useRecoilState } from 'recoil';
import { authState } from '@/entities/auth';

type TransparentHeaderProps = { 
  $sticky?: boolean;
  onAboutScroll?: () => void;
  onServiceScroll?: () => void;
  onSolutionScroll?: () => void;
}

export function TransparentHeader({ $sticky = true, onAboutScroll, onServiceScroll, onSolutionScroll }: TransparentHeaderProps) {
  const router = useNavigate();
  const location = useLocation();
  const [{ isLoggedIn }, setAuthState] = useRecoilState(authState);

  const isMainPage = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      const scrolledPastThreshold = currentScrollY > 100; 
      if (scrolledPastThreshold !== isScrolled) {
        setIsScrolled(scrolledPastThreshold);
      }

      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;

      if (scrollingDown && scrolledPastThreshold) {
        setIsVisible(false);
      } else if (scrollingUp || currentScrollY < 50) {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled, isVisible]); 

  const handleLogout = () => {
    setAuthState({ isLoggedIn: false, userId: null });
    document.cookie = "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router("/");
  };

 const MainNav = (
    <RouterList isCenter={true}>
      <li>
        <StyledHeaderButton onClick={onAboutScroll}>
          About
        </StyledHeaderButton>
      </li>
      <li>
        <StyledHeaderButton onClick={onServiceScroll}>
          Services
        </StyledHeaderButton>
      </li>
      <li>
        <StyledHeaderButton onClick={onSolutionScroll}>
          SaaS
        </StyledHeaderButton>
      </li>
    </RouterList>
  );

  const ShopNav = (
    <RouterList>
      <li>
        <StyledNavLink to="/products">
          Store
        </StyledNavLink>
      </li>
      <li>
        <CartLinkWrapper>
          <StyledNavLink to="/cart">
            Cart
          </StyledNavLink>
        </CartLinkWrapper>
      </li>
      {isLoggedIn ? (
        <>
          <li>
            <StyledNavLink to="/mypage">
              MyPage
            </StyledNavLink>
          </li>
          <li>
            <StyledHeaderButton as="button" onClick={handleLogout}>
              Logout
            </StyledHeaderButton>
          </li>
        </>
      ) : (
        <li>
          <StyledNavLink to="/login">
            Login
          </StyledNavLink>
        </li>
      )}
    </RouterList>
  );

  return (
    <Wrapper $sticky={$sticky} $isScrolled={isScrolled} $isVisible={isVisible} $isMainPage={isMainPage}>
      <LogoContainer onClick={() => router("/")}>
        <LogoTitle>Basilium</LogoTitle>
      </LogoContainer>
      
      {/* 💡 NavContentWrapper 내부에 두 개의 nav 컨테이너를 항상 배치 */}
      <NavContentWrapper>
          <nav> 
              {/* 💡 MainNav은 isMainPage일 때만 내용 렌더링 */}
              {isMainPage && MainNav}
          </nav>
          <nav>
              {ShopNav} {/* ShopNav은 항상 오른쪽에 붙어있습니다. */}
          </nav>
      </NavContentWrapper>

    </Wrapper>
  );
}

const SharedLinkButtonStyles = css`
  background: none;
  border: none;
  padding: 4px 2px;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none; 
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s ease;
  cursor: pointer;

  &:hover {
    color: rgb(255, 255, 255);
  }
  
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
  &:hover::after, &.active::after {
    transform: scaleX(1);
  }
  &.active {
    color: rgb(255, 255, 255);
  }
`;

const Wrapper = styled.header<{ $sticky?: boolean; $isScrolled: boolean; $isVisible: boolean; $isMainPage: boolean }>`
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 64px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  background: transparent;
  border-bottom: 1px solid ${props => props.$isScrolled ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  backdrop-filter: saturate(100%) blur(20px);
  -webkit-backdrop-filter: saturate(100%) blur(20px);
  
  z-index: 50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  transform: translateY(${props => props.$isVisible ? '0' : '-100%'});
  transition: 
    background 0.3s ease, 
    border-bottom 0.3s ease, 
    transform 0.3s ease;
`;

const NavContentWrapper = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between; 
  align-items: center;
  margin-left: 32px;
  & > nav:first-child {
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 32px;
`;

const LogoTitle = styled.h1`
  font-family: "Prata-Regular";
  font-size: 20px;
  text-transform: uppercase;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  
  color: #ffffff;
  transition: color 0.3s ease;
`;

const RouterList = styled.ul<{ isCenter?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isCenter ? '40px' : '20px'}; 
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledHeaderButton = styled.button`
  background: none;
  border: none;
  padding: 4px 2px;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  cursor: none;
  text-decoration: none; 
  color: rgba(255, 255, 255, 0.85);
  transition: color 0.3s ease;

  &:hover {
    color: rgb(255, 255, 255);
  }
  
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
  &:hover::after {
    transform: scaleX(1);
  }
`;


const StyledNavLink = styled(NavLink)`
  ${SharedLinkButtonStyles}
`;

const CartLinkWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;