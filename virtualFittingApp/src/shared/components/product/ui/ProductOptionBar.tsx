import * as S from "@/shared/components/product/ui/css/ProductOptionBar.css";
import { OptionTitles } from "@/shared/constants";
import { SizeTable } from "@/shared/types";
import { type MouseEvent, useState } from "react";

type ProductOpitonBar = {
  sizeTable: SizeTable[];
  subProductImages: string[] | null;
  FAQInfo: string[];
  customerApply: string[];
};

function ProductOptionBar({
  sizeTable,
  subProductImages,
  FAQInfo,
  customerApply,
}: ProductOpitonBar) {
  const [option, setOption] = useState<number>(0);
  const onClickOption = (e: MouseEvent<HTMLDivElement>, idx: number) => {
    e.preventDefault();
    if (idx < 3 && idx >= 0) {
      setOption(idx);
    }
  };

  const ShowContent = () => {
    if (option === 1) {
      {
        subProductImages?.map((item, key) => {
          return (
            <S.InfoContentImage src={item} alt={`Info-${key}`} key={key} />
          );
        });
      }
    } else {
      return <S.ContentContainer></S.ContentContainer>;
    }
  };

  return (
    <S.Wrapper>
      <S.OptionBar>
        {OptionTitles.map((item: string, key: number) => {
          return (
            <S.Option
              isClicked={option === key}
              key={key}
              onClick={(e) => onClickOption(e, key)}
            >
              {item}
            </S.Option>
          );
        })}
      </S.OptionBar>
      <S.ContentContainer>{ShowContent()}</S.ContentContainer>
    </S.Wrapper>
  );
}

export { ProductOptionBar };
