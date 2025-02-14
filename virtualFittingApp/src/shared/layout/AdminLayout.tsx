import styled from "styled-components";
import { AdminHeader } from "../components/header/ui/AdminHeader";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <Wrapper>
      <AdminHeader />
      <AdminContentContainer>
        <Outlet />
      </AdminContentContainer>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  box-sizing: border-box;
  max-width: 100vw;
  min-height: 100vh;
  background-color: #fffafa;
  overflow: hidden;
`;

const AdminContentContainer = styled.article`
  box-sizing: border-box;
  margin-left: calc(12rem);
  width: calc(100%-12rem);
`;

export { AdminLayout };
