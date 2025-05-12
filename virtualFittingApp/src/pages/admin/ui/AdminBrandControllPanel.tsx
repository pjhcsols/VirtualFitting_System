import * as S from "@/pages/admin/ui/css/AdminBrandControllPanel.css";
import { Pagination } from "@/shared";
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
      <AdminBrandUserList />
      <Pagination page={page} size={10} totalPage={10} setPage={setPage} />
    </S.Wrapper>
  );
}

export { AdminBrandControllPanel };
