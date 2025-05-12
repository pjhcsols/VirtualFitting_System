import * as S from "@/pages/admin/ui/css/AdminBrandControllPanel.css";
import { AdminBrandUserList } from "@/widgets";

function AdminBrandControllPanel() {
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <S.Title>Brand User List</S.Title>
      </S.TitleContainer>
      <AdminBrandUserList />
    </S.Wrapper>
  );
}

export { AdminBrandControllPanel };
