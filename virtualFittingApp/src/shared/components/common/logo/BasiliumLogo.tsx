import styled from "styled-components";
import LogoURL from "@/assets/svg/logo/BasiliumLogo.svg";

interface IBasiliumLogo {
  width?: string;
  height?: string;
}

function BasiliumLogo({ width, height }: IBasiliumLogo) {
  return <Logo src={LogoURL} alt="logo" width={width} height={height} />;
}

export { BasiliumLogo };

const Logo = styled.img<{ width?: string; height?: string }>`
  width: ${(props) => props.width ?? "24px"};
  height: ${(props) => props.height ?? "48px"};
`;
