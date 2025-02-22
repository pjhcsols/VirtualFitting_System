import styled from "styled-components";
import { StoreDetailHeaderContent } from "@/widgets/store/constants";
import { useState } from "react";

function DetailDescription() {
  const [selectedOption, setSelectedOption] = useState<number>(1);
  return (
    <Wrapper>
      <DescriptionHeader>
        {StoreDetailHeaderContent.map((item, key) => {
          return (
            <HeaderContent key={key} onClick={() => setSelectedOption(key)}>
              {item.title}
            </HeaderContent>
          );
        })}
      </DescriptionHeader>
      <OptionContentContainer>
        <OptionContentTitle>
          {StoreDetailHeaderContent[selectedOption].subtitle ?? ""}
        </OptionContentTitle>
        <OptionContent>
          {StoreDetailHeaderContent[selectedOption].content}
        </OptionContent>
      </OptionContentContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
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

const OptionContentContainer = styled.div`
  box-sizing: border-box;
  padding: 30px 120px;
  text-align: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
`;

const OptionContentTitle = styled.span`
  font-family: "pretendard";
  font-size: 2vw;
  font-weight: 900;
  color: black;
`;

const OptionContent = styled(OptionContentTitle)`
  font-size: 0.9vw;
  font-weight: 400;
  color: black;
`;

export { DetailDescription };
