import React from "react";
import styled from "styled-components";
import { Header } from "@/shared/components/header";
import { MyHeader } from "@/shared/components/header";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const Card = styled.div`
  width: 24rem;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.div`
  width: 6rem;
  height: 6rem;
  background: #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
`;

const RadioGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    background: #2563eb;
  }
`;

function MyPageDetail() {
  return (
    <MyHeader>
    </MyHeader>
  );
}

export { MyPageDetail };
