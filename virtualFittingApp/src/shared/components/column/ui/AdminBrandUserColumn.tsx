import styled from "styled-components";

type AdminBrandUserColumnType = {
  id?: string;
  className?: string;
  title: string;
  address: string;
  isAuthenticate: boolean;
  onDelete: () => void;
};

function AdminBrandUserColumn({
  id,
  className,
  title,
  address,
  isAuthenticate,
  onDelete,
}: AdminBrandUserColumnType) {
  return (
    <Wrapper id={id} className={className}>
      <LogoContainer>
        <Logo />
      </LogoContainer>
      <NameContainer>
        <Name>{title}</Name>
      </NameContainer>
      <AddressContainer>
        <Address>{address}</Address>
      </AddressContainer>
      <ButtonContainer>
        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
      </ButtonContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 0.8px solid #121212;
`;

const LogoContainer = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
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
`;

const Address = styled.span`
  font-size: 0.65rem;
  font-weight: 500;
  color: black;
`;

const ButtonContainer = styled.div`
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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

export { AdminBrandUserColumn };
