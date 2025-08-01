import { Link } from "react-router-dom";
import styled from "styled-components";

type AdminBrandUserColumnType = {
  id?: string;
  className?: string;
  title: string;
  address: string;
  webUrl: string;
  isAuthenticate: boolean;
  onAgree: () => void;
  onDelete: () => void;
};

function AdminBrandUserColumn({
  id,
  className,
  title,
  address,
  webUrl,
  isAuthenticate,
  onAgree,
  onDelete,
}: AdminBrandUserColumnType) {
  return (
    <Wrapper id={id} className={className}>
      <NameContainer>
        <Name>{title}</Name>
      </NameContainer>
      <AddressContainer>
        <Address>{address}</Address>
      </AddressContainer>
      <WebUrlBox>
        <WebUrlAnchor to={"/"}>{webUrl}</WebUrlAnchor>
      </WebUrlBox>
      <ButtonContainer>
        <AgreeButton onClick={onAgree}>Agree</AgreeButton>
        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
      </ButtonContainer>
    </Wrapper>
  );
}

export { AdminBrandUserColumn };

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #d9d9d9;
`;

const NameContainer = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Name = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: black;
`;

const AddressContainer = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Address = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: black;
`;

const WebUrlBox = styled.div`
  min-width: 10rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    display: none;
  }
`;

const WebUrlAnchor = styled(Link)`
  font-size: 0.6rem;
  font-weight: 500;
  color: black;
  text-decoration: none;
`;

const ButtonContainer = styled.div`
  min-width: 300px;
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Button = styled.div`
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

const DeleteButton = styled(Button)`
  background: transparent;
  border: 1px solid #121212;
`;

const AgreeButton = styled(DeleteButton)``;
