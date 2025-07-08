import { useEffect, useState } from "react";

import styled from "styled-components";
import { ICON_LEFT_ARROW, ICON_RIGHT_ARROW } from "@/shared/constants";

import { sliceArrayByLimit } from "@/shared/components/pagination/utils/pagination.utils";
import { type PaginationType } from "@/shared/components/pagination/types/Pagination";

function Pagination({ page, setPage, totalPage, size }: PaginationType) {
  const [currPageArray, setCurrPageArray] = useState<number[]>([]);
  const [totalPageArray, setTotalPageArray] = useState<number[][]>([]);

  useEffect(() => {
    if (totalPageArray.length === 0) {
      const slicedPageArray: number[][] = sliceArrayByLimit(totalPage, size);
      setTotalPageArray(slicedPageArray);
      setCurrPageArray(slicedPageArray[0]);
    }
  }, [totalPage, size]);

  useEffect(() => {
    if ((page + 1) % size === 1 && totalPageArray.length > 0) {
      setCurrPageArray(totalPageArray[Math.floor((page + 1) / size)]);
    } else if ((page + 1) % size === 0 && totalPageArray.length > 0) {
      setCurrPageArray(totalPageArray[Math.floor((page + 1) / size) - 1]);
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

  return (
    <Wrapper>
      <PaginationContainer>
        <ArrowIcon
          src={ICON_LEFT_ARROW}
          alt="left-arrow"
          onClick={onClickPrev}
        />
        {currPageArray?.map((value) => {
          return (
            <PaginationNumber
              key={value}
              onClick={() => onClickNumber(value)}
              isClicked={value === page}
            >
              {value + 1}
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
