import * as S from "@/widgets/brand/ui/css/BrandProductList.css";
import { Suspense } from "react";
import {
  BrandProductCard,
  ICON_BASILIUM_ASSET_2,
  ProductServerResponseType,
} from "@/shared";

type BrandPrudctListType = {
  datas: ProductServerResponseType[] | undefined;
};

function BrandProductList({ datas }: BrandPrudctListType) {
  return (
    <Suspense
      fallback={
        <S.NoDataContainer>
          <span>서버에 에러가 발생했습니다.</span>
          <S.NoDataIcon
            src={ICON_BASILIUM_ASSET_2}
            alt="icon-basilium-asset-2"
          />
        </S.NoDataContainer>
      }
    >
      <S.CardContainer>
        {datas?.length === 0 || datas === undefined ? (
          <S.NoDataContainer>
            <span>등록된 상품이 없습니다.</span>
            <S.NoDataIcon
              src={ICON_BASILIUM_ASSET_2}
              alt="icon-basilium-asset-2"
            />
          </S.NoDataContainer>
        ) : (
          datas?.map((item: ProductServerResponseType, key: number) => (
            <BrandProductCard
              key={key}
              productId={item.productId}
              photoUrl={item.productPhotoUrls[0]}
              productTitle={item.productName}
              productPrice={item.productPrice}
            />
          ))
        )}
      </S.CardContainer>
    </Suspense>
  );
}

export { BrandProductList };
