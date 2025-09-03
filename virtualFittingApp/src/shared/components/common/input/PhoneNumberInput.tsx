import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface IPhoneNumberInput {
  onChange: (value: string) => void;
  value: string;
  name: string;
  error?: string;
  placeholder?: string;
}

function PhoneNumberInput({
  name,
  value,
  onChange,
  error,
  placeholder = "10-0000-0000",
}: IPhoneNumberInput) {
  const [displayValue, setDisplayValue] = useState<string>("");

  const getDigitsOnly = (str: string): string => {
    return str.replace(/\D/g, "");
  };

  // 한국 번호를 국제 형식으로 포맷팅
  const formatToInternational = (digits: string): string => {
    if (!digits) return "";

    let cleanDigits = digits;

    // 82로 시작하면 그대로 사용
    if (digits.startsWith("82")) {
      cleanDigits = digits;
    }
    // 0으로 시작하면 0을 제거하고 82 추가
    else if (digits.startsWith("0")) {
      cleanDigits = "82" + digits.slice(1);
    }
    // 그 외는 82 추가
    else {
      cleanDigits = "82" + digits;
    }

    // 최대 길이 제한 (82 + 11자리)
    if (cleanDigits.length > 13) {
      cleanDigits = cleanDigits.slice(0, 13);
    }

    // 포맷팅
    if (cleanDigits.length <= 2) {
      return `+${cleanDigits}`;
    } else if (cleanDigits.length <= 4) {
      return `+${cleanDigits.slice(0, 2)} ${cleanDigits.slice(2)}`;
    } else if (cleanDigits.length <= 8) {
      return `+${cleanDigits.slice(0, 2)} ${cleanDigits.slice(2, 4)} ${cleanDigits.slice(4)}`;
    } else {
      return `+${cleanDigits.slice(0, 2)} ${cleanDigits.slice(2, 4)} ${cleanDigits.slice(4, 8)} ${cleanDigits.slice(8)}`;
    }
  };

  // 붙여넣기까지 처리 가능
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digits = getDigitsOnly(pastedText);

    const formatted = formatToInternational(digits);
    setDisplayValue(formatted);

    if (onChange) {
      onChange(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    if (
      allowedKeys.includes(e.key) ||
      (e.key >= "0" && e.key <= "9") ||
      (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase()))
    ) {
      return;
    }

    e.preventDefault();
  };

  useEffect(() => {
    if (value !== displayValue) {
      const digits = getDigitsOnly(value);
      const formatted = formatToInternational(digits);
      setDisplayValue(formatted);
    }
  }, [value]);

  return (
    <Wrapper>
      <Select>
        <Option>
          <KoreaIcon />
          <FlagText>+82</FlagText>
        </Option>
        <Option>
          <KoreaIcon />
          <FlagText>+82</FlagText>
        </Option>
        <Option>
          <KoreaIcon />
          <FlagText>+82</FlagText>
        </Option>
      </Select>
      <Input name={name} placeholder={placeholder} />
    </Wrapper>
  );
}

export { PhoneNumberInput };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
  min-width: 8rem;
  width: 100%;
  min-height: 3rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 12px;
  border: 1px solid #d9d9d9;
  gap: 1rem;
`;

const Select = styled.select`
  &,
  &::picker(select) {
    appearance: base-select;
  }
`;

const Option = styled.option`
  font-size: 0.5rem;
  font-weight: 500;
  color: white;
  background-color: white;
  transition: 0.2s all ease;
  &:hover {
    background-color: #d9d9d9;
  }
  overflow-y: scroll;
`;

const KoreaIcon = () => {
  return (
    <svg
      id="South_Korea"
      enableBackground="new 0 0 300 300"
      version="1.1"
      viewBox="0 0 300 300"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g>
        <polygon
          points="273.822,128 273.924,128 273.842,80 34.076,80 34.191,128 34.089,128 34.211,180 34.111,180 34.225,228 273.89,228 273.81,181 273.911,181"
          style={{
            fill: "#FFFFFF",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <path
          d="M168.491,148.092c0,0-9.015-0.82-13.113,5.737c-4.098,6.557-9.015,9.015-9.015,9.015c-22.584,5.915-26.823-9.337-27.067-20.528c-1.831,4.433-2.847,9.287-2.847,14.381c0,20.821,16.879,37.7,37.7,37.7c14.16,0,26.49-7.811,32.934-19.355C191.204,147.388,168.491,148.092,168.491,148.092z"
          style={{
            fill: "#26BBEC",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <path
          d="M154.149,118.997c-15.727,0-29.2,9.634-34.853,23.319c0.245,11.191,4.484,26.443,27.067,20.528c0,0,4.917-2.459,9.015-9.015c4.098-6.557,13.113-5.737,13.113-5.737s22.713-0.704,18.592,26.95c3.031-5.431,4.766-11.684,4.766-18.345C191.849,135.876,174.97,118.997,154.149,118.997z"
          style={{
            fill: "#EE5281",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="92.801"
          x2="109.268"
          y1="133.437"
          y2="108.617"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="79.691"
          x2="96.158"
          y1="126.304"
          y2="101.483"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="212.801"
          x2="229.268"
          y1="209.437"
          y2="184.617"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="199.691"
          x2="216.158"
          y1="202.304"
          y2="177.483"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="92.801"
          x2="109.268"
          y1="177.483"
          y2="202.304"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="79.691"
          x2="96.158"
          y1="184.617"
          y2="209.437"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="212.801"
          x2="229.268"
          y1="101.483"
          y2="126.304"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
        <line
          x1="199.691"
          x2="216.158"
          y1="108.617"
          y2="133.437"
          style={{
            fill: "none",
            stroke: "#000000",
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 10,
          }}
        />
      </g>
    </svg>
  );
};

const FlagText = styled.span`
  font-size: 0.5rem;
  font-weight: 500;
  color: black;
`;

const Input = styled.input.attrs({ type: "text" })`
  height: 3rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: black;
  background-color: transparent;
  border: none;
  &:focus {
    outline: none;
  }
`;
