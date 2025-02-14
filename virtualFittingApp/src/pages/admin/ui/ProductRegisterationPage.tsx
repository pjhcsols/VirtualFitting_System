import styled from "styled-components";

import { type ChangeEvent, type MouseEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CategorySelectBar,
  CheckBox,
  type ColorType,
  type MaterialType,
  type SizeType,
} from "../../../shared";
import { type ProductInputType } from "../types/Product";
import {
  create_product,
  delete_product,
  update_product,
} from "../api/register.action";
import {
  ICON_CLOSE,
  colorOptions,
  materialsOptions,
  sizeOptions,
} from "../constants";

function ProductRegisterationPage() {
  const router = useNavigate();

  const [imageUrl, setImageUrl] = useState<string>("");
  const [detailedImageUrl, setDetailedImageUrl] = useState<string>("");

  const imageInputRef = useRef<HTMLInputElement>(null);
  const detailedImageInputRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState<ProductInputType>({
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

  const onChangeInputTag = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      [
        "productPrice",
        "productTotalLength",
        "productChest",
        "productShoulder",
        "productArm",
      ].includes(name)
    ) {
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue)) {
        setInputValue((prevInputValue) => ({
          ...prevInputValue,
          [name]: newValue,
        }));
      }
    } else {
      setInputValue((prevInputValue) => ({
        ...prevInputValue,
        [name]: value,
      }));
    }
  };

  const handleMaterialsChange = (values: MaterialType[]) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      productMaterial: values,
    }));
  };

  const handleSizesChange = (values: SizeType[]) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      productSize: values,
    }));
  };

  const handleColorsChange = (values: ColorType[]) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      productColor: values,
    }));
  };

  const onChangeCategory = ({ key, value }: { key: number; value: string }) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      productCategory: {
        categoryId: key,
        categoryName: value,
      },
    }));
  };

  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImageUrl(reader.result);
  //       setInputValue((prevInputValue) => ({
  //         ...prevInputValue,
  //         productPhotoUrl: [...prevInputValue.productPhotoUrl, file.name],
  //       }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleDeleteImage = () => {
    setImageUrl("");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      productPhotoUrl: [],
    }));
  };

  const handleDeleteDetailedImage = () => {
    setDetailedImageUrl("");
    if (detailedImageInputRef.current) {
      detailedImageInputRef.current.value = "";
    }

    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      productSubPhotoUrl: [],
    }));
  };

  const onSubmitDelete = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const res = await delete_product(inputValue.productId);
      if (res) {
        console.log(res);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log("error occuered");
    }
  };

  const onSubmitCreate = async (e: MouseEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const res = await create_product(inputValue);
      if (res) {
        console.log(res);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log("error occuered");
    }
  };

  const onSubmitUpdate = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const res = await update_product(inputValue);
      if (res) {
        console.log(res);
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log("error occuered");
    }
  };

  return (
    <Wrapper>
      <TitleContainer>
        <Title>상품 관리</Title>
      </TitleContainer>
      <DeleteBtn type="button" onClick={onSubmitDelete}>
        삭제
      </DeleteBtn>
      <Divider />
      <RegisterForm onSubmit={onSubmitCreate}>
        <FormInputContainer>
          <FormLabel>상품 명</FormLabel>
          <FormInput
            name="productName"
            type="text"
            value={inputValue.productName}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>가격</FormLabel>
          <FormInput
            name="productPrice"
            type="text"
            value={inputValue.productPrice}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>카테고리</FormLabel>
          <CategorySelectBar onChange={onChangeCategory} />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>소재</FormLabel>
          <CheckBox
            items={materialsOptions.map((material, index) => ({
              key: index,
              value: material,
            }))}
            onChange={handleMaterialsChange}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>크기</FormLabel>
          <CheckBox
            items={sizeOptions.map((size, index) => ({
              key: index,
              value: size,
            }))}
            onChange={handleSizesChange}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>색깔</FormLabel>
          <CheckBox
            items={colorOptions.map((color, index) => ({
              key: index,
              value: color,
            }))}
            onChange={handleColorsChange}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>총장</FormLabel>
          <FormInput
            name="productTotalLength"
            type="text"
            placeholder="cm"
            value={inputValue.productTotalLength}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>가슴둘레</FormLabel>
          <FormInput
            name="productChest"
            type="text"
            placeholder="cm"
            value={inputValue.productChest}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>어깨 길이</FormLabel>
          <FormInput
            name="productShoulder"
            type="text"
            placeholder="cm"
            value={inputValue.productShoulder}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>팔 길이</FormLabel>
          <FormInput
            name="productArm"
            type="text"
            placeholder="cm"
            value={inputValue.productArm}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>상세설명</FormLabel>
          <FormInput
            name="productDesc"
            type="text"
            value={inputValue.productDesc}
            onChange={(e) => onChangeInputTag(e)}
          />
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>이미지</FormLabel>
          <FormFileInput
            type="file"
            accept="image/*"
            // onChange={handleImageChange}
            ref={imageInputRef}
          />
          {imageUrl && (
            <ClosingImage
              src={ICON_CLOSE}
              alt="close-image"
              onClick={handleDeleteImage}
            />
          )}
        </FormInputContainer>
        <FormInputContainer>
          <FormLabel>상세 이미지</FormLabel>
          <FormFileInput
            type="file"
            accept="image/*"
            // onChange={handleImageChange}
            ref={imageInputRef}
          />
          {detailedImageUrl && (
            <ClosingImage
              src={ICON_CLOSE}
              alt="close-image"
              onClick={handleDeleteDetailedImage}
            />
          )}
        </FormInputContainer>
        <BtnContainer>
          <RegisterButton type="submit">등록하기</RegisterButton>
          <RegisterButton type="button" onClick={onSubmitUpdate}>
            수정하기
          </RegisterButton>
        </BtnContainer>
      </RegisterForm>
      <Divider />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 32px;
`;

const Divider = styled.div`
  width: 500px;
  height: 2px;
  background-color: black;
  margin: 0 auto;
  margin-bottom: 30px;
  border-radius: 1000px;
`;

const TitleContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const Title = styled.h1`
  display: inline-block;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 50px;
  background-color: red;
  color: #fff;
  width: 100px;
  height: 40px;
  cursor: pointer;
  border: none;
  border-radius: 500px;
  font-size: 12px;
`;

const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
  width: 500px;
  gap: 20px;
`;

const FormInputContainer = styled.div``;

const FormLabel = styled.label`
  font-weight: bold;
  margin-right: 20px;
`;

const FormInput = styled.input`
  padding: 8px;
  width: 120px;
  border-radius: 5px;
  background-color: #dee2e6;
  border: none;
`;

const FormFileInput = styled.input`
  padding: 5px 0 10px;
  width: auto;
  background-color: transparent;
  border: none;
  margin-right: 0;
`;

const BtnContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 100px;
`;

const RegisterButton = styled.button`
  align-self: center;
  background-color: #000;
  color: #fff;
  width: 190px;
  height: 60px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  margin-top: 5px;
  font-size: 20px;
  padding-top: 6px;
  cursor: pointer;
`;

const ClosingImage = styled.img`
  margin-left: 10px;
  margin-bottom: 37px;
  cursor: pointer;
`;

export { ProductRegisterationPage };
