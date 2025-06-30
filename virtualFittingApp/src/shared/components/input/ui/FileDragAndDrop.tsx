import { ChangeEvent, useRef } from "react";
import styled from "styled-components";

type FileDragAndDropType = {
  photoUrl?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FileDragAndDrop({ photoUrl, onChange }: FileDragAndDropType) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onClickFileBg = () => {
    if (!fileRef.current) {
      return;
    }
    fileRef.current.click();
  };

  return (
    <FileWrapper>
      {photoUrl ? (
        <PreviewFile src={photoUrl} alt="preview" />
      ) : (
        <>
          <FileBG onClick={onClickFileBg} />
          <FileInput
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={onChange}
            multiple
          />
        </>
      )}
    </FileWrapper>
  );
}

function SubFileDragAndDrop({ onChange, photoUrl }: FileDragAndDropType) {
  const fileRef = useRef<HTMLInputElement>(null);

  const onClickFileBg = () => {
    if (!fileRef.current) {
      return;
    }
    fileRef.current.click();
  };

  return (
    <SubFileWrapper>
      {photoUrl ? (
        <PreviewFile src={photoUrl} alt="preview" />
      ) : (
        <>
          <FileBG onClick={onClickFileBg} />
          <FileInput
            type="file"
            accept="*.png, *.jpeg, *.jpg"
            ref={fileRef}
            onChange={onChange}
          />
        </>
      )}
    </SubFileWrapper>
  );
}

export { FileDragAndDrop, SubFileDragAndDrop };

const FileWrapper = styled.div`
  width: 80%;
  aspect-ratio: 4/5;
  display: flex;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 2px dashed black;
`;

const SubFileWrapper = styled.div`
  width: 100%;
  aspect-ratio: 4/5;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border: 2px dashed black;
`;

const PreviewFile = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: 0.25s all ease-out;
  &:hover {
    transform: scale(1.02);
  }
`;

const FileBG = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  background: transparent;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;
