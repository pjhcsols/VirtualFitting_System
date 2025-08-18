import styled from "styled-components";

function BasiliumLogoText() {
  return (
    <BasiliumLogoBox>
      <BasiliumLogoTextSpan>BASILIUM</BasiliumLogoTextSpan>
    </BasiliumLogoBox>
  );
}

export { BasiliumLogoText };

const BasiliumLogoBox = styled.div`
  min-width: 10rem;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 0.1rem;
`;

const BasiliumLogoTextSpan = styled.span`
  font-family: "Prata-Regular";
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-transform: uppercase;
`;
