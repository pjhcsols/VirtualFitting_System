import styled from "styled-components";
import { ICON_LEFT_ARROW, ICON_RIGHT_ARROW } from "@/shared/constants";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type PaginationType = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  limit: number;
};

function Pagination({ page, setPage, totalPage, limit }: PaginationType) {
  const [currPageArray, setCurrPageArray] = useState<number[]>([]);
  const [totalPageArray, setTotalPageArray] = useState<number[][]>([]);

  useEffect(() => {
    const slicedPageArray = sliceArrayByLimit(totalPage, limit);
    setTotalPageArray(slicedPageArray);
    setCurrPageArray(slicedPageArray[0]);
  }, [totalPage]);

  useEffect(() => {
    if (page % limit === 1) {
      setCurrPageArray(totalPageArray[Math.floor(page / limit)]);
    } else if (page % limit === 0) {
      setCurrPageArray(totalPageArray[Math.floor(page / limit) - 1]);
    }
  }, [page]);

  const onClickPrev = () => {
    if (page === 0) {
      return;
    } else {
      setPage(page - 1);
    }
  };

  const onClickNext = () => {
    if (page >= totalPage) {
      return;
    } else {
      setPage(page + 1);
    }
  };

  const onClickNumber = (key: number) => {
    setPage(key);
  };

  const sliceArrayByLimit = (totalPage: number, limit: number) => {
    const totalPageArray = Array.from({ length: totalPage }, (_, i) => i);
    const result: number[][] = [];

    while (totalPageArray.length > 0) {
      result.push(totalPageArray.splice(0, limit));
    }

    return result;
  };

  return (
    <Wrapper>
      <PaginationContainer>
        <ArrowIcon
          src={ICON_LEFT_ARROW}
          alt="left-arrow"
          onClick={onClickPrev}
        />
        {currPageArray?.map((_, key) => {
          return (
            <PaginationNumber
              key={key}
              onClick={() => onClickNumber(key)}
              isClicked={key === page}
            >
              {key + 1}
            </PaginationNumber>
          );
        })}
        <ArrowIcon
          src={ICON_RIGHT_ARROW}
          alt="right-arrow"
          onClick={onClickNext}
        />
      </PaginationContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PaginationContainer = styled.div`
  width: 50%;
  height: 5em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
  color: black;
  cursor: pointer;
`;

const PaginationNumber = styled.span<{ isClicked: boolean }>`
  font-size: 0.8em;
  color: ${(props) => (props.isClicked ? "#00aff0" : "black")};
  font-weight: 500;
  cursor: pointer;
`;

export { Pagination };
