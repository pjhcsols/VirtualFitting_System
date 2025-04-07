import React from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useNavigate } from "react-router-dom";

function MyLike() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="좋아요" />
      </HeaderWrapper>
    </PageWrapper>
  );
}

export { MyLike };

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100vh;
`;

const HeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Divider = styled.hr`
  margin: 16px 0;
  border: none;
  height: 1px;
  background-color: #e5e5e5;
  width: 550px;
`;