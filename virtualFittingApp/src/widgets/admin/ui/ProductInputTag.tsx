import {
  type ChangeEvent,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  useRef,
  useState,
} from "react";

import * as T from "@/widgets/admin/ui/css/ProductInputTag.css";

import { materialList, palleteList } from "@/widgets/admin/constants";
import type {
  Color,
  Material,
  Size,
  SizeTable,
} from "@/widgets/admin/types/Product";

type ProductInputTagType = {
  step: number;
  setMainPhotos: Dispatch<SetStateAction<FileList | null>>;
  setSubPhotos: Dispatch<SetStateAction<FileList | null>>;
  setMainPreview: Dispatch<SetStateAction<string[] | null>>;
  setSubPreview: Dispatch<SetStateAction<string[] | null>>;
  setProductName: Dispatch<SetStateAction<string>>;
  setProductPrice: Dispatch<SetStateAction<number | string>>;
  setProductDesc: Dispatch<SetStateAction<string>>;
  setProductColor: Dispatch<SetStateAction<Color>>;
  setProductMeterial: Dispatch<SetStateAction<Material>>;
  setProductSize: Dispatch<SetStateAction<Size>>;
  setProductSizeTable: Dispatch<SetStateAction<SizeTable[]>>;
  setProductQuantity: Dispatch<SetStateAction<number>>;
};

export default function ProductInputTag({
  step,
  setMainPhotos,
  setMainPreview,
  setSubPhotos,
  setSubPreview,
  setProductDesc,
  setProductName,
  setProductPrice,
  setProductColor,
  setProductMeterial,
  setProductQuantity,
  setProductSize,
  setProductSizeTable,
}: ProductInputTagType) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mainFileName, setMainFileName] = useState<string[] | null>(null);
  const [subFileName, setSubFileName] = useState<string[] | null>(null);

  const onClickFile = () => {
    fileRef.current?.click();
  };

  const onChangeMainFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      throw new Error("파일이 등록되지 않았습니다.");
    }
    if (files.length < 5) {
      setMainPhotos(files);

      for (let i = 0; i < files.length; i++) {
        let url = URL.createObjectURL(files[i]);
        setMainPreview((prev) => (prev ? [...prev, url] : [url]));
        setMainFileName((prev) =>
          prev ? [...prev, files[i].name] : [files[i].name],
        );
      }
    }
  };

  const onChangeSubFile = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) {
      throw new Error("파일이 등록되지 않았습니다.");
    }
    if (files.length < 10) {
      setSubPhotos(files);

      for (let i = 0; i < files.length; i++) {
        let url = URL.createObjectURL(files[i]);
        setSubPreview((prev) => (prev ? [...prev, url] : [url]));
        setSubFileName((prev) =>
          prev ? [...prev, files[i].name] : [files[i].name],
        );
      }
    }
  };

  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProductName(value);
  };

  const onChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setProductPrice("");
      return;
    }
    const parsed = Number(value);

    if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
      setProductPrice(parsed); // 정수로 저장
    }
  };

  const onChangeDesc = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProductDesc(value);
  };

  const onClickColor = (e: MouseEvent<HTMLDivElement>, item: Color) => {
    e.preventDefault();
    setProductColor(item);
  };

  const onClickMaterial = (e: MouseEvent<HTMLDivElement>, item: Material) => {
    e.preventDefault();
    setProductMeterial(item);
  };

  const stepByInput = () => {
    if (step === 0) {
      return (
        <>
          <T.UploadContainer>
            <span className="show-text">메인 이미지 업로드</span>
            <T.UploadedFileContainer>
              {mainFileName ? (
                <>
                  {mainFileName.map((item, key) => {
                    return <T.UploadedFile key={key}>{item}</T.UploadedFile>;
                  })}
                </>
              ) : (
                <>
                  <T.FileUploader onClick={onClickFile}>
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
                  </T.FileUploader>
                  <T.FileTag ref={fileRef} onChange={onChangeMainFile} />
                </>
              )}
            </T.UploadedFileContainer>
          </T.UploadContainer>
          <T.UploadContainer>
            <span className="show-text">서브 이미지 업로드</span>
            <T.FileUploader onClick={onClickFile}>
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
            </T.FileUploader>
            <T.FileTag ref={fileRef} onChange={onChangeSubFile} />
          </T.UploadContainer>
        </>
      );
    } else if (step === 1) {
      return (
        <T.InputContainer>
          <T.TitleInputContainer>
            <input type="text" id="input" onChange={onChangeTitle} required />
            <label htmlFor="input" className="label">
              상품 명
            </label>
            <div className="underline" />
          </T.TitleInputContainer>
          <T.TitleInputContainer>
            <input type="text" id="input" onChange={onChangePrice} required />
            <label htmlFor="input" className="label">
              상품 가격
            </label>
            <div className="underline" />
          </T.TitleInputContainer>
          <T.TitleInputContainer>
            <input type="text" id="input" onChange={onChangeDesc} required />
            <label htmlFor="input" className="label">
              상품 설명
            </label>
            <div className="underline" />
          </T.TitleInputContainer>
        </T.InputContainer>
      );
    } else if (step === 2) {
      return (
        <>
          <T.PalleteContainer>
            <span className="title-text">색상 설정</span>
            <div className="dots">
              {palleteList.map((item: Color, key: number) => {
                return (
                  <T.Pallete key={key} onClick={(e) => onClickColor(e, item)}>
                    {item}
                  </T.Pallete>
                );
              })}
            </div>
          </T.PalleteContainer>
          <T.MaterialContainer>
            <span className="title-text">소재 설정</span>
            <div className="material-container">
              {materialList.map((item: Material, key: number) => {
                return (
                  <div
                    className="material"
                    key={key}
                    onClick={(e) => onClickMaterial(e, item)}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </T.MaterialContainer>
        </>
      );
    }
  };
  return <T.Wrapper>{stepByInput()}</T.Wrapper>;
}
