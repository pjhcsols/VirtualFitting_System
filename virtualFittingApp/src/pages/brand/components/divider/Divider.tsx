import styled from "styled-components";

function Divider() {
  return <DividerComponent />;
}

export { Divider };

export const DividerComponent = styled.div`
  width: 100%;
  height: 2px;
  border-radius: 1000px;
  background: #d9d9d9 5%;
`;
