import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASILIUM } from "@/shared";

interface ProductType {
  productId: number;
  productName: string;
  productPrice: number;
  productDesc: string;
  productPhotoUrl: string[];
}

interface ProductProps {
  product: ProductType;
  onClick: () => void;
}

const Product: React.FC<ProductProps> = ({ product, onClick }) => {
  return (
    <div className="store_product" onClick={onClick}>
      <img
        className="product-image"
        src={product.productPhotoUrl[0]}
        alt="제품 사진"
      />
      <div className="product-actions">
        {/* <img className="store_heart-icon" src={heartIcon} alt="heartIcon" /> */}
        <button className="store_cart-icon">+cart</button>
      </div>
      <div className="icon_underline"></div>
      <p className="product_title">{product.productName}</p>
      <p className="product_price">{product.productPrice} won</p>
      <p className="description">{product.productDesc}</p>
    </div>
  );
};

const SearchResultPage: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const category: string = location.state?.category || "New Arrival";
  const searchText: string = location.state?.searchText || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_BASILIUM}/products/getAll`; // API_BASILIUM을 사용하여 url을 설정
        let response = await API_BASILIUM.get(url); // axios.get()을 사용하여 API 호출
        let data: ProductType[] = response.data;

        if (searchText) {
          data = data.filter((product) =>
            product.productName
              .toLowerCase()
              .includes(searchText.toLowerCase()),
          );
        }

        setProducts(data);
      } catch (error) {
        console.error("Fetching products failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchText]);

  const handleClick = (productId: number) => {
    navigate(`/storeDetail/${productId}`);
  };

  return (
    <div className="searchResultPage">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}
      {!loading && products.length > 0 && (
        <div>
          <div className="searchResult-text">
            '<span className="search-text-highlight">{searchText}</span>
            '에 대한 검색결과({products.length}개)
          </div>
          <div className="search-horizontal-line"></div>
          <div className="products-container">
            {products.map((product) => (
              <Product
                onClick={() => handleClick(product.productId)}
                key={product.productId}
                product={product}
              />
            ))}
          </div>
        </div>
      )}
      {!loading && products.length === 0 && (
        <div className="no-search-result">
          검색 결과가 없습니다.
          <br />
          다른 검색어로 검색해주세요.
        </div>
      )}
    </div>
  );
};

export { SearchResultPage };
