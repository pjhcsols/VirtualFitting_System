import styled from "styled-components";

type PreCautionType = {
  messages?: string[];
};

function PreCaution({ messages }: PreCautionType) {
  return (
    <Wrapper>
      <span className="precaution-title">주의사항</span>
      {messages && (
        <div className="content-box">
          {messages.map((item, key) => {
            return (
              <div className="text-box" key={key}>
                <div className="dot" />
                <span className="precaution-content">{item}</span>
              </div>
            );
          })}
        </div>
      )}
    </Wrapper>
  );
}

export { PreCaution };

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 3rem 5rem;
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  gap: 50px;
  .text-box {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
  }
  .precaution-title {
    font-family: "Pretendard";
    font-size: 1.8rem;
    font-weight: 700;
    color: black;
  }
  .content-box {
    width: 100%;
    display: flex;
    flex-flow: column wrap;
    justify-content: flex-start;
    align-items: center;
    gap: 20px;
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 1000px;
    background-color: black;
  }
  .precaution-content {
    font-family: "Pretendard";
    font-size: 1rem;
    font-weight: 600;
    color: black;
  }
`;
