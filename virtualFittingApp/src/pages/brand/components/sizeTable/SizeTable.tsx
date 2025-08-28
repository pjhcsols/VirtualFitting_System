import type { ProductSizeOptionType } from "@/shared/types/product/product";
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 24px;
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: #374151;
  margin: 0;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #059669;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
`;

const TableBody = styled.tbody`
  & > tr {
    border-bottom: 1px solid #e5e7eb;
  }

  & > tr:hover {
    background-color: #f9fafb;
  }
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  padding: 8px 16px;
  white-space: nowrap;

  &.description {
    white-space: normal;
  }
`;

const EditableInput = styled.input`
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  outline: none;

  &:focus {
    outline: 1px solid #3b82f6;
  }
`;

const CellContent = styled.div`
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  min-width: 7rem;
  min-height: 32px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const CellContentText = styled.span`
  font-weight: 500;
  font-size: 0.8rem;
  color: black;
`;

const Placeholder = styled.span`
  color: #9ca3af;
  font-style: italic;
`;

const DeleteButton = styled.button`
  padding: 4px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #dc2626;
  }
`;

interface EditableCellProps {
  value: string | number;
  onSave: (value: string | number) => void;
  type?: "text" | "number" | "email";
  placeholder?: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  onSave,
  type = "text",
  placeholder = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  if (isEditing) {
    return (
      <EditableInput
        ref={inputRef}
        type={type}
        value={editValue}
        onChange={(e) =>
          setEditValue(
            type === "number" ? Number(e.target.value) || 0 : e.target.value,
          )
        }
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    );
  }

  return (
    <CellContent onClick={() => setIsEditing(true)} title="클릭하여 편집">
      {value ? (
        <CellContentText>{value}</CellContentText>
      ) : (
        <Placeholder>클릭하여 입력</Placeholder>
      )}
    </CellContent>
  );
};

const SizeTable: React.FC = () => {
  const [products, setProducts] = useState<ProductSizeOptionType[]>([
    {
      id: 1,
      product: "",
      totalLength: 0,
      chest: 0,
      shoulder: 0,
      arm: 0,
    },
  ]);

  const updateProduct = (
    id: number,
    field: keyof ProductSizeOptionType,
    value: string | number,
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product,
      ),
    );
  };

  const addNewRow = () => {
    const newId = Math.max(...products.map((p) => p.id)) + 1;
    const newProduct: ProductSizeOptionType = {
      id: newId,
      product: "",
      totalLength: 0,
      chest: 0,
      shoulder: 0,
      arm: 0,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const deleteRow = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <Container>
      <Header>
        <Title>상품 SIZE 테이블</Title>
        <AddButton onClick={addNewRow}>+ 새 사이즈 추가</AddButton>
      </Header>

      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>사이즈</TableHeader>
              <TableHeader>기장</TableHeader>
              <TableHeader>가슴 길이</TableHeader>
              <TableHeader>어깨 길이</TableHeader>
              <TableHeader>팔 길이</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <EditableCell
                    value={product.totalLength}
                    onSave={(value) =>
                      updateProduct(product.id, "totalLength", value)
                    }
                    type="text"
                    placeholder="사이즈 입력"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={product.totalLength}
                    onSave={(value) =>
                      updateProduct(product.id, "totalLength", value)
                    }
                    type="number"
                    placeholder="기장 입력"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={product.chest}
                    onSave={(value) =>
                      updateProduct(product.id, "chest", value)
                    }
                    placeholder="가슴 길이 입력"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={product.shoulder}
                    onSave={(value) =>
                      updateProduct(product.id, "shoulder", value)
                    }
                    type="number"
                    placeholder="어깨 길이 입력"
                  />
                </TableCell>
                <TableCell>
                  <EditableCell
                    value={product.arm}
                    onSave={(value) => updateProduct(product.id, "arm", value)}
                    type="text"
                    placeholder="팔 길이 입력"
                  />
                </TableCell>
                <TableCell>
                  <DeleteButton onClick={() => deleteRow(product.id)}>
                    삭제
                  </DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export { SizeTable };
