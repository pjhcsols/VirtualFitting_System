import React from "react";
import styled from "styled-components";

function Title({ children }: { children: React.ReactNode }) {
  return <TitleSpan>{children}</TitleSpan>;
}

export { Title };

const TitleSpan = styled.span`
  font-size: 1.8rem;
  font-weight: 700;
  color: black;
`;
