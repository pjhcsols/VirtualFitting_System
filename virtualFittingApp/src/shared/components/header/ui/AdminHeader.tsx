import { Link } from "react-router-dom";
import styled from "styled-components";
import { AdminHeaderContent } from "../constants";

function AdminHeader() {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>Basilium</Title>
      </TitleWrapper>
      <NavContainer>
        {AdminHeaderContent.map((item, key) => {
          return (
            <ListComponent
              to={item.href === "logout" ? "/" : `/admin/${item.href}`}
              key={key}
            >
              {item.title}
            </ListComponent>
          );
        })}
      </NavContainer>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  box-sizing: border-box;
  padding: 60px 20px;
  position: fixed;
  left: 0;
  top: 0;
  min-width: 75px;
  width: 12rem;
  max-height: 100vh;
  min-height: 100vh;
  height: 100vh;
  border-radius: 0px 32px 32px 0px;
  background: linear-gradient(to bottom, #141e30, #060207);
`;

const Title = styled.h1`
  font-family: "Prata-Regular";
  font-size: 1em;
  color: white;
  text-transform: uppercase;
`;

const TitleWrapper = styled.div`
  width: 100%;
  height: 100px;
`;

const NavContainer = styled.nav`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const ListComponent = styled(Link)`
  padding: 32px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2px;
  font-family: "Prata-Regular";
  font-size: 0.75em;
  color: white;
`;

export { AdminHeader };
