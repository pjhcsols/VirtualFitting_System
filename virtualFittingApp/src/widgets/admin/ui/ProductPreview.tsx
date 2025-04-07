/*
 * Product Preview Component
 */

import * as P from "@/widgets/admin/ui/css/ProductPreview.css";

import {
  blackColorCode,
  blueColorCode,
  grayColorCode,
  greenColorCode,
  materialList,
  orangeColorCode,
  redColorCode,
  whiteColorCode,
  yellowColorCode,
} from "@/widgets/admin/constants";
import type {
  Color,
  Material,
  Size,
  SizeTable,
} from "@/widgets/admin/types/Product";
import { useEffect, useRef, useState } from "react";

type ProductPreviewType = {
  step: number;
  mainPhotos: string[] | null;
  subPhotos: string[] | null;
  productName: string;
  productPrice: number | string;
  productDescription: string;
  productSizeTable: SizeTable[];
  productSize: Size;
  productMaterial: Material;
  productColor: Color;
  productQuantity: number;
};

export default function ProductPreview({
  step,
  mainPhotos,
  productColor,
  productDescription,
  productMaterial,
  productName,
  productPrice,
  productQuantity,
  productSize,
  productSizeTable,
  subPhotos,
}: ProductPreviewType) {
  const imageHeightRef = useRef<HTMLImageElement>(null);
  const [imageHeight, setImageHeight] = useState<number>(0);

  // * Height Calculate
  useEffect(() => {
    if (imageHeightRef.current) {
      setImageHeight(imageHeightRef.current.offsetWidth * 1.25);
    }
  }, []);

  const PalletDots = () => {
    if (productColor === "YELLOW") {
      return <P.ColorDot color={yellowColorCode} />;
    } else if (productColor === "GRAY") {
      return <P.ColorDot color={grayColorCode} />;
    } else if (productColor === "ORANGE") {
      return <P.ColorDot color={orangeColorCode} />;
    } else if (productColor === "RED") {
      return <P.ColorDot color={redColorCode} />;
    } else if (productColor === "BLUE") {
      return <P.ColorDot color={blueColorCode} />;
    } else if (productColor === "GREEN") {
      return <P.ColorDot color={greenColorCode} />;
    } else if (productColor === "WHITE") {
      return <P.ColorDot color={whiteColorCode} />;
    } else {
      return <P.ColorDot color={blackColorCode} />;
    }
  };

  const InsertComponent = () => {
    if (step === 0) {
      return (
        <P.ImageContainer>
          {mainPhotos ? (
            <P.Image
              ref={imageHeightRef}
              hv={`${imageHeight}px`}
              src={mainPhotos[0]}
            />
          ) : (
            <P.NoImage hv={`${imageHeight}px`} />
          )}
          {subPhotos && (
            <P.ImageBox>
              {subPhotos.map((item, key) => {
                return (
                  <P.SubImages src={item} alt={`subphoto-${key}`} key={key} />
                );
              })}
            </P.ImageBox>
          )}
        </P.ImageContainer>
      );
    } else if (step === 1) {
      return (
        <P.ProductInfoContainer>
          <P.ProductTitleBox>
            <span className="title-text">📌 상품 명</span>
            <span className="name-text">{productName}</span>
          </P.ProductTitleBox>
          <P.ProductTitleBox>
            <span className="title-text">🏷️ 상품 가격</span>
            <span className="price-text">{`₩${productPrice}`}</span>
          </P.ProductTitleBox>
          <P.ProductTitleBox>
            <span className="title-text">📝 상품 설명</span>
            <span className="desc-text">{productDescription}</span>
          </P.ProductTitleBox>
        </P.ProductInfoContainer>
      );
    } else if (step === 2) {
      return (
        <P.ProductOptionContainer>
          <P.ProductPallete>
            <span className="title-text">제품 색상</span>
            {PalletDots()}
          </P.ProductPallete>
          <P.ProductMaterial>
            <span className="title-text">제품 소재</span>
            <div className="material-container">
              {materialList.map((item, key) => {
                return (
                  <P.Material key={key} clicked={productMaterial === item}>
                    {item}
                  </P.Material>
                );
              })}
            </div>
          </P.ProductMaterial>
          <P.ProductSizeTableContainer>
            <span className="title-text">제품 사이즈 표</span>
            <P.ProductTable>
              <P.ProductTableSize>
                <nav>
                  <label htmlFor="touch">
                    <span>titre</span>
                  </label>
                  <input type="checkbox" id="touch" />

                  <ul className="slide">
                    <li>
                      <a href="#">Lorem Ipsum</a>
                    </li>
                    <li>
                      <a href="#">Lorem Ipsum</a>
                    </li>
                    <li>
                      <a href="#">Lorem Ipsum</a>
                    </li>
                    <li>
                      <a href="#">Lorem Ipsum</a>
                    </li>
                  </ul>
                </nav>
              </P.ProductTableSize>
            </P.ProductTable>
          </P.ProductSizeTableContainer>
        </P.ProductOptionContainer>
      );
    } else if (step === 3) {
      return <P.ProductCategoryContainer></P.ProductCategoryContainer>;
    }
  };

  return <P.Wrapper>{InsertComponent()}</P.Wrapper>;
}
