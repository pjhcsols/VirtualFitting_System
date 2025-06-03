import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 0.8px solid #121212;
`;

export const LogoContainer = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.img`
  width: 50px;
  height: 50px;
`;

export const NameContainer = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Name = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: black;
`;

export const AddressContainer = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const Address = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: black;
`;

export const ButtonContainer = styled.div`
  min-width: 300px;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const Button = styled.div`
  cursor: pointer;
  width: 100px;
  height: 40px;
  font-size: 0.6rem;
  font-weight: 500;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
`;

export const DeleteButton = styled(Button)`
  background: transparent;
  border: 1px solid #121212;
`;

export const AgreeButton = styled(DeleteButton)``;
