import { BrandMyPageInputTitles } from "@/pages/brand/constants";
import type { BrandUserType } from "@/pages/brand/types/brandUser";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import styled from "styled-components";

type BrandInfoChangerType = {
  brandInfo: BrandUserType;
  setBrandInfo: Dispatch<SetStateAction<BrandUserType>>;
};

function BrandInfoChanger({ brandInfo, setBrandInfo }: BrandInfoChangerType) {
  const onChangeBrandInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrandInfo({
      ...brandInfo,
      [name]: value,
    });
  };
  return (
    <Wrapper>
      {BrandMyPageInputTitles.map((item, key) => {
        return (
          <TitleInputContainer
            key={key}
            inputed={brandInfo[item.name].length !== 0}
          >
            <input
              type="text"
              id="input"
              name={item.name}
              value={brandInfo[item.name]}
              onChange={onChangeBrandInfo}
              required
            />
            <label htmlFor="input" className="label">
              {item.title}
            </label>
            <div className="underline" />
          </TitleInputContainer>
        );
      })}
    </Wrapper>
  );
}

export { BrandInfoChanger };

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  align-items: flex-start;
  justify-content: flex-start;
`;

const TitleInputContainer = styled.div<{ inputed: boolean }>`
  position: relative;
  margin: 2.5rem auto;
  width: 80%;

  input[type="text"] {
    font-size: 20px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ccc;
    padding: 5px 0;
    background-color: transparent;
    outline: none;
    color: black;
  }
  label {
    position: absolute;
    top: ${(props) => (props.inputed ? "-20px" : "0")};
    left: 0;
    color: #ccc;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  input[type="text"]:focus ~ .label,
  input[type="text"]:valid ~ .label {
    top: -20px;
    font-size: 16px;
    color: #333;
  }
  .underline {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    background-color: #333;
    transform: scaleX(0);
    transition: all 0.3s ease;
  }
  input[type="text"]:focus ~ .underline,
  input[type="text"]:valid ~ .underline {
    transform: scaleX(1);
  }
`;
