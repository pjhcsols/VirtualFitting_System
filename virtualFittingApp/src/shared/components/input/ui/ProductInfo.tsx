import * as S from "@/shared/components/input/ui/css/ProductInfo.css";

import type { ClientProductDto } from "@/shared";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type ProductInfoType = {
  productInfo: ClientProductDto;
  setProductInfo: Dispatch<SetStateAction<ClientProductDto>>;
};

function ProductInfo({ productInfo, setProductInfo }: ProductInfoType) {
  const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProductInfo({
      ...productInfo,
      ["productName"]: value,
    });
  };

  const onChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value === "") {
      setProductInfo({
        ...productInfo,
        ["productPrice"]: value,
      });
      return;
    }
    const parsed = Number(value);

    if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
      setProductInfo({
        ...productInfo,
        ["productPrice"]: value,
      }); // 정수로 저장
    }
  };

  const onChangeDesc = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setProductInfo({
      ...productInfo,
      ["productDescription"]: value,
    });
  };
  return (
    <S.InputContainer>
      <S.TitleInputContainer>
        <input
          type="text"
          value={productInfo.productName}
          id="input"
          onChange={onChangeTitle}
          required
        />
        <label htmlFor="input" className="label">
          상품 명
        </label>
        <div className="underline" />
      </S.TitleInputContainer>
      <S.TitleInputContainer>
        <input
          type="text"
          value={productInfo.productPrice}
          id="input"
          onChange={onChangePrice}
          required
        />
        <label htmlFor="input" className="label">
          상품 가격
        </label>
        <div className="underline" />
      </S.TitleInputContainer>
      <S.TitleInputContainer>
        <input
          type="text"
          value={productInfo.productDescription}
          id="input"
          onChange={onChangeDesc}
          required
        />
        <label htmlFor="input" className="label">
          상품 설명
        </label>
        <div className="underline" />
      </S.TitleInputContainer>
    </S.InputContainer>
  );
}

export { ProductInfo };
