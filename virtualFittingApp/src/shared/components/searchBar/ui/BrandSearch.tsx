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
      <SearchBtn>검색</SearchBtn>
    </SearchForm>
  );
}

const SearchForm = styled.form`
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
`;

const SearchBar = styled.input.attrs({ type: "search" })`
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  padding: 10px 20px 10px 60px;
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

const SearchBtn = styled.div`
  position: absolute;
  right: 20px;
  width: 64px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #536976;
  font-family: "Pretendard";
  font-size: 12px;
  color: white;
  cursor: pointer;
  transition: 0.2s all ease-out;
  &:hover {
    transform: scale(1.05);
  }
  &:active {
    background-color: #bbd2c5;
    transition: 0.1s all ease-out;
    transform: scale(0.97);
  }
`;

export { BrandSearch };
