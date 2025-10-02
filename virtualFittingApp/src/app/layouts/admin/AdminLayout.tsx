import styled from "styled-components";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminHeader } from "@/widgets/admin-header";
import { LogOut } from "lucide-react";
import { logout } from "@/shared/api/auth.api";

function AdminLayout() {
  const navigate = useNavigate();
  const onClickLogout = async () => {
    const res = await logout();
    if (res) {
      alert("로그아웃되었습니다.");
      navigate("/");
    }
  };
  return (
    <Wrapper>
      <AdminHeader />
      <AdminContentContainer>
        <Outlet />
      </AdminContentContainer>
      <LogoutButtonContainer onClick={onClickLogout}>
        <LogOut size={16} color="black" />
      </LogoutButtonContainer>
    </Wrapper>
  );
}

const Wrapper = styled.main`
  box-sizing: border-box;
  position: relative;
  max-width: 100vw;
  min-height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
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

const LogoutButtonContainer = styled.div`
  position: fixed;
  bottom: 5rem;
  right: 5rem;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 100%;
  transition: 0.2s all ease-out;
  &:hover {
    background-color: #c8c8c8;
  }
`;

export { AdminLayout };
