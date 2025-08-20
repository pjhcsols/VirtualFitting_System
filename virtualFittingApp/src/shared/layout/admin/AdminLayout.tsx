import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { AdminHeader } from "@/shared/components";

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
  padding: 1rem;
  max-width: 100vw;
  min-height: 100vh;
  background-color: #e7e8ea;
  overflow: hidden;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`;

const AdminContentContainer = styled.article`
  box-sizing: border-box;
  padding: 2rem 5rem;
  width: 100%;

  @media (max-width: 1280px) {
    padding: 0 4rem;
  }

  @media (max-width: 1024px) {
    padding: 0 3rem;
  }

  @media (max-width: 768px) {
    padding: 0 2rem;
  }

  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

export { AdminLayout };
