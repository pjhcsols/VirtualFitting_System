import { MouseEvent, Suspense } from "react";
import * as S from "@/widgets/brand/ui/css/BrandTitle.css";

import { Title } from "@/shared";
import { useNavigate } from "react-router-dom";

type BrandTitleType = {
  brandProfile?: string;
  brandName: string;
};

function BrandTitle({ brandProfile, brandName }: BrandTitleType) {
  const router = useNavigate();
  const onClickInfo = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    router(`/brand/my`);
  };

  return (
    <Suspense fallback={null}>
      <S.BrandTitleWrapper onClick={onClickInfo}>
        <S.BrandProfileBox>
          {brandProfile ? (
            <S.BrandProfile src={brandProfile} alt="brand-profile" />
          ) : (
            <S.NoBrandProfile />
          )}
        </S.BrandProfileBox>
        <S.BrandTextBox>
          <Title>{brandName}</Title>
        </S.BrandTextBox>
      </S.BrandTitleWrapper>
    </Suspense>
  );
}

export { BrandTitle };
