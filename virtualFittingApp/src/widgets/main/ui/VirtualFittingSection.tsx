import { useCallback, useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { BREAKPOINTS } from "@/shared";
import { DummyProductDetails } from "@/widgets/product-details";
import type { ProductDetail } from "@/entities/product";
import { fetchProductDetailByColor } from "@/entities/product/api/product.api";
import icon_exclamatioin_mark from "@/shared/assets/icons/icon-exclamation-mark.svg";
import icon_add from "@/shared/assets/icons/icon-add.svg";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { GlassBox } from "@/shared/components/glass-box"; 
import manImg from "/img/user/base_m.png";
import womanImg from "/img/user/base_w.png";
import icon_cancel from "@/shared/assets/icons/icon-cancel2.svg";
import RefreshIcon from '@mui/icons-material/Refresh';
import { AddModelModal } from "@/features/ai-try-on";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { rawSvgDoubleContent } from "../model/constants";

gsap.registerPlugin(ScrollTrigger);

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const MODEL = { MAN: "man", WOMAN: "woman", CUSTOM: "custom" } as const;
type ModelKey = typeof MODEL[keyof typeof MODEL];

const TXT = {
  addTooltip: "",
  helpTooltip: "협약된 브랜드의 상품만 자신의 이미지로 가상착용이 가능합니다.",
};

function VirtualFittingSection({ productId = 2 }: { productId?: number }) {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelKey>(MODEL.MAN);

  const WrapperRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const [modelSrc, setModelSrc] = useState<Record<ModelKey, string>>({
    man: manImg,
    woman: womanImg,
    custom: "" 
  });
  const [registeredImageUrl, setRegisteredImageUrl] = useState<string | null>(null);
  const [registeredLoading, setRegisteredLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadRegisteredImage = useCallback(async () => {
    setRegisteredImageUrl(null); 
    setRegisteredLoading(true); 
    return null; 
}, [setRegisteredImageUrl]);

  const openModal = async () => {
    await loadRegisteredImage();
    setIsModalOpen(true);
  };

  const openReplace = async () => {
    setIsModalOpen(true);
  };
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setUploadPreview(null);
    setSelectedFile(null);
  }, []);

  const removeCustom = useCallback(() => {
    setModelSrc(prev => {
      if (prev.custom && prev.custom.startsWith("blob:")) URL.revokeObjectURL(prev.custom);
    return { ...prev, custom: "" };
    });
    if (selectedModel === MODEL.CUSTOM) setSelectedModel(MODEL.MAN);
  }, [selectedModel]);

  const handleUseExisting = () => {
    if (!registeredImageUrl) return;
    setModelSrc(prev => ({ ...prev, custom: registeredImageUrl }));
    setSelectedModel(MODEL.CUSTOM);
    closeModal();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadPreview(prev => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return prev;
    });
    
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;
    try {
      if (uploadPreview?.startsWith("blob:")) {
        setModelSrc(prev => ({ ...prev, custom: uploadPreview }));
      }
        setSelectedModel(MODEL.CUSTOM);

      alert("이미지가 성공적으로 등록되었습니다.");
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const detail = await fetchProductDetailByColor(2, "BLACK");
        if (!detail) throw new Error("상품 상세를 찾을 수 없습니다.");
        
        if (mounted) {
          setProduct(detail);

        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const targets = [railRef.current, modelRef.current, panelRef.current].filter(
        Boolean
      ) as HTMLElement[];

      gsap.set(targets, { opacity: 0, y: 40 });

      gsap.to(targets, {
          scrollTrigger: {
          trigger: WrapperRef.current,
          start: "top 75%",      
          toggleActions: "play none none none",
          anticipatePin: 1,    
          invalidateOnRefresh: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    }, WrapperRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScrollToProduct = () => {
      const scrollPosition = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (scrollPosition + viewportHeight >= totalHeight - 10) {
        window.removeEventListener('scroll', handleScrollToProduct);
        navigate('/products');
      }
    };
    window.addEventListener('scroll', handleScrollToProduct);

    return () => window.removeEventListener('scroll', handleScrollToProduct);
  }, [navigate]);
  
  if (!product) return;

  return (
    <>
      <TooltipGlobalStyles />

      <SectionWrap ref={WrapperRef}>
        <HeadlineText>
          지금 바실리움에서 가상착용 데모를 확인하세요.
        </HeadlineText>
        <SubText >
          고객이 <StrongHighlight>‘입어본 듯’ 확신하고 결제하도록.</StrongHighlight> 단순히 옷을 보여주는 데서 그치지 않습니다.<br/>
          바실리움의 가상 피팅 기술은 실제 착용한 듯한 실감으로, 고객이 자신에게 어울리는 핏과 스타일을 직접 확인할 수 있게 합니다.<br/>
          체형에 꼭 맞는 추천을 제공하고, <StrongHighlight>쿠폰·결제·재고까지 한 번에 연동</StrongHighlight>되어 쇼핑 과정 전반이 매끄럽게 이어집니다.<br/>
          매장에서 직접 입어보는 듯한 경험을, 화면 속에서도 손끝 하나로 완성하세요.<br/>
        </SubText>
        <ContentWrapper>
        <Rail>
          <RailList>
            <GenderImageCard
              role="tab"
              aria-selected={selectedModel === MODEL.MAN}
              type="button"
              $img={modelSrc.man}
              $active={selectedModel === MODEL.MAN}
              onClick={() => setSelectedModel(MODEL.MAN)}
              title="남자 모델"
            />
            <GenderImageCard
              role="tab"
              aria-selected={selectedModel === MODEL.WOMAN}
              type="button"
              $img={modelSrc.woman}
              $active={selectedModel === MODEL.WOMAN}
              onClick={() => setSelectedModel(MODEL.WOMAN)}
              title="여자 모델"
            />

            <CustomSlot
              role="button"
              aria-label={modelSrc.custom ? "내 이미지 선택" : "새 이미지 추가"}
              $hasImage={!!modelSrc.custom}
              $active={selectedModel === MODEL.CUSTOM}
              onClick={
                modelSrc.custom
                  ? () => { setSelectedModel(MODEL.CUSTOM); }  
                  : openModal                                       
              }
              title={modelSrc.custom ? "내 이미지 선택" : "이미지 추가"}
            >
              {modelSrc.custom ? (
                <>
                  <CustomThumb src={modelSrc.custom} alt="업로드한 이미지" />
                  <SlotActions onClick={(e) => e.stopPropagation()}>
                    <IconBtn type="button" onClick={openReplace} aria-label="이미지 교체" title="이미지 교체">
                      <RefreshIcon />
                    </IconBtn>
                    <IconBtn type="button" onClick={removeCustom} aria-label="이미지 삭제" title="이미지 삭제">
                      <CancelImg src={icon_cancel} alt="" aria-hidden="true" />
                    </IconBtn>
                  </SlotActions>
                </>
              ) : (
                <AddIcon src={icon_add} alt="" aria-hidden="true" />
              )}
            </CustomSlot>
          </RailList>
        </Rail>

        <Model>
          <ModelGlassCard>
            <MainModelImg
              src={modelSrc[selectedModel]}   
              alt={`${selectedModel} 모델`}
              loading="lazy"
              decoding="async"
              onLoad={() => ScrollTrigger.refresh()}
            />
          </ModelGlassCard>
          <RailInfoTip
            aria-label="도움말"
            data-tooltip-id="help-tip"
            data-tooltip-content={TXT.helpTooltip}
            >
            <img src={icon_exclamatioin_mark} alt="" aria-hidden="true" />
          </RailInfoTip>
        </Model>

        <ProductDetailContainer>
          <DummyProductDetails
            product={product as any}
            onTryOn={openModal}
          />
        </ProductDetailContainer>
        </ContentWrapper>
      </SectionWrap>

      <Tooltip id="add-tip" place="right" className="basil-tooltip" opacity={1} offset={10} />
      <Tooltip id="help-tip" place="right" className="basil-tooltip" opacity={1} offset={10} />

      <AddModelModal
        open={isModalOpen}
        onClose={closeModal}

        registeredLoading={registeredLoading}
        registeredImageUrl={registeredImageUrl}
        onUseExisting={handleUseExisting}

        onFileChange={handleFileChange}
        onConfirmUpload={handleConfirmUpload}
        previewUrl={uploadPreview}
      />
      <ScrollArrow dangerouslySetInnerHTML={{ __html: rawSvgDoubleContent }} />
      
    </>
  );
}

export { VirtualFittingSection };


const SectionWrap = styled.section`
  width: 100%;
  heitht: 200vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:flex-start;

`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  margin-top: 30px;
  gap: 14px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    grid-template-columns: 1fr;
    row-gap: 14px;
    padding: 0 10px;
  }
`
const Rail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100px;
`;

const Model = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  align-items: end;
  gap: 10px;
  position: relative;
  display: inline-block; 
`;

const RailList = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: end;
  gap: 16px;
`;

const AddIcon = styled.img`
  display: flex;
  width: 28px;
  height: 28px;
`;

const ProductDetailContainer = styled.div`
  display: flex;
  width: 1000px;
`;

const RailInfoTip = styled.div`
position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  display: flex;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.38);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25);
  cursor: pointer;
`;

const GenderImageCard = styled.button<{ $img: string; $active?: boolean }>`
  width: 70px;
  height: 100px;
  padding: 0;
  border: 0;
  border-radius: 12px;
  background: ${({ $img }) => `center / cover no-repeat url(${$img})`};
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,.18);
  outline: none;
  margin-top: 5px;

  ${({ $active }) =>
    $active &&
    `
      outline: 3px solid #ffffffff;
      outline-offset: 0;
    `}
  &:active { transform: translateY(0); }
  &:focus-visible { outline: 3px solid #000 };
  z-index: 2;
`;

const MainModelImg = styled.img`
  width: 200px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  user-select: none;
  pointer-events: none;
`;

const ModelGlassCard = styled(GlassBox)`
display: flex;
  width: 200px;
  height: 300px;
  position: relative;
`;

const TooltipGlobalStyles = createGlobalStyle`
  .basil-tooltip {
    z-index: 100;
    font-size: 18px;
    background: rgba(255,255,255,0.14) !important;
    color: rgba(255,255,255,0.95) !important;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.35) !important;
    box-shadow: 0 6px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.25);
    border-radius: 14px !important;
    padding: 16px 18px !important;
    max-width: 260px;
    line-height: 1.55; font-weight: 500; letter-spacing: .2px;
  }

  .slot-tooltip{
    z-index: 120;
    font-size: 13px;
    padding: 8px 10px !important;
    border-radius: 10px !important;
    background: rgba(20,22,30,0.72) !important;
    color: #fff !important;
    border: 1px solid rgba(255,255,255,0.28) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    letter-spacing: .2px;
  }
`;

const CustomSlot = styled(GlassBox)<{ $hasImage: boolean; $active?: boolean }>`
  width: 70px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  position: relative;
  display: flex;
  cursor: pointer;
  transition: transform .18s ease, background .18s ease;


  ${({ $hasImage }) => $hasImage && `
    background: rgba(255,255,255,0.06);
  `}

  ${({ $active }) => $active && css`
    box-shadow: 0 8px 22px rgba(0,0,0,.22);
    outline: 3px solid #000;
    outline-offset: 0;
  `}
`;

const CustomThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;     
  display: block;
`;

const SlotActions = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  gap: 6px;
`;

const IconBtn = styled.button`
  width: 24px;
  height: 24px;
  box-sizing: border-box;
  padding: 0; 
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.45);
  font-size: 0;
  color: #fff;                     
  line-height: 0;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease, opacity .15s ease;

  svg, img {                  
    display: block;
    width: 16px;
    height: 16px;
    flex-shrink:0;
  }

  &:hover { transform: translateY(-1px); background: rgba(0,0,0,0.58); }
  &:active { transform: translateY(0); opacity: .9; }
`;

const CancelImg = styled.img`
  width: 20px; 
  height: 20px;
  display: block;
  filter: brightness(0) invert(1); 
  opacity: .95;
`;

const HeadlineText = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  letter-spacing: -2px;
  padding-bottom: 24px;
  margin: 0;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const SubText = styled.div`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -1px;
  text-align: center;
  background-image: linear-gradient(to right, #E9FAFF, #D0EFFF);
  -webkit-background-clip: text;
  background-clip: text;
  color: #E9FAFF; 
  padding-bottom: 24px;
`;

const StrongHighlight = styled.span`
  color: #B8D2FF; 
`;

const ScrollArrow = styled.div`
  position: absolute;
  bottom: 200px;
  z-index: 10;
  animation: ${bounce} 2s infinite;
  left: 50%;
  transform: translateX(-50%);
  color: #E9FAFF; 

  svg {
    width: 80px; 
    height: 100px;
    fill: none;
    stroke: currentColor;
    stroke-width: 20;
    stroke-linecap: round;
    stroke-linejoin: round;
    display: block;
    vertical-align: middle;
  }
`;