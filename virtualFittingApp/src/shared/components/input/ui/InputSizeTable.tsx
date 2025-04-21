import * as S from "@/shared/components/input/ui/css/InputSizeTable.css";
import { SizeTableTitles } from "@/shared/constants";
import type { ClientProductDto, Size, SizeTable } from "@/shared/types";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

type InputSizeTableType = {
  row: number;
  size: Size;
  productInfo: ClientProductDto;
  setProductInfo: Dispatch<SetStateAction<ClientProductDto>>;
};

function InputSizeTable({
  row,
  size,
  productInfo,
  setProductInfo,
}: InputSizeTableType) {
  const onChangeSizeTable = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (value === "") {
      const table: SizeTable[] = productInfo.productSizeTable.map(
        (rowValue, index) =>
          index === row ? { ...rowValue, [name]: 0 } : rowValue,
      );
      setProductInfo({
        ...productInfo,
        productSizeTable: table,
      });
      return;
    }
    const parsed = Number(value);

    if (!Number.isNaN(parsed) && Number.isInteger(parsed)) {
      const updatedTable: SizeTable[] = productInfo.productSizeTable.map(
        (rowValue, index) =>
          index === row ? { ...rowValue, [name]: parsed } : rowValue,
      );
      setProductInfo({
        ...productInfo,
        productSizeTable: updatedTable,
      });
    }
  };
  return (
    <S.SizeTable>
      <S.SizeInput name="productSize" value={size} disabled />
      {SizeTableTitles.map((item: keyof SizeTable, key: number) => {
        return (
          <S.SizeInput
            name={item}
            key={key}
            value={productInfo.productSizeTable[row][item]}
            onChange={onChangeSizeTable}
          />
        );
      })}
    </S.SizeTable>
  );
}

export { InputSizeTable };
