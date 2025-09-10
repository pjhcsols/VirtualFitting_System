import { useState } from "react";
import styled from "styled-components";

function NameCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <CardContainer onClick={() => setFlipped((f) => !f)}>
      <CardInner isFlipped={flipped}>
        <CardFront>
          <Brand>Basilium</Brand>
          <Name>Seah Kim</Name>
        </CardFront>
        <CardBack>
          <InfoGroup>
            <Label>Phone</Label>
            <Value>010-1234-5678</Value>
          </InfoGroup>
          <InfoGroup>
            <Label>Email</Label>
            <Value>example@knu.ac.kr</Value>
          </InfoGroup>
          <InfoGroup>
            <Label>Address</Label>
            <Value>대구광역시 북구 대학로 70</Value>
          </InfoGroup>
        </CardBack>
      </CardInner>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  width: 340px;
  height: 210px;
  perspective: 1000px;
  cursor: pointer;
`;

const CardInner = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isFlipped"
})<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s ease-in-out;
  transform: ${({ isFlipped }) => (isFlipped ? "rotateY(180deg)" : "rotateY(0deg)")};
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px;
  box-sizing: border-box;
  font-family: "Pretendard", sans-serif;
`;

const CardFront = styled(CardFace)`
  background: linear-gradient(135deg, #BBD2C5 0%, #536976 50%, #292E49 100%);
  color: white;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;

const CardBack = styled(CardFace)`
  background: #fff;
  color: #222;
  transform: rotateY(180deg);
  justify-content: center;
  gap: 12px;
`;

const Brand = styled.div`
  font-size: 14px;
  font-weight: 600;
  opacity: 0.85;
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Label = styled.div`
  font-size: 12px;
  color: #999;
`;

const Value = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

export { NameCard };
