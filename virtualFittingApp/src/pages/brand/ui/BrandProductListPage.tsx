import { Pagination } from "@/shared";
import { BrandProductList } from "@/widgets";
import { useBrandProductList } from "../hooks/useBrandProductList";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import styled from "styled-components";

function BrandProductListPage() {
  const [searchParam, setSearchParam] = useSearchParams();

  const [page, setPage] = useState<number>(
    Number.parseInt(searchParam.get("page") ?? "0"),
  );
  const [size, setSize] = useState<number>(
    Number.parseInt(searchParam.get("size") ?? "0"),
  );

  const { data, error, loading } = useBrandProductList({ page, size });

  const totalLength = data ? data.length : 0;

  return (
    <Wrapper>
      <InfoContainer>
        <TextContainer>
          <BoldBlueText>총</BoldBlueText>
          <BoldText>{totalLength}건</BoldText>
        </TextContainer>
      </InfoContainer>
      <BrandProductList datas={data} />
      {totalLength !== 0 && (
        <Pagination
          page={page}
          size={size}
          totalPage={totalLength / size}
          setPage={setPage}
        />
      )}
    </Wrapper>
  );
}

export { BrandProductListPage };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1rem;
`;

const InfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BoldBlueText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #87cefa;
`;

const BoldText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: black;
`;

const TextContainer = styled.div`
  min-width: 10rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const ButtonContainer = styled.div`
  min-width: 30rem;
  display: flex;
  flex-flow: row;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
`;

const CardContainer = styled.div`
  box-sizing: border-box;
  padding: 2rem 0;
  width: 100%;
  min-width: 50rem;
  min-height: 10rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 2px 2px 2px 0 rgb(234, 234, 234);
`;
