import * as S from "@/pages/brand/ui/css/BrandProductListPage.css";
import { Pagination, ProductCreateButton } from "@/shared";
import { BrandProductList } from "@/widgets";
import { useBrandProductList } from "../hooks/useBrandProductList";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

function BrandProductListPage() {
  const [searchParam, setSearchParam] = useSearchParams();

  const [page, setPage] = useState<number>(
    Number.parseInt(searchParam.get("page") ?? "0"),
  );
  const [size, setSize] = useState<number>(
    Number.parseInt(searchParam.get("size") ?? "0"),
  );

  const { data, error, loading } = useBrandProductList({ page, size });

  const totalLength = data ? data.length : 0;

  return (
    <S.Wrapper>
      <S.InfoContainer>
        <S.TextContainer>
          <S.BoldBlueText>총</S.BoldBlueText>
          <S.BoldText>{totalLength}건</S.BoldText>
        </S.TextContainer>
        <S.ButtonContainer>
          <ProductCreateButton />
        </S.ButtonContainer>
      </S.InfoContainer>
      <BrandProductList datas={data} />
      {totalLength !== 0 && (
        <Pagination
          page={page}
          size={size}
          totalPage={totalLength / size}
          setPage={setPage}
        />
      )}
    </S.Wrapper>
  );
}

export { BrandProductListPage };
