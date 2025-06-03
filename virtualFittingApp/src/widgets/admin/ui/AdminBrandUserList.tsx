import { AdminBrandUserColumn } from "@/shared";
import * as S from "@/widgets/admin/ui/css/AdminBrandUserList.css";
import gsap from "gsap";
import { useEffect } from "react";
import { DELETE_BRAND_USER } from "../api/admin.action";
import { useGSAP } from "@gsap/react";

function AdminBrandUserList() {
  const { contextSafe } = useGSAP();

  useEffect(() => {
    gsap.fromTo(
      ".user-column",
      {
        y: 10,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      },
    );
  }, []);

  const onDelete = contextSafe((idx: number) => {
    onDeleteUser(idx);
  });

  const onDeleteUser = async (idx: number) => {
    const height = document.querySelector(".user-column")?.scrollHeight;
    const target = document.querySelector(`#brand-user-${idx}`);
    const tl = gsap.timeline({});
    const res = await DELETE_BRAND_USER({ idx });
    if (res) {
      alert("");
    }
    if (height && target) {
      tl.fromTo(
        `#brand-user-${idx}`,
        {
          y: 0,
          opacity: 1,
          display: "flex",
        },
        {
          y: -10,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        },
      );
      tl.to(".user-column", {
        y: -height,
        stagger: 0.1,
        duration: 1,
        ease: "power4.out",
      });
    }
  };

  return (
    <S.UserListContainer>
      <S.TitleContainer>
        <S.Title>BrandUser 관리 목록</S.Title>
      </S.TitleContainer>
      <S.Divider />
      <S.ContentContainer>
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
        <AdminBrandUserColumn
          title="Test용입니다."
          address="경상남도 어딘가에 있는 곳"
          isAuthenticate={true}
          className="user-column"
          onAgree={() => onDelete(1)}
          onDelete={() => onDelete(1)}
        />
      </S.ContentContainer>
    </S.UserListContainer>
  );
}

export { AdminBrandUserList };
