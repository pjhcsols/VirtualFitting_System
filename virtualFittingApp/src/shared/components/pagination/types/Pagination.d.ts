import type { Dispatch, SetStateAction } from "react";

export type PaginationType = {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  size: number;
};
