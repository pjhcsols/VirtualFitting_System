import styled from "styled-components";
import { testFile } from "../test/test";
import { PretendardText } from "@/shared/components/common";
import { useState } from "react";

function AdminBrandManager() {
  const [clickedBrandUser, setClickedBrandUser] = useState<number>(-1);
  const onClickBrandUser = (idx: number) => {
    setClickedBrandUser(idx);
  };

  return (
    <Wrapper>
      <ListContainer>
        <TitleBox>
          <PretendardText size={"0.9rem"} weight={600}>
            승인 대기 중
          </PretendardText>
        </TitleBox>
        <DataBox>
          {testFile.data.map((item, key) => {
            return (
              <>
                <List key={key}>
                  <PretendardText>{item.emailAddress}</PretendardText>
                  <ButtonContainer>
                    <AcceptButton>
                      <CheckIcon />
                    </AcceptButton>
                    <RejectButton>
                      <XIcon />
                    </RejectButton>
                  </ButtonContainer>
                </List>
                <Divider />
              </>
            );
          })}
        </DataBox>
      </ListContainer>
      <ListContainer>
        <TitleBox>
          <PretendardText size={"0.9rem"} weight={600}>
            Brand User
          </PretendardText>
        </TitleBox>
        <DataBox>
          {testFile.data.map((item, key) => {
            return (
              <>
                <List
                  key={key}
                  clicked={clickedBrandUser === key}
                  onClick={() => onClickBrandUser(key)}
                >
                  <PretendardText>{item.emailAddress}</PretendardText>
                </List>
                <Divider />
              </>
            );
          })}
        </DataBox>
      </ListContainer>
    </Wrapper>
  );
}

export { AdminBrandManager };

function CheckIcon() {
  return (
    <svg
      fill="none"
      height="24"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      fill="none"
      height="24"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      viewBox="0 0 24 24"
      width="24"
    >
      <line x1="18" x2="6" y1="6" y2="18" />
      <line x1="6" x2="18" y1="6" y2="18" />
    </svg>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ListContainer = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  min-width: 30rem;
  min-height: 30rem;
  border-radius: 1rem;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: #fffafa;
`;

const TitleBox = styled.div`
  position: relative;
  width: 100%;
  min-height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DataBox = styled.div`
  width: 100%;
  height: 100%;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: scroll;
  gap: 0.5rem;
`;

const List = styled.div<{ clicked?: boolean }>`
  margin: 0.5rem 0;
  box-sizing: border-box;
  padding: 0.4rem;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.25rem;
  background-color: ${(props) => (props.clicked ? "#e9e9e9" : "transparent")};
  transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: scale(1.01);
    background-color: #eeeeee;
  }
  &:after {
    transform: scale(0.98);
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 0.1rem;
  border-radius: 100%;
  background-color: #d9d9d9;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ButtonDefault = styled.div`
  min-width: 2rem;
  min-height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const AcceptButton = styled(ButtonDefault)`
  background-color: #7adaa5;
  transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: scale(1.05);
    background-color: #51d78e;
  }
`;

const RejectButton = styled(ButtonDefault)`
  background-color: #ffb4b4;
  transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    transform: scale(1.05);
    background-color: #ff9e9e;
  }
`;
