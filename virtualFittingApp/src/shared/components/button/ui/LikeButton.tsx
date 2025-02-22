import styled from "styled-components";

function LikeButton() {
  return <LikeBtn>좋아요</LikeBtn>;
}

const LikeBtn = styled.button`
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

export { LikeButton };
