import { useNavigate } from "react-router-dom";
import styled from "styled-components";

function ProductAddButton() {
  const router = useNavigate();
  const onClickButton = () => {
    router("/brand/create");
  };
  return (
    <ButtonWrapper onClick={onClickButton}>
      <Text>+</Text>
    </ButtonWrapper>
  );
}

export { ProductAddButton };

const ButtonWrapper = styled.div`
  width: 100px;
  height: 45px;
  background-color: #121215;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 4px 4px 4px 0px rgb(139, 139, 139);
`;

const Text = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;
