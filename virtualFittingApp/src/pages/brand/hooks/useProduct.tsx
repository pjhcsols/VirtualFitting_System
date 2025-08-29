import { ClientProductDto } from "@/shared";
import { useState } from "react";

function useProduct() {
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

  const onChangeStringNumber =
    (field: keyof ClientProductDto) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setProductInfo((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  // * 2중 객체용
  const onChangeCategory =
    <T extends keyof ClientProductDto, K extends keyof ClientProductDto[T]>(
      parentField: T,
      childField: K,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "number" ? Number(e.target.value) : e.target.value;
      setProductInfo((prev) => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [childField]: value,
        },
      }));
    };

  // * Material
  const onChangeMaterialOptions =
    (field: keyof ClientProductDto, index: number) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setProductInfo((prev) => {
        const newArray = [...(prev[field] as any[])];
        newArray[index] = e.target.value;
        return {
          ...prev,
          [field]: newArray,
        };
      });
    };

  // * ColorOptions, SizeOptions, Options
  const onChangeArray = {
    add: (field: keyof ClientProductDto, newItem: any = "") => {
      setProductInfo((prev) => ({
        ...prev,
        [field]: [...(prev[field] as any[]), newItem],
      }));
    },
    remove: (field: keyof ClientProductDto, index: number) => {
      setProductInfo((prev) => ({
        ...prev,
        [field]: (prev[field] as any[]).filter((_, i) => i !== index),
      }));
    },
  };

  return {
    productInfo,
    onChangeStringNumber,
  };
}

export { useProduct };
