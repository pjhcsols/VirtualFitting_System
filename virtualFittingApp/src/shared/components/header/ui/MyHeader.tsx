import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backImg from "../ui/back.png";
import userImg from "../ui/UserImg.png";

const Container1 = styled.header`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  z-index: 200;
`;

const Container2 = styled.div`
    position: fixed;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    width: 100%;
    height: 56px;
    padding: 0px 16px;
    background: rgb(255,255,255);
`;

const Left = styled.div`
  display: flex;
  margin-right: 600px;
  margin-top: 17px;
  cursor: pointer;
`;

const Center = styled.div`
    position: absolute;
    top: 65%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: bold;
    background: rgb(255,255,255);
`;

const BackIcon = styled.img`
    width: 30px;
    height: 30px;
`;

const Divider = styled.div`
    height: 2px;
    background: rgb(242, 243, 245);
    width: 600px;
`;

const Section = styled.div`
    background: rgb(255, 255, 255);
    margin: 0px;
    padding-top: 150px;  /* 상단 공간을 조정하여 AvatarBox 아래에 컨텐츠가 오도록 설정 */
    padding-bottom: 88px;
    position: relative;
`;

const Section1 = styled.div`
    padding-bottom: 85px;
`;

const AvatarBox = styled.div`
    position: relative; 
    margin-bottom: -200px;
    left: 50%;
    transform: translate(-47%, -50%);  /* 화면 가운데 정렬 */
    display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: center;
    padding: 8px 5px 28px;
    z-index: 100;  /* 다른 요소들 위에 배치 */
`;

const AvatarIcon = styled.img`
    width: 100px;
    height: 100px;
    position: relative;
    margin-top: 30px;
`;

const H1 = styled.p`
    margin-top: 5px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
`;

const MyForm = styled.div`
    padding: 20px 16px;
    margin-left: -150px;
    margin-top: 100px;
`;

const FormField = styled.div`
    display: flex;
    transform: translate(33.5%, -50%);
    justify-content: flex-start;  /* 기본값이 row, 가로 정렬 */
    align-items: center;   /* 세로 가운데 정렬 */
    width: 500px;
    gap: 10px;  /* 라벨과 입력 필드 사이의 간격 */
    margin-bottom: 10px;
    
`;

const Label = styled.label`
    font-size: 14px;
    color: rgb(32, 36, 41);
    width: 20%;  /* 라벨의 너비 조정 */
    margin-right: 10px; /* 라벨과 인풋 사이에 간격 추가 */
`;

const TelForm = styled.div`
    display: flex;
    width: 500px;
    gap: 10px;
`;

const TelInput = styled.div`
    flex: 1;
`;

const Button = styled.button`
    padding: 11px 15px;
    margin-left: 60px;
    background-color: #D9D9D9;  /* 버튼 배경색 */
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    height: 43px;  
    font-size: 14px;

    &:hover {
        background-color: #45a049;  /* 버튼 hover 상태 */
    }
`;

const InputForm = styled.div`
    width: 100%;  /* 입력 필드의 너비를 라벨에 맞게 조정 */
`;

const Input = styled.input.attrs((props) => ({
    type: props.type || 'text',  // 기본값은 'text', props로 'type'을 전달
}))`
    width: 100%;
    padding: 11px 43px 11px 16px;
    border: 1px solid rgb(228, 230, 233);
    background: rgb(255, 255, 255);
    font-weight: bold;
    color: rgb(32, 36, 41);
    opacity: 1;
    border-radius: 6px;
    height: 20px;
    font-size: 14px;

    &::placeholder {
        color: rgb(150, 150, 150);  /* placeholder 텍스트 색상 */
        font-weight: normal;
    }
`;

const Line = styled.div`
    position: absolute;
    left: 0px;
    top: 42px;
    width: 100%;
    background: rgb(255, 255, 255);
    z-index: 10;
    max-height: 180px;
    overflow-y: auto;
`;

function MyHeader() {
    const navigate = useNavigate();

    return (
        <div>
            <Container1>
                <Container2>
                    <div>
                        <Left onClick={()=>navigate("/")}>
                            <BackIcon src={backImg} alt="뒤로가기" />
                        </Left>
                        <Center>
                            <h3>회원정보 수정</h3>
                            <Divider/>
                        </Center>
                    </div>
                </Container2>
            </Container1>
            <Section>
                <Section1>
                    <AvatarBox>
                        <AvatarIcon src={userImg} alt="사용자 이미지" />
                        <H1>user1</H1>
                        <Divider/>
                    </AvatarBox>
                    <MyForm>
                        <FormField>
                            <Label>아이디</Label>
                                <InputForm>
                                    <Input type="id" placeholder="아이디를 입력해주세요." />
                                </InputForm>
                                <Line/>
                        </FormField>
                        <FormField>
                            <Label>이메일</Label>
                                <InputForm>
                                    <Input type="email" placeholder="이메일을 입력해주세요." />
                                </InputForm>
                                <Line/>
                        </FormField>
                        <FormField>
                            <Label>이름</Label>
                                <InputForm>
                                    <Input placeholder="이름을 입력해주세요." />
                                </InputForm>
                                <Line/>
                            </FormField>
                        <FormField>
                            <Label>휴대폰 번호</Label>
                            <TelForm>
                                <TelInput>
                                    <Input placeholder="-를 제외하고 입력해주세요." />
                                </TelInput>
                                <Button>인증</Button>
                            </TelForm>
                        </FormField>
                        <FormField>
                            <Label>생년월일</Label>
                            <InputForm>
                                <Input placeholder="YYYY-MM-DD" />
                            </InputForm>
                        </FormField>
                    </MyForm>
                </Section1>
            </Section>

        </div>
    );
}

export { MyHeader };