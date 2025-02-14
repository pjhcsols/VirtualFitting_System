import { type MouseEvent, useState } from "react";
import styled from "styled-components";

import { categoryOptions as optionData } from "../../../pages/admin/constants";

type CategorySelectBarType = {
  onChange: ({ key, value }: { key: number; value: string }) => void;
};

function CategorySelectBar({ onChange }: CategorySelectBarType) {
  const [currentValue, setCurrentValue] = useState(optionData[0].value);
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const onChangeSelectValue = (e: MouseEvent<HTMLLIElement>) => {
    const key = parseInt(e.currentTarget.getAttribute("data-key") ?? "0");
    const value = e.currentTarget.getAttribute("data-value") ?? "";
    setCurrentValue(value);
    onChange({ key, value });
  };

  return (
    <SelectBoxWrapper onClick={() => setShowOptions((prev) => !prev)}>
      <SelectLabel>{currentValue}</SelectLabel>
      <SelectOptions isShow={showOptions}>
        {optionData.map((item, key) => {
          return (
            <SelectOption
              key={key}
              data-key={item.key}
              data-value={item.value}
              onClick={onChangeSelectValue}
            >
              {item.value}
            </SelectOption>
          );
        })}
      </SelectOptions>
    </SelectBoxWrapper>
  );
}

const SelectBoxWrapper = styled.div`
  position: relative;
  width: 120px;
  padding: 8px;
  border-radius: 5px;
  background-color: #dee2e6;
  align-self: center;
  cursor: pointer;
  &::before {
    content: "⌵";
    position: absolute;
    top: 1px;
    right: 8px;
    color: black;
    font-size: 20px;
  }
`;

const SelectLabel = styled.label`
  font-size: 14px;
  margin-left: 4px;
  text-align: center;
  color: black;
`;

const SelectOptions = styled.ul<{ isShow: boolean }>`
  position: absolute;
  list-style: none;
  top: 25px;
  left: 0;
  width: 100%;
  overflow: auto;
  max-height: 0;
  padding: 0;
  border-radius: 8px;
  background-color: #222222;
  color: #fefefe;
  transition: max-height 0.3s ease;
  z-index: 1;
  max-height: ${(props) => (props.isShow ? "250px" : "")};
`;

const SelectOption = styled.li`
  font-size: 14px;
  padding: 6px 8px;
  transition: background-color 0.2s ease-in;
  &:hover {
    background-color: #595959;
  }
`;

export { CategorySelectBar };
