import { useRef, useState } from "react";

import styled from "styled-components";
import { type ProductInputType } from "../types/Product";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CREATION_SYSTEM_MESSAGE } from "../constants";

function AdminCreateProductPage() {
  const router = useNavigate();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<ProductInputType>({
    productId: 0,
    productName: "",
    productPrice: "",
    productCategory: {
      categoryId: 0,
      categoryName: "",
    },
    productTotalLength: 0,
    productChest: 0,
    productShoulder: 0,
    productArm: 0,

    productDesc: "",

    productColor: [],
    productMaterial: [],
    productSize: [],

    productPhotoUrl: [],
    productSubPhotoUrl: [],

    totalQuantity: 0,
  });

  const onChangeProductPhoto = () => {};

  const onClickCardButton = () => {
    if (!imageInputRef.current) {
      return null;
    }
    imageInputRef.current.click();
  };

  return (
    <Wrapper>
      <Title>출고 상품 검토하기</Title>
      <ProductContainer>
        {/* Photo Upload Container */}
        <InputContainer>
          <InputBox>
            <ProductPhotoInput
              ref={imageInputRef}
              name="productPhotoUrl"
              onChange={onChangeProductPhoto}
            />
            <ProductPhotoCard onClick={onClickCardButton}></ProductPhotoCard>
          </InputBox>
        </InputContainer>

        {/* Detail Information Upload Container */}
        <InputContainer>
          {PRODUCT_CREATION_SYSTEM_MESSAGE.map((item, key) => {
            return (
              <InputBox>
                <InputLabel>{item.title}</InputLabel>
                <InputTag />
              </InputBox>
            );
          })}
        </InputContainer>
      </ProductContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 10px 140px;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const Title = styled.h1`
  font-family: "Prata-Regular";
  font-size: 2em;
  color: black;
`;

const ProductContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: start;
`;

const InputContainer = styled.div`
  box-sizing: border-box;
  padding: 0 24px;
  width: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: center;
  gap: 8px;
`;

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;

const InputLabel = styled.label`
  font-family: "Prata-Regular";
  font-size: 1em;
  color: black;
`;

const InputTag = styled.input.attrs({ type: "text" })`
  width: 100%;
  height: 3.75vw;
  border-radius: 18px;
  background: white;
  box-shadow: 4px 4px 20px 0px rgba(0, 0, 0, 0.25);
`;

const ProductPhotoInput = styled.input.attrs({ type: "file" })`
  display: none;
`;

const ProductPhotoCard = styled.button`
  overflow: hidden;
  width: 28em;
  height: 40em;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  background: gray;
`;

export { AdminCreateProductPage };
