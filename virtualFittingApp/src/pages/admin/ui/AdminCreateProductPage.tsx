import { useRef } from "react";

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { PRODUCT_CREATION_SYSTEM_MESSAGE } from "../constants";
import { useProduct } from "../hooks/useProduct";
import { ICON_CLOSE } from "@/shared/constants";

function AdminCreateProductPage() {
  const router = useNavigate();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const productName = useProduct("productName");
  const productPrice = useProduct("productPrice");
  const productCategory = useProduct("productCategory");

  const productTotalLength = useProduct("productTotalLength");

  const productChest = useProduct("productChest");
  const productShoulder = useProduct("productShoulder");
  const productArm = useProduct("productArm");

  const productDesc = useProduct("productDesc");

  const productColors = useProduct("productColor");
  const productMaterials = useProduct("productMaterial");
  const productSizes = useProduct("productSize");

  const productPhotoUrl = useProduct("productPhotoUrl");
  const productSubPhotoUrl = useProduct("productSubPhotoUrl");

  const productTotalQuantity = useProduct("totalQuantity");

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
          {productPhotoUrl.thumbNail ? (
            // div background url 에 전달할 때, reader 로 ArrayBuffer 가 나올 수 있어, 이에 대한 예외처리 필요
            <ProductPhotoCard
              src={productPhotoUrl.thumbNail ?? null}
              onClick={onClickCardButton}
            >
              <ProductPhotoInput
                ref={imageInputRef}
                name={productPhotoUrl.name}
                onChange={productPhotoUrl.onChange}
              />
              <CloseButton
                onClick={() => productPhotoUrl.onDelete("productPhotoUrl")}
              >
                <CloseIcon />
              </CloseButton>
            </ProductPhotoCard>
          ) : (
            <InputBox>
              <ProductPhotoInput
                ref={imageInputRef}
                name={productPhotoUrl.name}
                onChange={productPhotoUrl.onChange}
              />
              <ProductPhotoCardBtn onClick={onClickCardButton} />
            </InputBox>
          )}

          <InputBox>
            <ProductSmallPhotoCard></ProductSmallPhotoCard>
          </InputBox>
        </InputContainer>

        {/* Detail Information Upload Container */}
        <InputContainer>
          {PRODUCT_CREATION_SYSTEM_MESSAGE.map((item, key) => {
            return (
              <InputBox key={key}>
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
  align-items: start;
  gap: 32px;
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

const ProductPhotoCard = styled.div<{ src: string }>`
  position: relative;
  width: 25vw;
  height: 35vw;
  border-radius: 24px;
  transition: 0.25s all ease-out;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  background-image: url(${(props) => props.src});
  background-repeat: no-repeat;
  object-fit: fill;
  &:hover {
    transform: scale(1.005);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -0.5vw;
  right: -0.5vw;
  width: 2vw;
  height: 2vw;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff2f2;
  z-index: 20;
  cursor: pointer;
  box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.25);
`;

const CloseIcon = styled.img.attrs({ src: ICON_CLOSE, alt: "close-icon" })`
  width: 0.9vw;
  height: 0.9vw;
  object-fit: cover;
`;

const ProductPhotoInput = styled.input.attrs({ type: "file" })`
  display: none;
  opacity: 0;
`;

const ProductPhotoCardBtn = styled.button`
  overflow: hidden;
  width: 25vw;
  height: 35vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  background: #ececec;
  transition: 0.25s all ease-out;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    transform: scale(1.01);
  }
`;

const ProductSmallPhotoCard = styled.button`
  overflow: hidden;
  width: 5vw;
  height: 7.5vw;
  display: flex;
  border-radius: 8px;
  justify-content: center;
  align-items: center;
  background: #ececec;
  transition: 0.25s all ease-out;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  &:hover {
    transform: scale(1.01);
  }
`;

export { AdminCreateProductPage };
