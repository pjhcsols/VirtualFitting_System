import styled from "styled-components";
import { DeleteButton, ModifyButton } from "@/shared/components/button";
import { useState, type ChangeEvent } from "react";

type DragablePhotoListType = {
  photoUrls: string[];
  onModifyPhoto: ({
    e,
    index,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    index: number;
  }) => void;
  onDeletePhoto: (target: number) => void;
};

function DragablePhotoList({
  photoUrls,
  onDeletePhoto,
  onModifyPhoto,
}: DragablePhotoListType) {
  const [isClickedPhoto, setIsClickedPhoto] = useState<string>(photoUrls[0]);

  const onClickPhoto = (target: string) => {
    setIsClickedPhoto(target);
  };

  return (
    <DragWrapper>
      <DragPhotoBox>
        {photoUrls.map((item: string, key: number) => {
          return (
            <DragablePhoto key={key}>
              <OptionBox>
                <ModifyButton index={key} onClickModify={onModifyPhoto} />
                <DeleteButton index={key} onClickDelete={onDeletePhoto} />
              </OptionBox>
              <Photo
                src={item}
                alt={`photo-${key}`}
                onClick={() => onClickPhoto(item)}
              />
            </DragablePhoto>
          );
        })}
      </DragPhotoBox>
      <PhotoPreviewContainer>
        <PhotoPreview src={isClickedPhoto} alt="preview" />
      </PhotoPreviewContainer>
    </DragWrapper>
  );
}

export { DragablePhotoList };

const DragWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
  align-items: flex-start;
`;

const DragPhotoBox = styled.div`
  width: 20%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
`;

const PhotoPreviewContainer = styled.div`
  width: 70%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
`;

const PhotoPreview = styled.img`
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: 8px;
  overflow: hidden;
`;

const DragablePhoto = styled.div.attrs({ draggable: true })`
  width: 100%;
  aspect-ratio: 4/5;
  border-radius: 8px;
  overflow: hidden;
`;

const Photo = styled.img`
  position: relative;
  width: 100%;
  height: 100%;
  transition: 0.25s all ease-out;
  &:hover {
    transform: scale(1.02);
  }
  cursor: pointer;
`;

const OptionBox = styled.div`
  position: absolute;
  right: 0;
  width: 50px;
  display: none;
  &:hover {
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 16px;
  }
`;
