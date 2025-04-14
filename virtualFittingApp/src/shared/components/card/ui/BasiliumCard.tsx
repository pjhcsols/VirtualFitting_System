import type { BrandUserType } from "@/pages/brand/types/brandUser";
import * as S from "@/shared/components/card/ui/css/BasiliumCard.css";
import { useNavigate } from "react-router-dom";

type BasiliumCardType = {
  brandInfo: BrandUserType;
};

function BasiliumCard({ brandInfo }: BasiliumCardType) {
  const router = useNavigate();

  const onClickCard = () => {
    router(brandInfo.firmWebUrl);
  };

  return (
    <S.Card onClick={onClickCard}>
      <S.CardInner>
        <S.CardFront>
          <S.CardRow>
            <S.BasiliumLogo />
            <S.BasiliumText>Basilium</S.BasiliumText>
          </S.CardRow>
          <S.CardInfoContainer>
            <span className="firm-text">{brandInfo.firmName}</span>
            <span className="address-text">{brandInfo.firmAddress}</span>
          </S.CardInfoContainer>
        </S.CardFront>
      </S.CardInner>
    </S.Card>
  );
}

export { BasiliumCard };
