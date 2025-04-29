import * as S from "@/pages/brand/ui/css/BrandDashboard.css";
import { DashboardObject } from "@/shared";

function BrandDashboard() {
  return (
    <S.Wrapper>
      <DashboardObject type="upload" />
      <DashboardObject type="list" />
      <DashboardObject type="analytics" />
      <DashboardObject type="logout" />
    </S.Wrapper>
  );
}

export { BrandDashboard };
