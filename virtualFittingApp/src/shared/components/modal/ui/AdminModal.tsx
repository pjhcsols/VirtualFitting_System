import * as S from "@/shared/components/modal/ui/css/AdminModal.css";
import { ICON_EMAIL } from "@/shared/constants";
import { useEffect } from "react";

type AdminModalType = {
  href?: string;
  children: React.ReactNode;
};

function AdminModal({ href, children }: AdminModalType) {
  const onClickModal = () => {
    window.location.href = "#modal";
  };

  useEffect(() => {
    const modal = document.getElementById("modal");
    window.addEventListener("popstate", () => {
      if (!modal) {
        console.warn("Modal ID 를 찾을 수 없습니다.");
        return;
      }

      if (window.location.hash === "#modal") {
        modal.focus();
        modal.setAttribute("aria-hidden", "false");
        return;
      }

      modal.setAttribute("aria-hidden", "true");
    });

    window.addEventListener("keydown", (e) => {
      if (e.key == "Escape" && window.location.hash === "#modal") {
        window.location.hash = "";
      }
    });
  }, []);

  return (
    <S.ModalContainer>
      <S.ModalIcon src={ICON_EMAIL} alt="icon-email" onClick={onClickModal} />
      <S.ModalWrapper role="dialog" aria-labelledby="modal-title" id="modal">
        <S.HeaderAnchor className="modal-overlay" href="#" tabIndex={-1} />
        <S.ModalContent className="modal-content">
          <S.CloseModalAnchor
            title="Close Modal"
            aria-label="Close Modal"
            href={href ?? "#"}
            className="modal-close"
          >
            &times;
          </S.CloseModalAnchor>
          {children}
        </S.ModalContent>
      </S.ModalWrapper>
    </S.ModalContainer>
  );
}

export { AdminModal };
