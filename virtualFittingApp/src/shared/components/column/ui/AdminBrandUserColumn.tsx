import * as S from "@/shared/components/column/ui/css/AdminBrandUserColumn.css";

type AdminBrandUserColumnType = {
  id?: string;
  className?: string;
  title: string;
  address: string;
  isAuthenticate: boolean;
  onAgree: () => void;
  onDelete: () => void;
};

function AdminBrandUserColumn({
  id,
  className,
  title,
  address,
  isAuthenticate,
  onAgree,
  onDelete,
}: AdminBrandUserColumnType) {
  return (
    <S.Wrapper id={id} className={className}>
      <S.LogoContainer>
        <S.Logo />
      </S.LogoContainer>
      <S.NameContainer>
        <S.Name>{title}</S.Name>
      </S.NameContainer>
      <S.AddressContainer>
        <S.Address>{address}</S.Address>
      </S.AddressContainer>
      <S.ButtonContainer>
        <S.AgreeButton onClick={onDelete}>Agree</S.AgreeButton>
        <S.DeleteButton onClick={onDelete}>Delete</S.DeleteButton>
      </S.ButtonContainer>
    </S.Wrapper>
  );
}

export { AdminBrandUserColumn };
