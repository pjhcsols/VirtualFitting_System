import { ICON_BASILIUM } from "@/shared/constants";
import { MouseEvent } from "react";
import styled from "styled-components";

type LoginButtonType = {
  onSubmit: (e: MouseEvent<HTMLDivElement>) => void;
};

function LoginButton({ onSubmit }: LoginButtonType) {
  return (
    <Button onClick={(e) => onSubmit(e)}>
      <div className="button-content">
        <span className="login-text">LOGIN</span>
      </div>
      <div className="button-social">
        <BasiliumLogo src={ICON_BASILIUM} alt="icon-basilium" />
      </div>
    </Button>
  );
}

const Button = styled.div`
  position: relative;
  background-color: #fffafa;
  border: 3px solid #121212;
  outline: none;
  padding: 0.75rem 4rem;
  border-radius: 4rem;
  cursor: pointer;

  .button-social {
    display: flex;
    column-gap: 0.25rem;
    z-index: 1;

    img {
      font-size: 1.5rem;
      color: var(--first-color);
      transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1.2);
      transform: translateY(0.5rem);

      &:nth-child(1) {
        transition-delay: 0.1s;
      }
    }
  }

  .button-content {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #121212;
    width: 100%;
    height: 100%;
    border-radius: 4rem;
    display: grid;
    place-items: center;
    transform: scale(1.03);
    transition: transform 0.5s cubic-bezier(0.2, 0.9, 0.2, 1.2);
    z-index: 5;

    span {
      color: var(--white-color);
      font-weight: 600;
      font-size: 14px;
    }
  }
  &:hover .button-content {
    transform: translateY(-28px) scale(0.7);
  }
`;

const BasiliumLogo = styled.img`
  width: 35px;
  height: 35px;
  &:hover {
    transform: translateY(0) scale(1);
  }
`;

export { LoginButton };
