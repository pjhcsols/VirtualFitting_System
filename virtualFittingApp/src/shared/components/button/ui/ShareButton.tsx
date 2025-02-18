import styled from "styled-components";

function ShareButton() {
  return <ShareBtn>공유</ShareBtn>;
}

const ShareBtn = styled.button`
  width: 15vw;
  min-width: 25px;
  height: 4.5vw;
  min-height: 10px;
  border-radius: 12px;
  background: black;
  font-family: "Studio-Sans";
  font-size: 1vw;
  font-weight: 500;
  color: white;
  cursor: pointer;
`;

export { ShareButton };
