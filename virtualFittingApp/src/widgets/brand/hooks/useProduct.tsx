import type { ClientProductDto, Color, Material, Size } from "@/shared";
import { type ChangeEvent, type MouseEvent, useState } from "react";
import { UPLOAD_PRODUCT } from "@/widgets/brand/api/brand.action";
import { ProductCreationSystemMessage } from "../constants";

export default function useProduct() {
  const [productInfo, setProductInfo] = useState<ClientProductDto>({
    productName: "",
    productDesc: "",
    productPrice: "",
    productColor: "BLACK",
    productMaterial: "COTTON",
    productMainPhotos: null,
    productSubPhotos: null,
    productSizeTable: [],
    productCategory: {
      categoryId: 0,
      categoryName: "",
    },
    productColorOptions: [],
    productOptions: [],
  });

  const [sizes, setSizes] = useState<Size[]>([]);

  const [mainPhotoPreviews, setMainPhotoPreviews] = useState<string[]>([]);
  const [mainPhotoError, setMainPhotoError] = useState<string | null>(null);

  const [subPhotoPreviews, setSubPhotoPreviews] = useState<string[]>([]);
  const [subPhotoError, setSubPhotoError] = useState<string | null>(null);

  const onChangeProductName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length >= 64) {
      return;
    }
    setProductInfo({
      ...productInfo,
      ["productName"]: value,
    });
  };

  const onChangeProductDesc = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length > 255) {
      return;
    }
    setProductInfo({
      ...productInfo,
      ["productDesc"]: value,
    });
  };

  const onChangeProductPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value.length >= 10) {
      return;
    }
    if (Number.isNaN(value)) {
      return;
    }
    const price = Number(value);
    setProductInfo({
      ...productInfo,
      ["productPrice"]: price,
    });
  };

  const onChangeProductSize = (size: Size) => {
    const updatedArray: Size[] = sizes;
    updatedArray.push(size);
  };

  const onChangeProductMaterial = (material: Material) => {
    setProductInfo({
      ...productInfo,
      ["productMaterial"]: material,
    });
  };

  const onChangeProductColor = (color: Color) => {
    setProductInfo({
      ...productInfo,
      ["productColor"]: color,
    });
  };

  const onChangeMainPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length == 0) {
      setMainPhotoError(ProductCreationSystemMessage.NO_MAIN_PHOTO);
      return;
    }
    if (files.length > 9) {
      setMainPhotoError(ProductCreationSystemMessage.OVER_MAIN_PHOTO);
      return;
    }

    const photoArray: File[] = [];
    const photoPreviewArray: string[] = [];
    for (const file of files) {
      photoArray.push(file);
      photoPreviewArray.push(URL.createObjectURL(file));
    }
    setProductInfo({
      ...productInfo,
      ["productMainPhotos"]: photoArray,
    });
    setMainPhotoPreviews(photoPreviewArray);
  };

  const onModifyMainPhotos = ({
    e,
    index,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    index: number;
  }) => {
    const { files } = e.target;
    if (!files || !(files.length === 1)) {
      setMainPhotoError(ProductCreationSystemMessage.MODIFY_PHOTO_ERR);
      return;
    }
    if (!productInfo.productMainPhotos) {
      setMainPhotoError(ProductCreationSystemMessage.PHOTO_ERR);
      return;
    }
    const updatedMainPhotos: File[] | null = [
      ...productInfo.productMainPhotos?.slice(0, index),
      files[0],
      ...productInfo.productMainPhotos?.slice(
        index,
        productInfo.productMainPhotos.length,
      ),
    ];
    setProductInfo({
      ...productInfo,
      ["productMainPhotos"]: updatedMainPhotos,
    });
  };

  const onDeleteMainPhotos = (target: number) => {
    if (!productInfo.productMainPhotos) {
      return;
    }
    const updatedMainPhotos: File[] | null =
      productInfo.productMainPhotos?.filter((_, index) => index !== target);

    setProductInfo({
      ...productInfo,
      ["productMainPhotos"]: updatedMainPhotos,
    });
  };

  const onChangeSubPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || files.length == 0) {
      setSubPhotoError(ProductCreationSystemMessage.NO_SUB_PHOTO);
      return;
    }
    if (files.length > 9) {
      setSubPhotoError(ProductCreationSystemMessage.OVER_SUB_PHOTO);
      return;
    }

    const photoArray: File[] = [];
    const subPhotoPreviewArray: string[] = [];
    for (const file of files) {
      photoArray.push(file);
      subPhotoPreviewArray.push(URL.createObjectURL(file));
    }
    setProductInfo({
      ...productInfo,
      ["productSubPhotos"]: photoArray,
    });
    setSubPhotoPreviews(subPhotoPreviewArray);
  };

  const onModifySubPhotos = ({
    e,
    index,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    index: number;
  }) => {
    const { files } = e.target;
    if (!files || !(files.length === 1)) {
      setSubPhotoError(ProductCreationSystemMessage.MODIFY_PHOTO_ERR);
      return;
    }
    if (!productInfo.productSubPhotos) {
      setSubPhotoError(ProductCreationSystemMessage.PHOTO_ERR);
      return;
    }
    const updatedSubPhotos: File[] | null = [
      ...productInfo.productSubPhotos?.slice(0, index),
      files[0],
      ...productInfo.productSubPhotos?.slice(
        index,
        productInfo.productSubPhotos.length,
      ),
    ];
    setProductInfo({
      ...productInfo,
      ["productSubPhotos"]: updatedSubPhotos,
    });
  };

  const onDeleteSubPhotos = (target: number) => {
    if (!productInfo.productSubPhotos) {
      return;
    }
    const updatedSubPhotos: File[] | null =
      productInfo.productSubPhotos?.filter((_, index) => index !== target);

    setProductInfo({
      ...productInfo,
      ["productSubPhotos"]: updatedSubPhotos,
    });
  };

  const onChangeProductCategory = () => {};

  const onSubmitProduct = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const res = await UPLOAD_PRODUCT();
  };

  return {
    productInfo,
    mainPhotoPreviews,
    subPhotoPreviews,
    mainPhotoError,
    subPhotoError,
    onChangeProductName,
    onChangeProductDesc,
    onChangeProductPrice,
    onChangeProductColor,
    onChangeProductMaterial,
    onChangeMainPhotos,
    onModifyMainPhotos,
    onDeleteMainPhotos,
    onChangeSubPhotos,
    onModifySubPhotos,
    onDeleteSubPhotos,
    onChangeProductCategory,
    onSubmitProduct,
  };
}
