import * as S from "@/shared/components/input/ui/css/ProductOptionUploader.css";
import { materialList, palleteList } from "@/shared/constants";

import type { Color, Material, ClientProductDto } from "@/shared/types";

import type { Dispatch, MouseEvent, SetStateAction } from "react";

type ProductOptionUploaderType = {
  productInfo: ClientProductDto;
  setProductInfo: Dispatch<SetStateAction<ClientProductDto>>;
};

function ProductColorUploader({
  productInfo,
  setProductInfo,
}: ProductOptionUploaderType) {
  const onClickColor = (e: MouseEvent<HTMLDivElement>, item: Color) => {
    e.preventDefault();
    setProductInfo({
      ...productInfo,
      ["productColor"]: item,
    });
  };
  return (
    <S.PalleteContainer>
      <span className="title-text">색상 설정</span>
      <div className="dots">
        {palleteList.map((item: Color, key: number) => {
          return (
            <S.Pallete key={key} onClick={(e) => onClickColor(e, item)}>
              {item}
            </S.Pallete>
          );
        })}
      </div>
    </S.PalleteContainer>
  );
}

function ProductMaterialUploader({
  productInfo,
  setProductInfo,
}: ProductOptionUploaderType) {
  const onClickMaterial = (e: MouseEvent<HTMLDivElement>, item: Material) => {
    e.preventDefault();
    setProductInfo({
      ...productInfo,
      ["productMaterial"]: item,
    });
  };
  return (
    <S.MaterialContainer>
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
    </S.MaterialContainer>
  );
}

export { ProductColorUploader, ProductMaterialUploader };
