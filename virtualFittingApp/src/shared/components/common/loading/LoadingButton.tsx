import { useState } from "react";
import styled from "styled-components";

interface ILoadingButton {
  execute: () => void;
}

function LoadingButton({ execute }: ILoadingButton) {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const onClickLoading = () => {
    setIsClicked(true);
    execute();
    setIsClicked(false);
  };

  if (isClicked) {
    return (
      <Wrapper>
        <LoadingIcon />
      </Wrapper>
    );
  }
  return (
    <Wrapper onClick={onClickLoading}>
      <RefreshIcon />
    </Wrapper>
  );
}

export { LoadingButton };

function RefreshIcon() {
  return (
    <svg
      fill="none"
      height="24"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8883 13.5C21.1645 18.3113 17.013 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1006 2 19.6248 4.46819 21.1679 8"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17 8H21.4C21.7314 8 22 7.73137 22 7.4V3"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <LoadingSvg
      fill="none"
      height="20"
      viewBox="0 0 20 20"
      width="20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 3.5C6.41015 3.5 3.5 6.41015 3.5 10C3.5 10.4142 3.16421 10.75 2.75 10.75C2.33579 10.75 2 10.4142 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C9.58579 18 9.25 17.6642 9.25 17.25C9.25 16.8358 9.58579 16.5 10 16.5C13.5899 16.5 16.5 13.5899 16.5 10C16.5 6.41015 13.5899 3.5 10 3.5Z"
        fill="#212121"
      />
    </LoadingSvg>
  );
}

const Wrapper = styled.div`
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  border-radius: 100%;
  transition: 0.3s all cubic-bezier(0.4, 0, 0.2, 1);
  &:hover {
    background-color: #c9c9c9;
    transform: scale(1.01);
  }
`;

const LoadingSvg = styled.svg`
  transition: linear all cubic-bezier(0.4, 0, 0.2, 1);
  rotate: calc(100%);
  cursor: wait;
`;
