import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { MYPAGE_GRADIENT } from "@/shared/styles/Theme";
import { Header } from "@/widgets/header";
import { Starfield } from "@/shared/components/star/StarField";

function MyPageLayout() {
  return (
    <Wrapper>
      <Starfield />
      <Header theme="dark" /> 
      <Outlet />
    </Wrapper>
  );
}

export { MyPageLayout }

const Wrapper = styled.div`
  min-height: 100vh;
  background: ${MYPAGE_GRADIENT};
  display: flex;
  flex-direction: column;
`;

