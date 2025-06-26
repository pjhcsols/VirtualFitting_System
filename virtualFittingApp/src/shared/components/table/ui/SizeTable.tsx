import { type SizeTable } from "@/shared/types/product/product";
import styled from "styled-components";

type SizeTableType = {
  sizeDatas: SizeTable[];
};

function SizeTable({ sizeDatas }: SizeTableType) {
  return (
    <Table>
      <TableHeader>
        <Column>
          <ColumnData>사이즈</ColumnData>
          <ColumnData>팔 길이</ColumnData>
          <ColumnData>가슴 둘레</ColumnData>
          <ColumnData>어깨 너비</ColumnData>
          <ColumnData>기장</ColumnData>
        </Column>
      </TableHeader>
      <TableBody>
        {sizeDatas.map((item: SizeTable, key: number) => {
          return (
            <Column key={key}>
              <ColumnData>{item.productSize}</ColumnData>
              <ColumnData>{item.productArm}</ColumnData>
              <ColumnData>{item.productChest}</ColumnData>
              <ColumnData>{item.productShoulder}</ColumnData>
              <ColumnData>{item.productTotalLength}</ColumnData>
            </Column>
          );
        })}
      </TableBody>
    </Table>
  );
}

export { SizeTable };

const Table = styled.table`
  width: 100%;
  border: 1px solid #d9d9d9;
  border-collapse: collapse;
`;

const TableHeader = styled.thead``;

const TableBody = styled.tbody``;

const Column = styled.tr`
  padding: 1rem 0;
`;

const ColumnData = styled.td`
  padding: 1rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: black;
  border-top-width: 1px solid #d9d9d9;
  border: 1px solid #d9d9d9;
`;
