/* New design of Basilium */

import * as S from "@/pages/admin/ui/css/AdminProductListPage.css";
import { Pagination, SearchBar } from "@/shared";
import { BrandProductList } from "@/widgets";

function AdminProductListPage() {
  return (
    <S.Wrapper>
      <S.Title>출고 상품 목록</S.Title>
      <S.SearchBarContainer>
        <SearchBar />
      </S.SearchBarContainer>
      <S.ProductListContainer>
        <BrandProductList />
      </S.ProductListContainer>
      <Pagination currIdx={1} totalIdx={10} />
    </S.Wrapper>
  );
}

export { AdminProductListPage };
