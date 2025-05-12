import * as S from "@/widgets/brand/ui/css/ProductEditor.css";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import type { ClientProductDto, ProductCategory } from "@/shared";
import { UPLOAD_PRODUCT } from "@/widgets/brand/api/brand.action";
import ProductPreview from "@/widgets/brand/ui/ProductPreview";
import ProductInputTag from "@/widgets/brand/ui/ProductInputTag";
import { JudgeStandard } from "./JudgeStandard";

function ProductEditor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [sizeTableCount, setSizeTableCount] = useState<number>(1);
  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  const [productInfo, setProductInfo] = useState<ClientProductDto>({
    productName: "",
    productDescription: "",
    productPrice: "",
    productMainPhotos: null,
    productQuantity: 0,
    productColor: "BLACK",
    productMaterial: "COTTON",
    productSubPhotos: null,
    productSizeTable: [
      {
        productSize: "S",
        productArm: 0,
        productChest: 0,
        productShoulder: 0,
        productTotalLength: 0,
      },
      {
        productSize: "M",
        productArm: 0,
        productChest: 0,
        productShoulder: 0,
        productTotalLength: 0,
      },
      {
        productSize: "L",
        productArm: 0,
        productChest: 0,
        productShoulder: 0,
        productTotalLength: 0,
      },
      {
        productSize: "XL",
        productArm: 0,
        productChest: 0,
        productShoulder: 0,
        productTotalLength: 0,
      },
      {
        productSize: "XX",
        productArm: 0,
        productChest: 0,
        productShoulder: 0,
        productTotalLength: 0,
      },
    ],
  });

  const [productCategory, setProductCategory] = useState<ProductCategory[]>([
    {
      categoryId: 0,
      categoryName: "",
    },
  ]);
  const [mainPreviews, setMainPreviews] = useState<string[] | null>([]);
  const [subPreviews, setSubPreviews] = useState<string[] | null>(null);

  // * Height Calculate
  useEffect(() => {
    if (wrapRef.current) {
      setTotalHeight(wrapRef.current.offsetHeight);
    }
  }, []);

  const onClickPrevStep = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (step !== 0) {
      setStep((prev) => prev - 1);
    }
  };

  const onClickNextStep = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (step !== 5) {
      setStep((prev) => prev + 1);
    }
  };

  const onClickSubmit = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const res = await UPLOAD_PRODUCT();
  };

  return (
    <S.Wrapper ref={wrapRef}>
      {step === 5 ? (
        <JudgeStandard
          step={step}
          setStep={setStep}
          productInfo={productInfo}
          productCategory={productCategory}
        />
      ) : (
        <>
          <ProductPreview
            step={step}
            productInfo={productInfo}
            mainPreviews={mainPreviews}
            subPreviews={subPreviews}
            productCategory={productCategory}
          />
          <S.Divider hv={`${totalHeight}px`} />
          <ProductInputTag
            step={step}
            productInfo={productInfo}
            mainPreview={mainPreviews}
            subPreview={subPreviews}
            productCategory={productCategory}
            sizeTableCount={sizeTableCount}
            setProductInfo={setProductInfo}
            setMainPreview={setMainPreviews}
            setSubPreview={setSubPreviews}
            setProductCategory={setProductCategory}
            setSizeTableCount={setSizeTableCount}
          />
        </>
      )}
      <S.ButtonContainer step={step}>
        {step != 0 && <S.NextBtn onClick={onClickPrevStep}>이전</S.NextBtn>}
        {step != 5 && <S.NextBtn onClick={onClickNextStep}>다음</S.NextBtn>}
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { ProductEditor };
