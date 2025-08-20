import { PretendardText } from "@/shared/components/common";
import { useState } from "react";
import styled from "styled-components";

function MainNavigator() {
  const [active, setActive] = useState<number>(0);

  const pageSectionContent = ["01", "02", "03", "04", "05"];

  const handleClick = (index: number) => {
    setActive(index);
    window.scrollTo({
      top: window.innerHeight * index,
      behavior: "smooth",
    });
  };

  return (
    <Wrapper>
      {pageSectionContent.map((item, key) => {
        return (
          <ContentBox active={key === active} onClick={() => handleClick(key)}>
            <PretendardText key={key}>{item}</PretendardText>
          </ContentBox>
        );
      })}
    </Wrapper>
  );
}

export { MainNavigator };

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  min-width: 10rem;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  z-index: 20;
`;

const ContentBox = styled.div<{ active: boolean }>`
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  transition: 0.15s all ease;
  background-color: ${(props) => props.active && "#fff"};
  &:hover {
    background-color: #d9d9d9;
  }
`;
