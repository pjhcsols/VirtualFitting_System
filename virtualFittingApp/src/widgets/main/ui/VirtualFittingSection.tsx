import { useCallback, useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import { BREAKPOINTS } from "@/shared";
import { Cookies } from 'react-cookie';
import { ProductDetails } from "@/widgets/product-details";
import type { ProductDetail } from "@/entities/product";
import { fetchProductDetailByColor, fetchProductColors } from "@/entities/product/api/product.api";
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
import { NormalUserImgUpload, NormalUserGetImg } from "@/widgets/auth/api/normalAuth.action";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useProductCoupon } from "@/features/coupon"; // 🚨 쿠폰 훅 임포트

gsap.registerPlugin(ScrollTrigger);

const cookiesInstance = new Cookies();

const MODEL = { MAN: "man", WOMAN: "woman", CUSTOM: "custom" } as const;
type ModelKey = typeof MODEL[keyof typeof MODEL];

const TXT = {
  addTooltip: "",
  helpTooltip: "협약된 브랜드의 상품만 자신의 이미지로 가상착용이 가능합니다.",
};

function VirtualFittingSection({ productId = 1 }: { productId?: number }) {
  // ----------------------------------------------------
  // 🚨 1. Hooks & State 선언 (최상위 배치)
  // ----------------------------------------------------
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelKey>(MODEL.MAN);
  const [loading, setLoading] = useState(true);

  // GSAP Refs
  const WrapperRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Try-On 상태
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
  
  // 🚨 쿠폰 훅 호출 (product가 로드된 후 productId를 사용)
  const { 
    coupons, 
    isLoading: isCouponLoading, 
    handleDownloadCoupon, 
  } = useProductCoupon(product?.productId ?? 0); 


  // ----------------------------------------------------
  // 🚨 2. Callbacks & Handlers
  // ----------------------------------------------------
  
  const loadRegisteredImage = useCallback(async () => {
    setRegisteredLoading(true);
    try {
      const res = await NormalUserGetImg();
      // NOTE: API 응답이 URL 전체를 주지 않는 경우 'http://'를 붙여야 함
      const ImgUrl = "http://" + res.data; 
      setRegisteredImageUrl(ImgUrl);
      return ImgUrl;
    } catch {
      setRegisteredImageUrl(null);
      return null;
    } finally {
      setRegisteredLoading(false);
    }
  }, []);

  const requireAuth = useCallback(() => {
    const token = cookiesInstance.get("access-token");
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
      return false;
    }
    return true;
  }, [navigate]);

  const openModal = async () => {
    if (!requireAuth()) return;
    setIsModalOpen(true);
    
    if (!registeredImageUrl) {
      await loadRegisteredImage();
    }
  };

  const openReplace = async () => {
    if (!requireAuth()) return;
    setIsModalOpen(true);
    await loadRegisteredImage(); 
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
      const ok = await NormalUserImgUpload(selectedFile);
      if (!ok) {
        alert("이미지 등록에 실패했습니다.");
        return;
      }

      // Blob URL을 사용하여 미리보기를 설정한 경우 (성공 후 실제 URL로 업데이트)
      if (uploadPreview?.startsWith("blob:")) {
        setModelSrc(prev => ({ ...prev, custom: uploadPreview }));
      }

      // 서버에서 등록된 최종 이미지 URL을 가져와서 custom 모델 소스로 설정
      const latest = await loadRegisteredImage(); 
      if (latest) {
        setModelSrc(prev => ({ ...prev, custom: latest }));
        setSelectedModel(MODEL.CUSTOM);
      } else if (uploadPreview) {
        // API가 즉시 URL을 안 주는 경우, 미리보기 URL을 임시 사용 (UX)
        setSelectedModel(MODEL.CUSTOM);
      }

      alert("이미지가 성공적으로 등록되었습니다.");
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };


  // ----------------------------------------------------
  // 🚨 3. Data Fetching & GSAP Effects
  // ----------------------------------------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const colors = await fetchProductColors(productId);
        if (!colors?.length) throw new Error("색상 정보를 찾을 수 없습니다.");
        const detail = await fetchProductDetailByColor(productId, colors[0]);
        if (!detail) throw new Error("상품 상세를 찾을 수 없습니다.");
        
        if (mounted) {
          setProduct(detail);
          setProductColors(colors);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
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
  
  const finalPrice = product?.productPrice ?? 0;
  if (loading || !product) return <Centered>Loading…</Centered>;

  return (
    <>
      <TooltipGlobalStyles />

      <SectionWrap ref={WrapperRef}>
        <LeftRail ref={railRef}>
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
          
          <RailInfoTip
            aria-label="도움말"
            data-tooltip-id="help-tip"
            data-tooltip-content={TXT.helpTooltip}
          >
            <img src={icon_exclamatioin_mark} alt="" aria-hidden="true" />
          </RailInfoTip>
        </LeftRail>

        <AnimWrapper ref={modelRef}>
          <ModelGlassCard>
            <MainModelImg
              src={modelSrc[selectedModel]}   
              alt={`${selectedModel} 모델`}
              loading="lazy"
              decoding="async"
              onLoad={() => ScrollTrigger.refresh()} // 4)
            />
          </ModelGlassCard>
        </AnimWrapper>

        <PanelBox ref={panelRef}>
          <ProductDetails
            product={product as any}
            productColors={productColors}
            onColorChange={() => {}}
            onTryOn={openModal}
            coupons={coupons}
            isCouponLoading={isCouponLoading}
            handleDownloadCoupon={handleDownloadCoupon}
            finalPrice={finalPrice} 
          />
        </PanelBox>
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
    </>
  );
}

