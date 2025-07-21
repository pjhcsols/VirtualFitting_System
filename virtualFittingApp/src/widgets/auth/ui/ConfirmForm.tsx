import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import { useTermsOfUse } from "../hooks/useTermsOfUse";

type ConfirmFormType = {
  setIsCompleted: Dispatch<SetStateAction<boolean>>;
};

function ConfirmForm({ setIsCompleted }: ConfirmFormType) {
  const {
    basiliumTermsOfUse,
    privatePolicy,
    onClickBasiliumTermsOfUse,
    onClickPrivatePolicy,
  } = useTermsOfUse();
  const [isBasiliumTermsOfUse, setIsBasiliumTermsOfUse] =
    useState<boolean>(false);
  const [isPrivatePolicy, setIsPrivatePolicy] = useState<boolean>(false);

  useEffect(() => {
    setIsCompleted(false);
    if (basiliumTermsOfUse.isAccepted && privatePolicy.isAccepted) {
      setIsCompleted(true);
    }
  }, [basiliumTermsOfUse.isAccepted, privatePolicy.isAccepted]);

  return (
    <Wrapper>
      <CheckColumn onClick={() => setIsBasiliumTermsOfUse((prev) => !prev)}>
        <CheckColumnText>{basiliumTermsOfUse.title}</CheckColumnText>
      </CheckColumn>
      {isBasiliumTermsOfUse && (
        <Content>
          <ContentText>{basiliumTermsOfUse.content}</ContentText>
          <CheckboxContainer>
            <CheckboxText>동의함</CheckboxText>
            <Checkbox
              checked={basiliumTermsOfUse.isAccepted}
              onClick={() => onClickBasiliumTermsOfUse(true, false)}
            />
            <CheckboxText>동의 안함</CheckboxText>
            <Checkbox
              checked={basiliumTermsOfUse.isDeclined}
              onClick={() => onClickBasiliumTermsOfUse(false, true)}
            />
          </CheckboxContainer>
        </Content>
      )}
      <CheckColumn onClick={() => setIsPrivatePolicy((prev) => !prev)}>
        <CheckColumnText>{privatePolicy.title}</CheckColumnText>
      </CheckColumn>
      {isPrivatePolicy && (
        <Content>
          <ContentText>{privatePolicy.content}</ContentText>
          <CheckboxContainer>
            <CheckboxText>동의함</CheckboxText>
            <Checkbox
              checked={privatePolicy.isAccepted}
              onClick={() => onClickPrivatePolicy(true, false)}
            />
            <CheckboxText>동의 안함</CheckboxText>
            <Checkbox
              checked={privatePolicy.isDeclined}
              onClick={() => onClickPrivatePolicy(false, true)}
            />
          </CheckboxContainer>
        </Content>
      )}
    </Wrapper>
  );
}

export { ConfirmForm };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

const CheckColumn = styled.div`
  box-sizing: border-box;
  padding: 2rem 1rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: flex-start;
  border-bottom: 1px solid #d9d9d9;
  cursor: pointer;
`;

const CheckColumnText = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: black;
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 3rem 2rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
  border-bottom: 1px solid #d9d9d9;
`;

const ContentText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: black;
`;

const CheckboxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

const CheckboxText = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
`;

const Checkbox = styled.div<{ checked: boolean }>`
  min-width: 1rem;
  min-height: 1rem;
  max-width: 1rem;
  max-height: 1rem;
  border-radius: 100%;
  border: 1px solid #121519;
  background-color: ${(props) => (props.checked ? "#121519" : "transparent")};
  transition: 0.15s all ease;
  &:hover {
    background-color: #d9d9d9;
  }
`;
