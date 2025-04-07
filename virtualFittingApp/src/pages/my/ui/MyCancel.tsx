import React from "react";
import styled from "styled-components";
import { MyHeader } from "@/shared/components/header";
import { useNavigate } from "react-router-dom";

function MyCancel() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <HeaderWrapper>
        <MyHeader title="취소/반품/교환 내역" />
      </HeaderWrapper>
    </PageWrapper>
  );
}

export { MyCancel };

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