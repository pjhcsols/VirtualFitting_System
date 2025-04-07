import * as S from "@/widgets/admin/ui/css/ProductEditor.css";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import type {
  Color,
  Material,
  Size,
  SizeTable,
} from "@/widgets/admin/types/Product";
import { UPLOAD_PRODUCT } from "@/widgets/admin/api/admin.action";
import ProductPreview from "@/widgets/admin/ui/ProductPreview";
import ProductInputTag from "@/widgets/admin/ui/ProductInputTag";

function ProductEditor() {
  const wrapRef = useRef<HTMLDivElement>(null);

  const [totalHeight, setTotalHeight] = useState<number>(0);
  const [step, setStep] = useState<number>(0);

  const [mainPhotos, setMainPhotos] = useState<FileList | null>(null);
  const [mainPreviews, setMainPreviews] = useState<string[] | null>([]);

  const [subPhotos, setSubPhotos] = useState<FileList | null>(null);
  const [subPreviews, setSubPreviews] = useState<string[] | null>(null);

  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<number | string>("");

  const [productSizeTable, setProductSizeTable] = useState<SizeTable[]>([
    {
      productArm: 0,
      productChest: 0,
      productShoulder: 0,
      productTotalLength: 0,
    },
  ]);

  const [productSize, setProductSize] = useState<Size>("S");
  const [productMaterial, setProductMaterial] = useState<Material>("COTTON");
  const [productColor, setProductColor] = useState<Color>("BLACK");
  const [productQuantity, setProductQuantity] = useState<number>(0);

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
        mainPhotos={mainPreviews}
        subPhotos={subPreviews}
        productPrice={productPrice}
        productColor={productColor}
        productDescription={productDescription}
        productMaterial={productMaterial}
        productName={productName}
        productQuantity={productQuantity}
        productSize={productSize}
        productSizeTable={productSizeTable}
      />
      <S.Divider hv={`${totalHeight}px`} />
      <ProductInputTag
        step={step}
        setMainPhotos={setMainPhotos}
        setMainPreview={setMainPreviews}
        setSubPhotos={setSubPhotos}
        setSubPreview={setSubPreviews}
        setProductColor={setProductColor}
        setProductMeterial={setProductMaterial}
        setProductQuantity={setProductQuantity}
        setProductSize={setProductSize}
        setProductSizeTable={setProductSizeTable}
        setProductName={setProductName}
        setProductDesc={setProductDescription}
        setProductPrice={setProductPrice}
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
