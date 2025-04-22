import * as S from "@/shared/components/input/ui/css/CategorySelector.css";
import type { ProductCategory } from "@/shared/types";
import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  useState,
} from "react";

type CategorySelectorType = {
  categoryName: string;
  categoryId: number;
  productCategory: ProductCategory[];
  setProductCategory: Dispatch<SetStateAction<ProductCategory[]>>;
};

function CategorySelector({
  productCategory,
  categoryId,
  categoryName,
  setProductCategory,
}: CategorySelectorType) {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const onClickBox = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsClicked((prev) => !prev);
    setProductCategory((prevCategories) => {
      const exists = prevCategories.some(
        (category) => category.categoryId === categoryId,
      );

      if (exists) {
        return prevCategories.filter(
          (category) => category.categoryId !== categoryId,
        );
      } else {
        return [
          ...prevCategories,
          {
            categoryId: categoryId,
            categoryName: categoryName,
          },
        ];
      }
    });
  };
  return (
    <S.Box isClicked={isClicked} onClick={onClickBox}>
      <div className="dot" />
      <span className="text">{categoryName}</span>
    </S.Box>
  );
}

type CategoryViewerType = {
  categoryName: string;
  categoryId: number;
  productCategory: ProductCategory[];
};

function CategoryViewer({
  categoryId,
  categoryName,
  productCategory,
}: CategoryViewerType) {
  if (productCategory.some((category) => category.categoryId === categoryId)) {
    return (
      <S.ViewBox isClicked={true}>
        <div className="dot" />
        <span className="text">{categoryName}</span>
      </S.ViewBox>
    );
  } else {
    return (
      <S.ViewBox isClicked={false}>
        <div className="dot" />
        <span className="text">{categoryName}</span>
      </S.ViewBox>
    );
  }
}

export { CategorySelector, CategoryViewer };
