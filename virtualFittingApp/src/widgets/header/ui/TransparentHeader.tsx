import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import { useRecoilState } from 'recoil';
import { authState } from '@/entities/auth';

type TransparentHeaderProps = { 
  $sticky?: boolean;
}

export function TransparentHeader({ $sticky = true }: TransparentHeaderProps) {
  const router = useNavigate();
  const [{ isLoggedIn }, setAuthState] = useRecoilState(authState);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrolledPastThreshold = currentScrollY > 100;
      setIsScrolled(scrolledPastThreshold);

      if (currentScrollY > lastScrollY.current && scrolledPastThreshold) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setAuthState({ isLoggedIn: false, userId: null });
    document.cookie = "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router("/");
  };

  return (
    <Wrapper $sticky={$sticky} $isScrolled={isScrolled} $isVisible={isVisible} $isMainPage={false}>
      <LogoContainer onClick={() => router("/")}>
        <LogoTitle>Basilium</LogoTitle>
      </LogoContainer>

      <NavContentWrapper>
        <nav>
          <RouterList $isCenter={true}>
            <li>
              <StyledNavLink to="/about">About</StyledNavLink>
            </li>
            <li>
              <StyledNavLink to="/service">Services</StyledNavLink>
            </li>
            <li>
              <StyledNavLink to="/saas">SaaS</StyledNavLink>
            </li>
          </RouterList>
        </nav>

        <nav>
          <RouterList>
            <li>
              <StyledNavLink to="/products">Store</StyledNavLink>
            </li>
            <li>
              <CartLinkWrapper>
                <StyledNavLink to="/cart">Cart</StyledNavLink>
              </CartLinkWrapper>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <StyledNavLink to="/mypage">My</StyledNavLink>
                </li>
                <li>
                  <StyledHeaderButton as="button" onClick={handleLogout}>
                    Logout
                  </StyledHeaderButton>
                </li>
              </>
            ) : (
              <li>
                <StyledNavLink to="/login">Login</StyledNavLink>
              </li>
            )}
          </RouterList>
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

const RouterList = styled.ul<{ $isCenter?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$isCenter ? '40px' : '20px'}; 
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
