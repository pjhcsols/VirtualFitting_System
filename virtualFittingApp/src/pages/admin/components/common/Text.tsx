import React from "react";
import styled from "styled-components";

function Text({ children }: { children: React.ReactNode }) {
  return <TextSpan>{children}</TextSpan>;
}

function BlackText({ children }: { children: React.ReactNode }) {
  return <BlackTextSpan>{children}</BlackTextSpan>;
}

function BlueText({ children }: { children: React.ReactNode }) {
  return <BlueTextSpan>{children}</BlueTextSpan>;
}

export { Text, BlackText, BlueText };

const TextSpan = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: #787878;
`;

const BlackTextSpan = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: black;
`;

const BlueTextSpan = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #34b9ed;
`;
