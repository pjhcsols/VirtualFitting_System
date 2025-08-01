import { AdminBrandUserColumn } from "@/shared";
import * as S from "@/widgets/admin/ui/css/AdminBrandUserList.css";
import { DELETE_BRAND_USER } from "../api/admin.action";

function AdminBrandUserList() {
  const onDeleteUser = async (idx: number) => {};

  return (
    <S.UserListContainer>
      <S.TitleContainer>
        <S.Title>Brand 승낙 관리</S.Title>
      </S.TitleContainer>
      <S.ContentContainer>
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDeleteUser(1)}
          onDelete={() => onDeleteUser(1)}
        />
      </S.ContentContainer>
    </S.UserListContainer>
  );
}

export { AdminBrandUserList };
