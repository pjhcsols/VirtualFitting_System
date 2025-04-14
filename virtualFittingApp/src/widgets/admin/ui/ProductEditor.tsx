import * as S from "@/widgets/admin/ui/css/ProductEditor.css";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import type { ClientProductDto } from "@/widgets/admin/types/Product";
import { UPLOAD_PRODUCT } from "@/widgets/admin/api/admin.action";
import ProductPreview from "@/widgets/admin/ui/ProductPreview";
import ProductInputTag from "@/widgets/admin/ui/ProductInputTag";

function ProductEditor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  const [productInfo, setProductInfo] = useState<ClientProductDto>({
    productName: "",
    productDescription: "",
    productPrice: "",
    productMainPhotos: null,
    productQuantity: 0,
    productSize: "L",
    productColor: "BLACK",
    productMaterial: "COTTON",
    productSubPhotos: null,
    productSizeTable: [],
  });

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

  const onClickNextStep = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (step !== 3) {
      setStep((prev) => prev + 1);
    }
  };

  const onSubmitProduct = async () => {
    const res = await UPLOAD_PRODUCT();
  };

  return (
    <S.Wrapper ref={wrapRef}>
      <ProductPreview
        step={step}
        productInfo={productInfo}
        mainPreviews={mainPreviews}
        subPreviews={subPreviews}
      />
      <S.Divider hv={`${totalHeight}px`} />
      <ProductInputTag
        step={step}
        productInfo={productInfo}
        mainPreview={mainPreviews}
        subPreview={subPreviews}
        setProductInfo={setProductInfo}
        setMainPreview={setMainPreviews}
        setSubPreview={setSubPreviews}
      />
      <S.ButtonContainer step={step}>
        {step != 0 && <S.NextBtn onClick={onClickPrevStep}>이전</S.NextBtn>}
        {step != 3 && <S.NextBtn onClick={onClickNextStep}>다음</S.NextBtn>}
        {step == 3 && <S.NextBtn onClick={onClickNextStep}>업로드</S.NextBtn>}
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { ProductEditor };
