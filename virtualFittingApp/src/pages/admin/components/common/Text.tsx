import React from "react";
import styled from "styled-components";

function Text({ children }: { children: React.ReactNode }) {
  return <TextSpan>{children}</TextSpan>;
}

export { Text };

const TextSpan = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #787878;
`;
