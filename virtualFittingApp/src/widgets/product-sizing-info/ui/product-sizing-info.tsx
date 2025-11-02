import styled from "styled-components";
import type { ProductDetail } from "@/entities/product"; 
import { GlassBox } from "@/shared/components/glass-box";

interface ProductSizingInfoProps {
  product: ProductDetail;
}

function ProductSizingInfo({ product }: ProductSizingInfoProps) {
  const sizeOptions = product?.productSizeOptions || [];

  const isDataAvailable = Array.isArray(sizeOptions) && sizeOptions.length > 0;

  if (!isDataAvailable) {
    return (
      <Wrapper>
        <EmptyMessage>제공되는 사이즈표 정보가 없습니다.</EmptyMessage>
      </Wrapper>
    );
  }

  const headers = [
    "사이즈", "총장 (cm)", "가슴 (cm)", "어깨 (cm)", "팔 길이 (cm)"
  ];

  return (
    <Wrapper>
      <StyledTableContainer>
        <SizeTable>
          <thead>
            <tr>
              {headers.map(header => (
                <TableHeader key={header}>{header}</TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {sizeOptions.map((option, index) => (
              <TableRow key={index}>
                <TableCell $isHeader>{option.productSize}</TableCell>
                <TableCell>{option.totalLength}</TableCell>
                <TableCell>{option.chest}</TableCell>
                <TableCell>{option.shoulder}</TableCell>
                <TableCell>{option.arm}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </SizeTable>
      </StyledTableContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 64px 0px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledTableContainer = styled(GlassBox)`
  width: 100%;
  max-width: 600px;
  overflow-x: auto;
  padding: 0;
`;

const SizeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: white;
  text-align: center;
`;

const TableHeader = styled.th`
  padding: 12px 10px;
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  white-space: nowrap;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const TableCell = styled.td<{ $isHeader?: boolean }>`
  padding: 12px 10px;
  font-size: 14px;
  font-weight: ${({ $isHeader }) => ($isHeader ? 600 : 400)};
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-right: none;
  }
`;

const EmptyMessage = styled.div`
  padding: 40px 0;
  text-align: center;
  color: #ffffff;
`;

export { ProductSizingInfo };