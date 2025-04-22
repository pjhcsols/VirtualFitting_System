import {
  CheckMarkAnimation,
  ClientProductDto,
  hasProductCategory,
  isDescLengthValid,
  isFileCountValid,
  isNumberInRange,
  isProductSizeTableValid,
  isTitleLengthValid,
  ProductCategory,
  XMarkAnimation,
} from "@/shared";
import { CheckOptions, ICON_LOADING } from "@/shared/constants";
import * as S from "@/widgets/admin/ui/css/JudgeStandard.css";
import gsap from "gsap";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

type JudgeStandardType = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  productInfo: ClientProductDto;
  productCategory: ProductCategory[];
};

function JudgeStandard({
  setStep,
  step,
  productCategory,
  productInfo,
}: JudgeStandardType) {
  const [checkedOption, setCheckedOption] = useState<number[]>([
    0, 0, 0, 0, 0, 0, 0,
  ]);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      ".message",
      {
        y: -100,
        opacity: 0,
      },
      {
        y: 0,
        stagger: 0.25,
        duration: 2,
        opacity: 1,
        ease: "power3.out",
      },
    );
    console.log(productInfo);
  }, []);

  useEffect(() => {
    if (isTitleLengthValid(productInfo.productName)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 0 ? 1 : -1)),
      );
    }
    if (isDescLengthValid(productInfo.productDescription)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 1 ? 1 : -1)),
      );
    }
    if (isNumberInRange(productInfo.productPrice)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 2 ? 1 : -1)),
      );
    }
    if (isFileCountValid(productInfo.productMainPhotos)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 3 ? 1 : -1)),
      );
    }
    if (hasProductCategory(productCategory)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 4 ? 1 : -1)),
      );
    }
    if (isProductSizeTableValid(productInfo.productSizeTable)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 5 ? 1 : -1)),
      );
    }
    if (isFileCountValid(productInfo.productSubPhotos)) {
      setCheckedOption((prevOptions) =>
        prevOptions.map((_, index) => (index === 6 ? 1 : -1)),
      );
    }
    console.log(checkedOption);
  }, []);

  const ShowJudge = (index: number) => {
    if (index === 1) {
      return <CheckMarkAnimation />;
    } else if (index === 0) {
      <S.LoadingIcon src={ICON_LOADING} alt="loading-icon" />;
    } else {
      <XMarkAnimation />;
    }
  };

  return (
    <S.Wrapper>
      <S.InfoContainer>
        {CheckOptions.map((item: string, key: number) => {
          return (
            <S.CheckBox key={key} className="message">
              {ShowJudge(checkedOption[key])}
              <S.CheckTitle>{item}</S.CheckTitle>
            </S.CheckBox>
          );
        })}
      </S.InfoContainer>
      <S.BtnContainer>
        <S.AddTableButton>
          <span className="shadow" />
          <span className="edge" />
          <span className="front">PREVIEW</span>
        </S.AddTableButton>
        <S.AddTableButton>
          <span className="shadow" />
          <span className="edge" />
          <span className="front">업로드</span>
        </S.AddTableButton>
      </S.BtnContainer>
    </S.Wrapper>
  );
}

export { JudgeStandard };
