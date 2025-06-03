import * as S from "@/pages/admin/ui/css/AdminBrandControllPanel.css";
import { AdminModal, BrandSearch, Pagination } from "@/shared";
import { AdminBrandUserList } from "@/widgets";
import { useEffect, useState } from "react";

function AdminBrandControllPanel() {
  const [brandUserList, setBrandUserList] = useState(null);

  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    /*
     * Brand User 정보들을 가져올 수 있도록하는
     * API 로직 해당시키기
     */
  }, [page]);
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <S.Title>Brand User List</S.Title>
      </S.TitleContainer>
      <S.OptionWrapper>
        <S.SearchBarBox>
          <BrandSearch placeholder="Ex) 회원 번호를 입력해주세요. 1, 2, 3 ..." />
        </S.SearchBarBox>
        <AdminModal>
          <AdminBrandUserList />
        </AdminModal>
      </S.OptionWrapper>
    </S.Wrapper>
  );
}

export { AdminBrandControllPanel };
