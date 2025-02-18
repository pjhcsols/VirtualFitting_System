import styled from "styled-components";
import { StoreDetailHeaderContent } from "../constants";

function DetailDescription() {
  return (
    <Wrapper>
      <DescriptionHeader>
        {StoreDetailHeaderContent.map((item, key) => {
          return <HeaderContent key={key}>{item.title}</HeaderContent>;
        })}
      </DescriptionHeader>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const DescriptionHeader = styled.ul`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  & > :not(:last-child) {
    border-inline-start-width: 0px;
    border-inline-end-width: 1px;
  }
`;

const HeaderContent = styled.li`
  padding: 30px 0px;
  width: 25%;
  text-align: center;
  font-family: "StudioSans";
  font-size: 1vw;
  font-weight: 600;
  list-style: none;
  color: black;
  transition: background 0.25s ease-out;
  border-radius: 8px;
  &:hover {
    background: #f5f5f5;
  }
`;

export { DetailDescription };
