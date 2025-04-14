import {
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import styled from "styled-components";

type ProfileType = {
  onChange: Dispatch<SetStateAction<File | null>>;
};

function Profile({ onChange }: ProfileType) {
  const [profile, setProfile] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const onChangeProfile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (!files) return;
    if (files.length > 1) return;

    onChange(files[0]);
    const url = URL.createObjectURL(files[0]);
    setProfile(url);
  };

  // e.preventDefault();
  // 코드작성 시, file 창이 열리지 않음.
  const onClickBtn = () => {
    imageRef.current?.click();
  };

  if (profile === null) {
    return (
      <ImageBtn onClick={onClickBtn}>
        <ImageInput onChange={onChangeProfile} ref={imageRef} />
      </ImageBtn>
    );
  } else {
    return <Image src={profile} alt={"profile-image"} />;
  }
}

const Image = styled.img`
  min-width: 100px;
  width: 10vw;
  min-height: 100px;
  height: 10vw;
  border-radius: 100%;
`;

const ImageBtn = styled.div`
  min-width: 100px;
  width: 10vw;
  min-height: 100px;
  height: 10vw;
  border-radius: 100%;
  cursor: pointer;
  background-color: gray;
`;

const ImageInput = styled.input.attrs({ type: "file" })`
  display: none;
`;

export { Profile };
