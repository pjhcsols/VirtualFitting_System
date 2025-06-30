import React, { useRef, type ChangeEvent } from "react";
import styled from "styled-components";
import { ICON_MODIFY } from "@/shared/constants/icon/Icon";

type ButtonType = {
  children?: React.ReactNode;
  index?: number;
  onClickFunction?: () => void;
  onClickModify?: ({
    e,
    index,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    index: number;
  }) => void;
  onClickDelete?: (target: number) => void;
};

function BlackButton({ children, onClickFunction }: ButtonType) {
  return (
    <BlackButtonWrapper onClick={onClickFunction}>
      {children}
    </BlackButtonWrapper>
  );
}

function WhiteButton({ children, onClickFunction }: ButtonType) {
  return (
    <WhiteButtonWrapper onClick={onClickFunction}>
      {children}
    </WhiteButtonWrapper>
  );
}

function DeleteButton({ index, onClickDelete }: ButtonType) {
  if (!onClickDelete) return;
  return (
    <DeleteIcon onClick={() => onClickDelete(index ?? -1)}>
      <svg
        className="feather feather-x"
        fill="none"
        height="24"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="18" x2="6" y1="6" y2="18" />
        <line x1="6" x2="18" y1="6" y2="18" />
      </svg>
    </DeleteIcon>
  );
}

function ModifyButton({ index, onClickModify }: ButtonType) {
  if (!onClickModify) return;
  const buttonRef = useRef<HTMLInputElement>(null);
  const onClickIcon = () => {
    if (!buttonRef.current) {
      return;
    }
    buttonRef.current.click();
  };

  return (
    <>
      <ModifyIcon src={ICON_MODIFY} alt="modify_icon" onClick={onClickIcon} />
      <FileInput
        ref={buttonRef}
        onChange={(e) => onClickModify({ e, index: index ?? -1 })}
      />
    </>
  );
}

export { BlackButton, WhiteButton, DeleteButton, ModifyButton };

const DefaultButton = styled.div`
  width: 200px;
  height: 60px;
  border-radius: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const BlackButtonWrapper = styled(DefaultButton)`
  background: #121212;
  color: #fffafa;
`;

const WhiteButtonWrapper = styled(DefaultButton)`
  background: #fffafa;
  color: #121212;
`;

const DeleteIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  border: 2px solid #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const ModifyIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 100%;
  border: 2px solid #121212;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const FileInput = styled.input.attrs({ type: "file" })`
  display: none;
`;