export { VirtualFittingSection };


const SectionWrap = styled.section`
  --panel-h: clamp(480px, 68vh, 640px);
  max-width: 1780px;  
  width: 100%;
  margin: 0 auto;

  display: grid;
  grid-template-columns:
    120px
    minmax(360px, 0.1fr)
    minmax(560px, 1.9fr)
    minmax(420px, 0.1fr);
  column-gap: 20px;
  align-items: start;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    grid-template-columns: 1fr;
    row-gap: 14px;
    width: 94%;
  }
`;

const LeftRail = styled.div`
  --rail-gap: 16px;
  --plus-h: 50px;
  --tip-gap: 18px;  

  grid-column: 1;
  position: relative;           
  height: var(--panel-h);       
  max-height: var(--panel-h);

  margin-top: 12px;
  margin-left: 45px;
  z-index: 1;

  display: block; 
  overflow: visible;              
`;

const RailList = styled.div`
  height: var(--panel-h);
  display: grid;
  grid-template-rows: repeat(3, 1fr); 
  justify-items: center;
  gap: 16px;
`;

const AddIcon = styled.img`
  width: 28px;
  height: 28px;
  opacity: .95;
`;

const AnimWrapper = styled.div`
  grid-column: 2;      
  width: 100%;
  height: var(--panel-h);
  display: grid;
  place-items: center;
`;

const RailInfoTip = styled.div`
  position: absolute;
  left: 50%;
  top: calc(var(--panel-h) + var(--tip-gap));  /* 레일 높이 + 여백 만큼 아래 */
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  border-radius: 100px;

  display: grid;
  place-items: center;

  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.38);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25);
  cursor: pointer;
  transition: transform .18s ease, background .18s ease;

  &:hover { transform: translateX(-50%) scale(1.04); background: rgba(255,255,255,0.22); }
  img { width: 25px; height: 25px; opacity: .95; }

  @media (max-width: ${BREAKPOINTS.lg}px) {
    top: calc(var(--panel-h) + 8px);
  }
`;

const GenderImageCard = styled.button<{ $img: string; $active?: boolean }>`
  width: 80px;
  height: 100%;
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
      box-shadow: 0 8px 22px rgba(0,0,0,.22);
      outline: 3px solid #000;
      outline-offset: 0;
    `}
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:focus-visible { outline: 3px solid #000 };
`;

const MainModelImg = styled.img`
  max-width: 98%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 12px;
  user-select: none;
  pointer-events: none;
`;

const ModelGlassCard = styled(GlassBox)`
  grid-column: 2;                     /* 메인(1번) */
  width: 100%;
  height: var(--panel-h);
  display: grid;
  place-items: center;
  position: relative;
  z-index: 2;
  margin-top: 12px;

  @media (max-width: ${BREAKPOINTS.lg}px) {
    grid-column: 1;
    min-height: 380px;
  }
`;

const PanelBox = styled.div`
  position: relative;
  width: 2200px;
  padding: 10px;
  @media (max-width: ${BREAKPOINTS.md}px) {
    padding: 12px;
  }
`;

const Centered = styled.div`
  color: #fff; opacity: .85; text-align: center; padding: 60px 0;
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
  width: 80px;
  height: 100%;
  border-radius: 12px;
  position: relative;
  display: grid;
  place-items: center;
  cursor: pointer;
  overflow: hidden;
  transition: transform .18s ease, background .18s ease;

  &:hover { transform: translateY(-1px); }

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
