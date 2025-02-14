import { AnimatePresence, motion } from "motion/react";
import { ReactNode } from "react";
import styled from "styled-components";
import { BasiliumCard } from "../constants";

function Banner() {
  return (
    <AnimatePresence mode="sync">
      <Wrapper>
        <BannerInstance>
          <BGAsset url={BasiliumCard.image}></BGAsset>
          <ContentBox backgroundColor={BasiliumCard.backgroundColor}>
            <TitleText>{BasiliumCard.title}</TitleText>
            <ContentText>{BasiliumCard.content[0]}</ContentText>
            <ContentText>{BasiliumCard.content[1]}</ContentText>
          </ContentBox>
        </BannerInstance>
        <BannerInstance>
          <BGAsset url={BasiliumCard.image}></BGAsset>
          <ContentBox backgroundColor={BasiliumCard.backgroundColor}>
            <TitleText>{BasiliumCard.title}</TitleText>
            <ContentText>{BasiliumCard.content[0]}</ContentText>
            <ContentText>{BasiliumCard.content[1]}</ContentText>
          </ContentBox>
        </BannerInstance>
        <BannerInstance>
          <BGAsset url={BasiliumCard.image}></BGAsset>
          <ContentBox backgroundColor={BasiliumCard.backgroundColor}>
            <TitleText>{BasiliumCard.title}</TitleText>
            <ContentText>{BasiliumCard.content[0]}</ContentText>
            <ContentText>{BasiliumCard.content[1]}</ContentText>
          </ContentBox>
        </BannerInstance>
        <BannerInstance>
          <BGAsset url={BasiliumCard.image}></BGAsset>
          <ContentBox backgroundColor={BasiliumCard.backgroundColor}>
            <TitleText>{BasiliumCard.title}</TitleText>
            <ContentText>{BasiliumCard.content[0]}</ContentText>
            <ContentText>{BasiliumCard.content[1]}</ContentText>
          </ContentBox>
        </BannerInstance>
        <BannerInstance>
          <BGAsset url={BasiliumCard.image}></BGAsset>
          <ContentBox backgroundColor={BasiliumCard.backgroundColor}>
            <TitleText>{BasiliumCard.title}</TitleText>
            <ContentText>{BasiliumCard.content[0]}</ContentText>
            <ContentText>{BasiliumCard.content[1]}</ContentText>
          </ContentBox>
        </BannerInstance>
      </Wrapper>
    </AnimatePresence>
  );
}

function BannerInstance({ children }: { children: ReactNode }) {
  return (
    <BannerBox
      whileHover={{
        width: 400,
        transition: { duration: 0.4, ease: "easeOut" },
      }}
    >
      {children}
    </BannerBox>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

const BannerBox = styled(motion.div)`
  box-sizing: border-box;
  position: relative;
  padding: 2em;
  width: 20%;
  height: 35em;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 24px;
  overflow: hidden;
`;

const BGAsset = styled.div<{ url: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 50%;
  object-fit: cover;
  z-index: 10;
  background-image: url(${(props) => props.url ?? "none"});
  background-repeat: no-repeat;
  transform: translate(-50%, -50%);
`;

const ContentBox = styled.div<{ backgroundColor: string }>`
  box-sizing: border-box;
  padding: 1em;
  width: 100%;
  height: 50%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: flex-start;
  opacity: 0;
  background-color: ${(props) => props.backgroundColor ?? "white"};
`;

const TitleText = styled.h1`
  font-size: 1em;
  color: white;
`;

const ContentText = styled.span`
  font-size: 0.7em;
  color: white;
`;

export { Banner };
