import styled, { css } from "styled-components";

const paddingStyle = {
  upload: "180px 250px",
  list: "180px 180px",
  logout: "100px 150px",
  analytics: "100px 150px",
};

export const ButtonObject = styled.div<{
  type: "upload" | "list" | "logout" | "analytics";
}>`
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  z-index: 10;
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(6px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    opacity: 80%;
    background: linear-gradient(
      to left bottom,
      #292e49 0%,
      #536976 50%,
      #bbd2c5 100%
    );
  }
  .front {
    font-family: "Pretendard";
    display: block;
    position: relative;
    padding: 12px 27px;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    color: white;
    background: linear-gradient(
      to left bottom,
      #292e49 0%,
      #536976 50%,
      #bbd2c5 100%
    );
    will-change: transform;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
    @media (min-width: 768px) {
      font-size: 1.25rem;
      padding: 100px 100px;
      ${(props) => css`
        padding: ${paddingStyle[props.type]};
      `}
    }
  }
  &:hover {
    filter: brightness(120%);
    -webkit-filter: brightness(120%);
    .front {
      transform: translateY(-6px);
      transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }
    .shadow {
      transform: translateY(8px);
      transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }
  }
  &:active {
    .front {
      transform: translateY(-2px);
      transition: transform 34ms;
    }
    .shadow {
      transform: translateY(1px);
      transition: transform 34ms;
    }
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
