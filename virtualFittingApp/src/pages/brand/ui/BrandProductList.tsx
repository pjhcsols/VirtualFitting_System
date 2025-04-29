import * as S from "@/pages/brand/ui/css/BrandProductList.css";
import { BrandProductCard, BrandSearch, Pagination } from "@/shared";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { GET_BRAND_INFO } from "@/pages/brand/api/brand.action";
import { useNavigate } from "react-router-dom";

function BrandProductList() {
  const router = useNavigate();
  const [showSize, setShowSize] = useState<number>(10);
  const [productList, setProductList] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);

  // const totalPage = productList.length / showSize;
  const totalPage = 40;

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      "product",
      {
        opacity: 0,
        y: -50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out",
      },
    );
  }, []);

  useEffect(() => {
    router(`/brand/list?page=${page}&size=${showSize}`);
    // const fetchData = async () => {
    //   const data = await GET_BRAND_INFO({ page, size: showSize });
    //   if (data) {
    //     setProductList(data);
    //   }
    // };
    // fetchData();
  }, [page]);

  return (
    <S.Wrapper>
      <S.SearchContainer>
        <BrandSearch />
      </S.SearchContainer>
      <S.ProductShow>
        <S.DescText>총</S.DescText>
        <S.Title>{`${productList.length}건`}</S.Title>
      </S.ProductShow>
      <S.ProductList className="product">
        <BrandProductCard
          productId={1}
          productName="바실리움 후드티"
          productPhotoColorOptions={["black"]}
          productPhotoUrl="https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png"
          productPrice={30000}
          className="product"
        />
        <BrandProductCard
          productId={1}
          productName="바실리움 후드티"
          productPhotoColorOptions={["black"]}
          productPhotoUrl="https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png"
          productPrice={30000}
          className="product"
        />
        <BrandProductCard
          productId={1}
          productName="바실리움 후드티"
          productPhotoColorOptions={["black"]}
          productPhotoUrl="https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png"
          productPrice={30000}
          className="product"
        />
        <BrandProductCard
          productId={1}
          productName="바실리움 후드티"
          productPhotoColorOptions={["black"]}
          productPhotoUrl="https://s3.ap-northeast-2.amazonaws.com/basilium-product-bucket/main1_1.png"
          productPrice={30000}
          className="product"
        />
      </S.ProductList>
      <Pagination
        totalPage={totalPage}
        size={showSize}
        page={page}
        setPage={setPage}
      />
    </S.Wrapper>
  );
}

export { BrandProductList };
