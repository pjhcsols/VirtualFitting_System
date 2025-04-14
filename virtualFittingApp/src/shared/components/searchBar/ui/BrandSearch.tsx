import { type ChangeEvent, useState } from "react";
import styled from "styled-components";
import { ICON_SEARCH } from "@/shared/constants";

function BrandSearch() {
  const [searchText, setSearchText] = useState<string>("");

  const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);
  };

  return (
    <SearchForm method="get">
      <SearchBar
        value={searchText}
        onChange={onChangeText}
        placeholder="Ex) 바실리움 회색 후드티..."
      />
      <SearchIcon />
    </SearchForm>
  );
}

const SearchForm = styled.form`
  position: relative;
  width: 100%;
  height: fit-content;
`;

const SearchBar = styled.input.attrs({ type: "search" })`
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 10px 20px 10px 80px;
  text-align: left;
  font-family: "Pretendard";
  font-size: 16px;
  border: 1px solid black;
  color: black;
  background-color: transparent;
  border-radius: 40px;
`;

const SearchIcon = styled.img.attrs({ src: ICON_SEARCH, alt: "icon-search" })`
  position: absolute;
  left: 20px;
  width: 32px;
  height: 32px;
`;

export { BrandSearch };
