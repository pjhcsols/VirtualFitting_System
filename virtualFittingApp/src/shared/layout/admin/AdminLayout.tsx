import styled from "styled-components";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <Wrapper>
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
  padding: 0 10rem;
  width: calc(100%-10rem);

  @media (max-width: 1280px) {
    padding: 0 9rem;
  }

  @media (max-width: 1024px) {
    padding: 0 7rem;
  }

  @media (max-width: 768px) {
    padding: 0 5rem;
  }

  @media (max-width: 640px) {
    padding: 0 4rem;
  }
`;

export { AdminLayout };
