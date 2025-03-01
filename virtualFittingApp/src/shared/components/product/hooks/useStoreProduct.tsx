import { postShoppingCartAPI, sendHeartAPI } from "@/shared/action";
import { ColorType, SizeType } from "@/shared/types";
import { ChangeEvent, MouseEvent, useState } from "react";

type ProductOptionType = {
  size: SizeType | null;
  color: ColorType | null;
  amount: number;
};

type ProductOptionsType = {
  sizes: SizeType[];
  colors: ColorType[];
};

function useStoreProduct(productId: number) {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const [productOptions, setProductOptions] = useState<ProductOptionsType>({
    sizes: [],
    colors: [],
  });

  const [selectedOption, setSelectedOption] = useState<ProductOptionType>({
    color: null,
    size: null,
    amount: 0,
  });

  const onChangeOption = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedOption({
      ...selectedOption,
      [name]: value,
    });
  };

  const onClickHeart = async (e: MouseEvent<HTMLDivElement>) => {
    // Block Event Handling
    e.stopPropagation();
    const res = await sendHeartAPI({ productId });
    if (res) {
      console.log("하트 성공 ><");
    } else {
      console.log("하트 실패..");
    }
  };

  const onSubmitShoppingCart = async () => {
    const res = await postShoppingCartAPI({
      productId,
      option: selectedOption,
    });
  };

  return {
    isLiked,
    productOptions,
    selectedOption,
    onChange: onChangeOption,
    onClickHeart,
    onSubmit: onSubmitShoppingCart,
  };
}

export { useStoreProduct };
