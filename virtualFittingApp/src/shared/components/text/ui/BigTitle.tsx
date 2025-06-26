import React from "react";
import styled from "styled-components";

type BigTitleType = {
  children: React.ReactNode;
};

function BigTitle({ children }: BigTitleType) {
  return <BigTitleWrapper>{children}</BigTitleWrapper>;
}

export { BigTitle };

const BigTitleWrapper = styled.span`
  font-family: "Pretendard";
  font-size: 2rem;
  font-weight: 800;
  color: black;
`;
