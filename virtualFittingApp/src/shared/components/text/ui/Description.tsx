import React from "react";
import styled from "styled-components";

type DescriptionType = {
  children: React.ReactNode;
  isDark?: boolean;
};

function Description({ children, isDark = false }: DescriptionType) {
  return <DescriptionWrapper isDark={isDark}>{children}</DescriptionWrapper>;
}

export { Description };

const DescriptionWrapper = styled.span<{ isDark: boolean }>`
  font-family: "Pretendard";
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => (props.isDark ? "#fffafa" : "black")};
`;
