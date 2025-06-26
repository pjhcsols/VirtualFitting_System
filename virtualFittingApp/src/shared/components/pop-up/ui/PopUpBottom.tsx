import styled from "styled-components";

type PopUpBottomProps = {
  message: string;
};

function PopUpBottom({ message }: PopUpBottomProps) {
  return <StyledPopup>{message}</StyledPopup>;
}

const StyledPopup = styled.div`
  width: 300px;
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #202020;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 14px;
  text-align: left;
  z-index: 9999;
  animation: fadeInOut 2s ease-in-out forwards;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, 20px); }
    10% { opacity: 1; transform: translate(-50%, 0); }
    90% { opacity: 1; transform: translate(-50%, 0); }
    100% { opacity: 0; transform: translate(-50%, 20px); }
  }
`;

export { PopUpBottom };
