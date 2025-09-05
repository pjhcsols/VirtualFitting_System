import { useState, useEffect } from "react";
import styled from "styled-components";

function MainNavigator() {
  const [active, setActive] = useState<number>(0);
  
  const sectionCount = 5;

  const handleClick = (index: number) => {
    window.scrollTo({
      top: window.innerHeight * index,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const currentSection = Math.round(scrollPosition / windowHeight);
      setActive(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Wrapper>
      {Array.from({ length: sectionCount }).map((_, index) => (
        <DotWrapper key={index} onClick={() => handleClick(index)}>
          <Dot active={index === active} />
        </DotWrapper>
      ))}
    </Wrapper>
  );
}

export { MainNavigator };

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 1.5rem;
  z-index: 20;
`;

const DotWrapper = styled.div`
  cursor: pointer;

  &:hover div {
    transform: scale(1.2);
  }
`;

const Dot = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.35)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  transition: all 0.3s ease;
  transform: scale(${props => props.active ? 1.2 : 1});
`;