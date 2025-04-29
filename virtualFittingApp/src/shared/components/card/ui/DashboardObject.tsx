import { type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

/* CSS */
import * as S from "@/shared/components/card/ui/css/DashboardObject.css";

/* Types */
import { type DashboardObjectType } from "@/shared/components/card/types/DashboardObject";

function DashboardObject({ type }: { type: DashboardObjectType }) {
  const router = useNavigate();
  const convertText = (): string => {
    if (type === "upload") {
      return "제품 생성";
    } else if (type === "list") {
      return "제품 목록";
    } else if (type === "logout") {
      return "로그아웃";
    } else if (type === "analytics") {
      return "시장 분석";
    } else if (type === "profile") {
      return "정보 수정";
    }
    return "";
  };

  const onClickDashBoardObject = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setTimeout(() => {
      if (type === "upload") {
        router("/brand/create");
      } else if (type === "list") {
        router("/brand/list?page=0&size=10");
      } else if (type === "analytics") {
        router("/brand/analytics");
      } else if (type === "profile") {
        router("/brand/my");
      }
    }, 700);
  };

  return (
    <S.ButtonObject type={type} onClick={onClickDashBoardObject}>
      <span className="shadow" />
      <span className="edge" />
      <span className="front">{convertText()}</span>
    </S.ButtonObject>
  );
}

export { DashboardObject };
