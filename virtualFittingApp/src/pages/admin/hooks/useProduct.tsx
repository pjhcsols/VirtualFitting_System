/*
 *
 * Basilium Product Key 에 따른 onChangeHook
 *
 * key 값은 Product 변수명을 key 값으로 입력하며,
 * 그에 알맞는 onChange 와 name, value 값을 전달받습니다.
 *
 * image 의 경우, thumbNail 을 같이 전달받습니다.
 *
 */

import { type ChangeEvent, useState } from "react";
import type {
  ProductInputType,
  useProductReturnType,
} from "@/pages/admin/types/Product.d";
import type { SizeType, MaterialType, ColorType } from "@/shared";

function useProduct<K extends keyof useProductReturnType>(
  key: K
): useProductReturnType[K] {
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

  const [productThumbNail, setProductThumbNail] = useState<
    string | ArrayBuffer | null
  >(null);
  const [productSubThumbNails, setProductSubThumbNails] = useState<
    (string | ArrayBuffer)[] | null
  >([]);

  const onChangeInputTag = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (
      [
        "productPrice",
        "productTotalLength",
        "productChest",
        "productShoulder",
        "productArm",
        "totalQuantity",
      ].includes(name)
    ) {
      const newValue = parseInt(value, 10);
      if (!isNaN(newValue)) {
        setProduct((prevProduct) => ({
          ...prevProduct,
          [name]: newValue,
        }));
      }
    } else {
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const onChangeMaterials = (values: MaterialType[]) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productMaterial: values,
    }));
  };

  const onChangeSizes = (values: SizeType[]) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productSize: values,
    }));
  };

  const onChangeColors = (values: ColorType[]) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productColor: values,
    }));
  };

  const onChangeCategory = ({ key, value }: { key: number; value: string }) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productCategory: {
        categoryId: key,
        categoryName: value,
      },
    }));
  };

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.error("[func.onChangeImage]: Image cannot loaded");
      return;
    }
    const { name, files } = e.target;
    if (name === "productPhotoUrl" || name === "productSubProductUrl") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          /*
           * File Reader Null포인터 예외처리
           */
          if (reader.result === null || reader.result === undefined) {
            console.error(
              "[func.onChangeImage]: FileReader cannot resolve file"
            );
            return;
          }
          if (name === "productPhotoUrl") {
            setProductThumbNail(reader.result);
          } else {
            setProductSubThumbNails((prev) => {
              if (!prev) {
                return [reader.result as string | ArrayBuffer];
              } else {
                return [...prev, reader.result as string | ArrayBuffer];
              }
            });
          }
          setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: [...prevProduct.productPhotoUrl, file.name],
          }));
        };
        reader.readAsDataURL(file);
      }
    }
    console.log(product);
  };

  const onDeleteImage = (name: string) => {
    if (name === "productPhotoUrl") {
      setProductThumbNail(null);
    } else {
      setProductSubThumbNails([]);
    }
  };

  switch (key) {
    case "productMaterial":
      return {
        name: key,
        value: product[key],
        onChange: (values: MaterialType[]) => onChangeMaterials(values),
      } as useProductReturnType[K];
    case "productSize":
      return {
        name: key,
        value: product[key],
        onChange: (values: SizeType[]) => onChangeSizes(values),
      } as useProductReturnType[K];
    case "productColor":
      return {
        name: key,
        value: product[key],
        onChange: (values: ColorType[]) => onChangeColors(values),
      } as useProductReturnType[K];
    case "productCategory":
      return {
        name: key,
        value: product[key],
        onChange: ({ key, value }: { key: number; value: string }) =>
          onChangeCategory({ key, value }),
      } as useProductReturnType[K];
    case "productPhotoUrl":
    case "productSubPhotoUrl":
      return {
        thumbNail:
          key === "productPhotoUrl" ? productThumbNail : productSubThumbNails,
        name: key,
        value: product[key],
        onChange: (e: ChangeEvent<HTMLInputElement>) => onChangeImage(e),
        onDelete: (name: string) => onDeleteImage(name),
      } as useProductReturnType[K];
    default:
      return {
        name: key,
        value: product[key],
        onChange: (e: ChangeEvent<HTMLInputElement>) => onChangeInputTag(e),
      } as useProductReturnType[K];
  }
}

export { useProduct };
