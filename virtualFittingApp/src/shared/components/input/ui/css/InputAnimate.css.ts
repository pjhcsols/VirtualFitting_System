import styled from "styled-components";

export const InputAnimate = styled.input.attrs({ type: "text" })`
  padding: 10px 4px 10px 32px;
  width: 100%;
  font-family: "Pretendard";
  font-size: 0.7rem;
  color: black;
  @keyframes MovePlaceholder {
    0% {
      transform: translateX(10px) translateY(0) rotate(0);
    }
    60% {
      transform: translateX(4px) translateY(-8px) rotate(-18deg) scale(0.92);
    }
    100% {
      transform: translateX(0) translateY(-30px) rotate(0deg) scale(0.75);
    }
  }
  @keyframes ReturnPlaceholder {
    0% {
      transform: translateX(0) translateY(-30px) scale(0.75);
    }
    100% {
      transform: translateX(10px) translateY(0);
    }
  }
`;
