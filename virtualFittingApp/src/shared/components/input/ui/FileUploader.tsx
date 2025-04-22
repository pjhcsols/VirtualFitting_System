import * as S from "@/shared/components/input/ui/css/FileUploader.css";
import type { ClientProductDto } from "@/shared/types";
import { convertFileArray } from "@/shared/utils";
import {
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useRef,
  useState,
} from "react";

type FileUploaderType = {
  mainPreview: string[] | null;
  setMainPreview: Dispatch<SetStateAction<string[] | null>>;
  productInfo: ClientProductDto;
  setProductInfo: Dispatch<SetStateAction<ClientProductDto>>;
};

function FileUploader({
  mainPreview,
  setMainPreview,
  productInfo,
  setProductInfo,
}: FileUploaderType) {
  const [mainFileName, setMainFileName] = useState<string[] | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const onChangeMainFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      throw new Error("파일이 등록되지 않았습니다.");
    }
    if (files.length < 6) {
      const fileArray = convertFileArray(files);
      setProductInfo({
        ...productInfo,
        ["productMainPhotos"]: fileArray,
      });

      for (let i = 0; i < files.length; i++) {
        let url = URL.createObjectURL(files[i]);
        setMainPreview((prev) => (prev ? [...prev, url] : [url]));
        setMainFileName((prev) =>
          prev ? [...prev, files[i].name] : [files[i].name],
        );
      }
    }
  };

  const deleteFile = (index: number) => {
    if (!productInfo.productMainPhotos) {
      return;
    }

    const fileList = productInfo.productMainPhotos;

    if (index >= 0 && index < fileList.length) {
      fileList[index] = null;
    }
    const validFileList: File[] = fileList.filter(
      (item): item is File => item !== null,
    );

    if (validFileList) {
      setProductInfo({
        ...productInfo,
        productMainPhotos: validFileList,
      });
    }
  };

  const onClickUploadBtn = () => {
    imageRef.current?.click();
  };

  if (mainFileName) {
    mainFileName.map((item: string, key: number) => {
      return (
        <S.ShowFile key={key}>
          {item}
          <S.ButtonContainer>
            <S.UploadButton>수정</S.UploadButton>
            <S.DeleteButton onClick={() => deleteFile(key)}>
              삭제
            </S.DeleteButton>
          </S.ButtonContainer>
        </S.ShowFile>
      );
    });
  }
  return (
    <>
      <S.FileUploader onClick={onClickUploadBtn}>
        <svg
          aria-hidden="true"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-width="2"
            stroke="#fffffff"
            d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
            stroke-linejoin="round"
            stroke-linecap="round"
          ></path>
          <path
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            stroke="#fffffff"
            d="M17 15V18M17 21V18M17 18H14M17 18H20"
          ></path>
        </svg>
        파일 업로드
      </S.FileUploader>
      <S.FileTag multiple ref={imageRef} onChange={onChangeMainFile} />
    </>
  );
}

export { FileUploader };
