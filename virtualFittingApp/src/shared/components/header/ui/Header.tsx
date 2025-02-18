import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function Header() {
  const router = useNavigate();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const scrollEvent = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", scrollEvent);
    return () => {
      window.removeEventListener("scroll", scrollEvent);
    };
  }, []);

  return (
    <Wrapper scrolled={isScrolled}>
      <LogoContainer>
        <LogoTitle scrolled={isScrolled} onClick={() => router("/")}>
          Basilium
        </LogoTitle>
      </LogoContainer>
      <RouterList>
        <HeaderContent>Cart</HeaderContent>
        <HeaderContent>Liked</HeaderContent>
      </RouterList>
    </Wrapper>
  );
}

const Wrapper = styled.header<{ scrolled: boolean }>`
  box-sizing: border-box;
  position: sticky;
  top: 0;
  left: 0;
  padding: 10px 140px;
  width: 100%;
  height: ${(props) => (props.scrolled ? "50px" : "100px")};
  display: flex;
  flex-flow: row nowrap;
  transition: 0.25s all ease-in-out;
  transform-origin: top;
  justify-content: space-between;
  align-items: center;
  background: ${(props) =>
    props.scrolled ? "linear-gradient(to right, #141E30, #060207)" : "#141E30"};
  z-index: 50;
  box-shadow: 8px 8px 12px 0px rgba(0, 0, 0, 0.25);
`;

const HeaderBox = styled.div<{ scrolled: boolean }>`
  position: sticky;
  top: 0;
  left: 0;
  padding: 10px 140px;
  width: 100%;
  height: ${(props) => (props.scrolled ? "50px" : "100px")};
  display: flex;
  flex-flow: row nowrap;
  transition: 0.25s all ease-out;
  transform-origin: top;
  justify-content: space-between;
  align-items: center;
  background: ${(props) =>
    props.scrolled ? "linear-gradient(to right, #141E30, #060207)" : "#141E30"};
  z-index: 50;
`;

const LogoContainer = styled.div`
  width: 200px;
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LogoTitle = styled.h1<{ scrolled: boolean }>`
  font-family: "Prata-Regular";
  font-size: ${(props) => (props.scrolled ? "1em" : "2em")};
  color: #fffafa;
  text-transform: uppercase;
  cursor: pointer;
  transform-origin: left;
  transition: 0.5s all ease-in-out;
`;

const RouterList = styled.ul`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const HeaderContent = styled.li`
  list-style: none;
  font-family: "Prata-Regular";
  font-size: 1vw;
  font-weight: 700;
  color: white;
  cursor: pointer;
`;

export { Header };
