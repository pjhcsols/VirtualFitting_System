import React from "react";
import styled from "styled-components";

type TitleType = {
  children: React.ReactNode;
  isDark?: boolean;
};

function Title({ children, isDark = false }: TitleType) {
  return <TitleWrapper isDark={isDark}>{children}</TitleWrapper>;
}

export { Title };

const TitleWrapper = styled.span<{ isDark: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => (props.isDark ? "#fffafa" : "#121212")};
`;
