import { type ChangeEvent, useState, memo } from "react";
import styled from "styled-components";

import {
  type ColorType,
  type MaterialType,
  type SizeType,
} from "../../types/option";

type CheckBoxType = {
  items: { key: number; value: string }[];
  onChange: (values: ColorType[] | MaterialType[] | SizeType[]) => void;
};

function CheckBox({ items, onChange }: CheckBoxType) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = {
        ...prevCheckedItems,
        [name]: checked,
      };

      return newCheckedItems;
    });
  };
  return (
    <CheckBoxContainer>
      {items.map((item, key) => {
        return (
          <CheckBoxLabel key={key}>
            <CheckBoxComponent
              key={item.key}
              checkedItems={checkedItems}
              onChange={handleCheckboxChange}
            />
          </CheckBoxLabel>
        );
      })}
    </CheckBoxContainer>
  );
}

type CheckBoxComponentType = {
  key: number;
  checkedItems: boolean[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const CheckBoxComponent = memo(function CheckBoxComponent({
  key,
  checkedItems,
  onChange,
}: CheckBoxComponentType) {
  return (
    <CheckBoxInput
      type="checkbox"
      name={key.toString()}
      checked={checkedItems[key]}
      onChange={onChange}
    />
  );
});

const CheckBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  gap: 20px;
`;

const CheckBoxLabel = styled.label`
  display: flex;
  align-items: flex-start;
`;

const CheckBoxInput = styled.input`
  display: inline-block !important;
  min-width: 20px;
  min-height: 20px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

export { CheckBox };
