import styled from "styled-components";
import { PAPER_PERSON } from "../model/constants";
import { useRef, useEffect } from "react";
import gsap from "gsap"; 
import { ScrollTrigger } from "gsap/all"; 

gsap.registerPlugin(ScrollTrigger);


function PaperSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
        gsap.fromTo(sectionRef.current, 
            { 
                backgroundSize: '100%',
                backgroundPosition: '50% 100%',
            },
            {
                backgroundSize: '150%',
                backgroundPosition: '50% 0%',
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom", 
                    end: "bottom top", 
                    scrub: true,
                }
            }
        );
    }
    
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, []);

  return (
    <Wrapper>
        <ImageBox ref={sectionRef}></ImageBox>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  overflow: hidden; 

`;

const ImageBox = styled.div`
  width: 100%;
  height: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden; 
  padding: 24px;
  background-image: url(${PAPER_PERSON}); 
  background-size: 110%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  will-change: background-size, background-position; 

`;

export { PaperSection };