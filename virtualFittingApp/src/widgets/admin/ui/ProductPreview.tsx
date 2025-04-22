/*
 * Product Preview Component
 */

import * as P from "@/widgets/admin/ui/css/ProductPreview.css";

import {
  blackColorCode,
  blueColorCode,
  grayColorCode,
  greenColorCode,
  orangeColorCode,
  redColorCode,
  whiteColorCode,
  yellowColorCode,
} from "@/widgets/admin/constants";
import {
  CategorySelector,
  CategoryViewer,
  type ClientProductDto,
  type Color,
  type Material,
  type ProductCategory,
  type Size,
  type SizeTable,
} from "@/shared";
import { useEffect, useRef, useState } from "react";
import { CategoryMapping, materialList } from "@/shared/constants";

type ProductPreviewType = {
  step: number;
  productInfo: ClientProductDto;
  mainPreviews: string[] | null;
  subPreviews: string[] | null;
  productCategory: ProductCategory[];
};

export default function ProductPreview({
  step,
  productInfo,
  mainPreviews,
  subPreviews,
  productCategory,
}: ProductPreviewType) {
  const imageHeightRef = useRef<HTMLImageElement>(null);
  const [imageHeight, setImageHeight] = useState<number>(0);

  // * Height Calculate
  useEffect(() => {
    if (imageHeightRef.current) {
      setImageHeight(imageHeightRef.current.offsetWidth * 1.25);
    }
  }, []);

  const showPrice = (input: string | number) => {
    const inputStr = input.toString();
    return inputStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const PalletDots = () => {
    if (productInfo.productColor === "YELLOW") {
      return <P.ColorDot color={yellowColorCode} />;
    } else if (productInfo.productColor === "GRAY") {
      return <P.ColorDot color={grayColorCode} />;
    } else if (productInfo.productColor === "ORANGE") {
      return <P.ColorDot color={orangeColorCode} />;
    } else if (productInfo.productColor === "RED") {
      return <P.ColorDot color={redColorCode} />;
    } else if (productInfo.productColor === "BLUE") {
      return <P.ColorDot color={blueColorCode} />;
    } else if (productInfo.productColor === "GREEN") {
      return <P.ColorDot color={greenColorCode} />;
    } else if (productInfo.productColor === "WHITE") {
      return <P.ColorDot color={whiteColorCode} />;
    } else {
      return <P.ColorDot color={blackColorCode} />;
    }
  };

  const InsertComponent = () => {
    if (step === 0) {
      return (
        <P.ImageContainer>
          {mainPreviews ? (
            <>
              <P.UploadedImageContainer>
                {mainPreviews.map((item, key) => {
                  return <P.SubImages src={item} key={key} />;
                })}
              </P.UploadedImageContainer>
              <P.Image
                ref={imageHeightRef}
                hv={`${imageHeight}px`}
                src={mainPreviews[0]}
              />
            </>
          ) : (
            <P.NoImage hv={`${imageHeight}px`} />
          )}
        </P.ImageContainer>
      );
    } else if (step === 1) {
      return (
        <P.ProductInfoContainer>
          <P.ProductTitleBox>
            <span className="title-text">📌 상품 명</span>
            <span className="name-text">{productInfo.productName}</span>
          </P.ProductTitleBox>
          <P.ProductTitleBox>
            <span className="title-text">🏷️ 상품 가격</span>
            <span className="price-text">{`₩${showPrice(productInfo.productPrice)}`}</span>
          </P.ProductTitleBox>
          <P.ProductTitleBox>
            <span className="title-text">📝 상품 설명</span>
            <span className="desc-text">{productInfo.productDescription}</span>
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
              {materialList.map((item: string, key: number) => {
                return (
                  <P.Material
                    key={key}
                    clicked={productInfo.productMaterial === item}
                  >
                    {item}
                  </P.Material>
                );
              })}
            </div>
          </P.ProductMaterial>
          <P.ProductSizeTableContainer>
            <span className="title-text">제품 사이즈 표</span>
            <P.SizeTable>
              <thead>
                <tr>
                  <th className="pin">사이즈</th>
                  <th>총장</th>
                  <th>가슴 둘레</th>
                  <th>어깨 길이</th>
                  <th>팔 길이</th>
                </tr>
              </thead>
              <tbody>
                {productInfo.productSizeTable.map((item, key) => {
                  return (
                    <tr key={key}>
                      <th>{item.productSize}</th>
                      <td>{item.productTotalLength}</td>
                      <td>{item.productChest}</td>
                      <td>{item.productShoulder}</td>
                      <td>{item.productArm}</td>
                    </tr>
                  );
                })}
              </tbody>
            </P.SizeTable>
          </P.ProductSizeTableContainer>
        </P.ProductOptionContainer>
      );
    } else if (step === 3) {
      return (
        <P.ProductCategoryContainer>
          <span className="title-text">제품 카테고리</span>
          <P.ProductCategoryBox>
            {Object.entries(CategoryMapping).map(([key, value]) => {
              return (
                <CategoryViewer
                  categoryId={parseInt(key)}
                  categoryName={value}
                  productCategory={productCategory}
                  key={key}
                />
              );
            })}
          </P.ProductCategoryBox>
        </P.ProductCategoryContainer>
      );
    } else if (step === 4) {
      return (
        <P.ImageContainer>
          <P.ProductOptionImages>
            {subPreviews ? (
              <>
                {subPreviews.map((item, key) => {
                  return (
                    <P.OptionImage src={item} alt={`option-${key}`} key={key} />
                  );
                })}
              </>
            ) : (
              <P.NoImage hv={`${imageHeight}px`} />
            )}
          </P.ProductOptionImages>
        </P.ImageContainer>
      );
    }
  };

  return <P.Wrapper>{InsertComponent()}</P.Wrapper>;
}
