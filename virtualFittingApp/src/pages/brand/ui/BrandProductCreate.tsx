import { ChangeEvent, useState } from "react";
import styled from "styled-components";

import { ClientProductDto, Color, Material } from "@/shared";
import {
  NumberInput,
  ProductImageUploader,
  ProductOptionUploader,
  SizeInput,
  TextInput,
} from "../components";
import { Colors, Materials } from "../constants";
import { ProductSizeOptionType } from "@/shared/types/product/product";
import { postProduct } from "../api/brand.action";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BrandProductCreate() {
  const router = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFreeSize, setIsFreeSize] = useState<boolean>(false);
  const [productInfo, setProductInfo] = useState<ClientProductDto>({
    productId: 0,
    status: "ON SALE",
    productCategory: {
      categoryId: 0,
      categoryName: "",
    },
    productName: "",
    productPrice: 0,
    productMaterial: [],
    productDesc: "",
    totalQuantity: 0,
    productOptions: [],
    productSizeOptions: [],
    productColorOptions: [],
    version: 0,
  });
  const [mainPhotos, setMainPhotos] = useState<File[]>([]);
  const [subPhotos, setSubPhotos] = useState<File[]>([]);

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setProductInfo((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev,
          [childKey]: value,
        },
      }));
    } else {
      setProductInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const onNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? 0 : Number(value);

    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      setProductInfo((prev) => ({
        ...prev,
        [parentKey]: {
          ...prev,
          [childKey]: numValue,
        },
      }));
    } else {
      setProductInfo((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    }
  };

  const onClickFreeSize = () => {
    const sizeOption: ProductSizeOptionType[] = [
      {
        id: {
          productId: productInfo.productId,
          productSize: "XX",
        },
        arm: 0,
        chest: 0,
        product: productInfo.productName,
        shoulder: 0,
        totalLength: 0,
      },
    ];
    setIsFreeSize((prev) => !prev);
    setProductInfo({
      ...productInfo,
      ["productSizeOptions"]: sizeOption,
    });
  };

  const onSubmitProduct = async () => {
    setIsLoading(true);
    const res = await postProduct(productInfo, mainPhotos, subPhotos);
    setIsLoading(false);
    if (res) {
      alert("상품 등록 완료!");
      router("/brand/product/list");
    }
  };

  return (
    <Wrapper>
      <InfoWrapper>
        <PhotoContainer>
          <ProductImageUploader />
        </PhotoContainer>
        <InfoContainer>
          <TextInput
            name="productName"
            title="상품 제목"
            value={productInfo.productName}
            onChange={onChangeText}
          />
          <NumberInput
            name="productPrice"
            title="상품 가격"
            value={productInfo.productPrice}
            onChange={onNumberChange}
          />
          <TextInput
            name="productDesc"
            title="상품 설명"
            value={productInfo.productName}
            onChange={onNumberChange}
          />
          <SubmitButton>
            <Upload />
          </SubmitButton>
        </InfoContainer>
      </InfoWrapper>
      <OptionContainer>
        <Title>색상</Title>
        <ColorContainer>
          {Colors.map((item: Color, key: number) => {
            return <ColorPallete color={item} key={key} />;
          })}
        </ColorContainer>
        <Title>재질</Title>
        <MaterialContainer>
          {Materials.map((item: Material, key: number) => {
            return (
              <MaterialBox clicked={true} key={key}>
                <span>{item}</span>
              </MaterialBox>
            );
          })}
        </MaterialContainer>
        <SizeTitleContainer>
          <Title>사이즈</Title>
          <ToggleBox>
            <ToggleText>프리 사이즈</ToggleText>
            <ToggleContainer onClick={onClickFreeSize} isOn={isFreeSize}>
              <ToggleCircle isOn={isFreeSize} />
            </ToggleContainer>
          </ToggleBox>
        </SizeTitleContainer>
        {!isFreeSize ? (
          <SizeInput sizeValue={productInfo.productSizeOptions} />
        ) : (
          <></>
        )}
      </OptionContainer>
      <ProductOptionUploader />
    </Wrapper>
  );
}

export { BrandProductCreate };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 2rem 4rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
`;

const InfoWrapper = styled.section`
  position: relative;
  box-sizing: border-box;
  padding: 2rem 3rem;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

const PhotoContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoContainer = styled.div`
  position: relative;
  width: 50%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.5rem;
`;

const OptionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2rem;
`;

const Title = styled.span`
  font-size: 1.2rem;
  font-weight: 500;
  color: black;
`;

const ColorContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 2rem;
`;

const ColorPallete = styled.div<{ color: string }>`
  width: 2rem;
  height: 2rem;
  border: 1px solid #d9d9d9;
  border-radius: 100%;
  background-color: ${(props) => props.color ?? "black"};
  cursor: pointer;
`;

const MaterialContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;

const MaterialBox = styled.div<{ clicked: boolean }>`
  width: 5rem;
  height: 3rem;
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s all ease;
  background-color: ${(props) => (props.clicked ? "black" : "transparent")};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => !props.clicked && "#d9d9d9"};
  }
  span {
    font-size: 0.65rem;
    font-weight: 500;
    color: ${(props) => (props.clicked ? "white" : "black")};
  }
`;

const SizeTitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
`;

const ToggleBox = styled.div`
  width: 200px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const ToggleText = styled.span`
  font-size: 0.7rem;
  font-weight: 500;
  color: black;
`;

const ToggleContainer = styled.div<{ isOn: boolean }>`
  width: 60px;
  height: 30px;
  background-color: ${({ isOn }) => (isOn ? "#4f46e5" : "#d1d5db")};
  border-radius: 9999px;
  padding: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const ToggleCircle = styled.div<{ isOn: boolean }>`
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  transform: ${({ isOn }) => (isOn ? "translateX(36px)" : "translateX(0)")};
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SubmitButton = styled.button`
  box-sizing: border-box;
  width: 100%;
  padding: 12px 32px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(90deg, #2563eb, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
