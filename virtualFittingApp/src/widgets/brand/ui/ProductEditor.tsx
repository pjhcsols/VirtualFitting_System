import * as S from "@/widgets/brand/ui/css/ProductEditor.css";
import {
  DragablePhotoList,
  FileDragAndDrop,
  ProductColor,
  ProductDescription,
  ProductMaterial,
  ProductNameInput,
  ProductPriceInput,
  ProductSize,
  SizeTable,
  SubFileDragAndDrop,
  type Color,
  type Material,
  type Size,
} from "@/shared";
import useProduct from "@/widgets/brand/hooks/useProduct";
import SizeOption from "@/widgets/brand/test/sizeOption.json";
import { Colors, Materials, Sizes } from "../constants";

function ProductEditor() {
  const {
    productInfo,
    mainPhotoPreviews,
    subPhotoPreviews,
    onChangeProductName,
    onChangeProductPrice,
    onChangeProductDesc,
    onChangeProductColor,
    onChangeMainPhotos,
    onModifyMainPhotos,
    onDeleteMainPhotos,
    onChangeSubPhotos,
    onModifySubPhotos,
    onDeleteSubPhotos,
    onChangeProductCategory,
    onChangeProductMaterial,
    onSubmitProduct,
  } = useProduct();
  return (
    <S.Wrapper>
      <S.InfoWrapper>
        <S.PhotoContainer>
          {productInfo.productMainPhotos ? (
            <DragablePhotoList
              photoUrls={mainPhotoPreviews}
              onModifyPhoto={onModifyMainPhotos}
              onDeletePhoto={onDeleteMainPhotos}
            />
          ) : (
            <FileDragAndDrop onChange={onChangeMainPhotos} />
          )}
        </S.PhotoContainer>
        <S.InfoContainer>
          <ProductNameInput
            text={productInfo.productName}
            onChange={onChangeProductName}
            placeholder="상품 명"
          />
          <ProductPriceInput
            text={productInfo.productPrice}
            onChange={onChangeProductPrice}
            placeholder="상품 가격"
          />
          <ProductDescription
            text={productInfo.productDesc}
            onChange={onChangeProductDesc}
            placeholder="상품 설명"
          />
          <S.SizeContainer>
            <S.DescriptionText>사이즈</S.DescriptionText>
            <S.SizeBox>
              {Sizes.map((item: Size, key: number) => {
                return (
                  <ProductSize
                    isClicked={productInfo.productOptions.some(
                      (option) => option.productSize === item,
                    )}
                    key={key}
                  >
                    {item}
                  </ProductSize>
                );
              })}
            </S.SizeBox>
          </S.SizeContainer>
          <S.ColorContainer>
            <S.DescriptionText>색상</S.DescriptionText>
            <S.ColorBox>
              {Colors.map((item: Color, key: number) => {
                return (
                  <ProductColor
                    color={item}
                    key={key}
                    isClicked={productInfo.productColor === item}
                    onClick={() => onChangeProductColor(item)}
                  />
                );
              })}
            </S.ColorBox>
          </S.ColorContainer>
          <S.MaterialContainer>
            <S.DescriptionText>상품 소재</S.DescriptionText>
            <S.MaterialBox>
              {Materials.map((item: Material, key: number) => {
                return <ProductMaterial key={key}>{item}</ProductMaterial>;
              })}
            </S.MaterialBox>
          </S.MaterialContainer>
          <S.ButtonContainer>
            <S.SubmitButton>Preview</S.SubmitButton>
            <S.SubmitButton>Upload</S.SubmitButton>
          </S.ButtonContainer>
        </S.InfoContainer>
      </S.InfoWrapper>
      <S.Divider />
      <S.SizeTableContainer>
        <S.SizeText>사이즈 표</S.SizeText>
        <SizeTable sizeDatas={SizeOption} />
      </S.SizeTableContainer>
      <S.Divider />
      <S.SubPhotoContainer>
        {productInfo.productSubPhotos ? (
          <DragablePhotoList
            photoUrls={subPhotoPreviews}
            onModifyPhoto={onModifySubPhotos}
            onDeletePhoto={onDeleteSubPhotos}
          />
        ) : (
          <SubFileDragAndDrop onChange={onChangeSubPhotos} />
        )}
      </S.SubPhotoContainer>
    </S.Wrapper>
  );
}

export { ProductEditor };
