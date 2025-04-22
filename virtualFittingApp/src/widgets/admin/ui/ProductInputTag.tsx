import * as T from "@/widgets/admin/ui/css/ProductInputTag.css";
import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  useState,
} from "react";
import type { ClientProductDto, ProductCategory } from "@/shared";
import {
  CategorySelector,
  FileUploader,
  InputSizeTable,
  ProductColorUploader,
  ProductInfo,
  ProductMaterialUploader,
} from "@/shared";
import { CategoryMapping, Sizes } from "@/shared/constants";

type ProductInputTagType = {
  step: number;
  productInfo: ClientProductDto;
  mainPreview: string[] | null;
  subPreview: string[] | null;
  productCategory: ProductCategory[];
  sizeTableCount: number;
  setProductInfo: Dispatch<SetStateAction<ClientProductDto>>;
  setMainPreview: Dispatch<SetStateAction<string[] | null>>;
  setSubPreview: Dispatch<SetStateAction<string[] | null>>;
  setProductCategory: Dispatch<SetStateAction<ProductCategory[]>>;
  setSizeTableCount: Dispatch<SetStateAction<number>>;
};

export default function ProductInputTag({
  step,
  productInfo,
  mainPreview,
  subPreview,
  productCategory,
  sizeTableCount,
  setProductInfo,
  setMainPreview,
  setSubPreview,
  setProductCategory,
  setSizeTableCount,
}: ProductInputTagType) {
  const MAX_SIZETABLE_CNT = 6;

  const [subFileName, setSubFileName] = useState<string[] | null>(null);

  const onClickControlTable = (
    e: MouseEvent<HTMLDivElement>,
    direction: boolean,
  ) => {
    e.preventDefault();
    if (direction) {
      if (sizeTableCount <= MAX_SIZETABLE_CNT) {
        setSizeTableCount((prev) => prev + 1);
      } else {
        setSizeTableCount(MAX_SIZETABLE_CNT);
      }
    } else {
      if (sizeTableCount > 1) {
        setSizeTableCount((prev) => prev - 1);
      } else {
        setSizeTableCount(1);
      }
    }
  };

  const stepByInput = () => {
    if (step === 0) {
      return (
        <T.FileUploadContainer>
          <span className="show-text">메인 이미지 업로드</span>
          <T.FileBox>
            <FileUploader
              productInfo={productInfo}
              setProductInfo={setProductInfo}
              mainPreview={mainPreview}
              setMainPreview={setMainPreview}
            />
          </T.FileBox>
        </T.FileUploadContainer>
      );
    } else if (step === 1) {
      return (
        <ProductInfo
          productInfo={productInfo}
          setProductInfo={setProductInfo}
        />
      );
    } else if (step === 2) {
      return (
        <>
          <ProductColorUploader
            productInfo={productInfo}
            setProductInfo={setProductInfo}
          />
          <ProductMaterialUploader
            productInfo={productInfo}
            setProductInfo={setProductInfo}
          />
          <T.SizeTableContainer>
            <T.TitleText>사이즈 표 설정</T.TitleText>
            <T.SizeTable>
              <div>사이즈</div>
              <div>총장</div>
              <div>가슴 둘레</div>
              <div>어깨 길이</div>
              <div>팔 길이</div>
            </T.SizeTable>
            {Array.from({ length: 5 }).map((_, rowKey) => {
              return (
                <T.SizeContentTable key={rowKey}>
                  {Array.from({ length: sizeTableCount }).map((_, key) => {
                    return (
                      <InputSizeTable
                        row={rowKey}
                        size={Sizes[rowKey]}
                        productInfo={productInfo}
                        setProductInfo={setProductInfo}
                        key={key}
                      />
                    );
                  })}
                </T.SizeContentTable>
              );
            })}
          </T.SizeTableContainer>
        </>
      );
    } else if (step === 3) {
      return (
        <>
          <T.CategoryContainer>
            <T.TitleText>카테고리 설정</T.TitleText>
            <T.CategoryBox>
              {Object.entries(CategoryMapping).map(([key, value]) => {
                return (
                  <CategorySelector
                    categoryId={parseInt(key)}
                    categoryName={value}
                    productCategory={productCategory}
                    setProductCategory={setProductCategory}
                    key={key}
                  />
                );
              })}
            </T.CategoryBox>
          </T.CategoryContainer>
        </>
      );
    } else if (step === 4) {
      return (
        <T.FileUploadContainer>
          <span className="show-text">서브 이미지 업로드</span>
          <T.FileBox>
            <FileUploader
              productInfo={productInfo}
              setProductInfo={setProductInfo}
              mainPreview={subPreview}
              setMainPreview={setSubPreview}
            />
          </T.FileBox>
        </T.FileUploadContainer>
      );
    }
  };

  return <T.Wrapper>{stepByInput()}</T.Wrapper>;
}
