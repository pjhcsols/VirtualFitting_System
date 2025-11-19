import styled from "styled-components";

export const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem 0;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.span`
  font-family: "Prata-Regular";
  font-size: 32px;
  font-weight: 600;
  text-align: right;
  letter-spacing: -4px;
  margin: 0;
  background-image: linear-gradient(to right, #e9faff, #b8d2ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const InfoContainer = styled.div`
  box-sizing: border-box;
  padding: 1rem 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const InfoBox = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const SubTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

export const Text = styled.span`
  font-size: 0.6rem;
  font-weight: 500;
  color: black;
`;

export const TextInput = styled.input.attrs({ type: "text" })`
  box-sizing: border-box;
  padding: 0.5rem 1rem 0.5rem 2rem;
  width: 100%;
  height: 2.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  border: 2px solid #ededed;
  border-radius: 1rem;
  background-color: transparent;
  &:focus {
    outline: 1px solid #121519;
  }
`;

export const GenderContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;
