import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backImg from "../ui/back.png";

interface HeaderProps {
  title: string;
}

function MyHeader({ title }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <Container1>
      <Container2>
        <Left onClick={() => navigate("/")}>
          <BackIcon src={backImg} alt="뒤로가기" />
        </Left>
        <Center>
          <h3>{title}</h3>
          <Divider />
        </Center>
      </Container2>
    </Container1>
  );
}

export { MyHeader };


const Container1 = styled.header`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 200;
`;

const Container2 = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  padding: 0px 16px;
  background: rgb(255, 255, 255);
`;

const Left = styled.div`
  display: flex;
  margin-right: 600px;
  margin-top: 17px;
  cursor: pointer;
`;

const Center = styled.div`
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  background: rgb(255, 255, 255);
`;

const BackIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const Divider = styled.div`
  height: 2px;
  background: rgb(242, 243, 245);
  width: 600px;
`;
