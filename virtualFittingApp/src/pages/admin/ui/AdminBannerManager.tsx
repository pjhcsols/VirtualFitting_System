import * as S from "@/pages/admin/ui/css/AdminBannerManager.css";
import { AdminSliderEditor } from "@/widgets";

function AdminBannerManager() {
  return (
    <S.Wrapper>
      <S.TitleContainer>
        <S.Title>Banner Management</S.Title>
      </S.TitleContainer>
      <S.SliderContainer>
        <AdminSliderEditor />
      </S.SliderContainer>
    </S.Wrapper>
  );
}

export { AdminBannerManager };
