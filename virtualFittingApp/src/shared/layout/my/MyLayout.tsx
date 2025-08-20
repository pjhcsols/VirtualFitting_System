import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { MYPAGE_GRADIENT } from "@/shared/styles/Theme";

function MyPageLayout() {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
}

export {MyPageLayout}

const Wrapper = styled.div`
  min-height: 100dvh;
  background: ${MYPAGE_GRADIENT};
  display: flex;
  flex-direction: column;
`;

