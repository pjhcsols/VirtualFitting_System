import { ChevronLeft, ChevronRight } from "lucide-react";
import * as S from "./style";
import type { Dispatch, SetStateAction } from "react";

interface IPagination {
  page: number;
  totalPage: number;
  setPage: Dispatch<SetStateAction<number>>;
}

function Pagination({ page, totalPage, setPage }: IPagination) {
  console.log(totalPage);
  const onClickPage = (index: number) => {
    setPage(index);
  };
  return (
    <S.Wrapper>
      <ChevronLeft size={18} color="black" />
      {Array.from({ length: totalPage }).map((_, key) => {
        return (
          <S.IndexText
            clicked={page === key + 1}
            onClick={() => onClickPage(key + 1)}
          >
            {key + 1}
          </S.IndexText>
        );
      })}
      <ChevronRight size={18} color="black" />
    </S.Wrapper>
  );
}

export { Pagination };
