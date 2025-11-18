import { useCallback, useState, useRef, useEffect } from "react";
import styled, { createGlobalStyle, css, keyframes } from "styled-components";
import gsap from "gsap"; 
import { useNavigate, useBlocker } from "react-router-dom";
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
import { AddModelModal } from "@/features/virtual-try-on";
import { ScrollTrigger } from "gsap/all";
import { rawSvgDoubleContent } from "../model/constants";
import { tryOnPublicFitting } from "@/entities/virtual-fitting";
import { PublicTryOnQueryParams } from "@/entities/virtual-fitting";
import { fetchMyRegisteredImageUrl } from "@/entities/user";
import { useRecoilValue } from 'recoil'; 
import { authState } from '@/entities/auth';
import { tryOnPrivateFitting } from "@/entities/virtual-fitting";
import { getAccessTokenStringFromCookie } from "@/entities/auth";
import { fetchMyUserGender } from "@/entities/user";
import { FittingResultModal } from "@/features/virtual-try-on";
import { cleanServerMessage } from "@/shared";
import { uploadUserImage } from "@/entities/user";


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
const VIRTUAL_FITTING_PRODUCT_ID = 1;
const VIRTUAL_FITTING_PRODUCT_COLOR = 'BLACK';

type ModelKey = typeof MODEL[keyof typeof MODEL];

const TXT = {
  addTooltip: "",
  helpTooltip: "협약된 브랜드의 상품만 가상착용 서비스를 이용할 수 있습니다.",
};

function VirtualFittingSection({ productId = VIRTUAL_FITTING_PRODUCT_ID }: { productId?: number }) {
  const navigate = useNavigate();
  const wrapperRef = useRef(null); 
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]); 
  const headlineRef = useRef(null);
  const subTextRef = useRef(null);
  const scrollArrowRef = useRef(null);
  const { isLoggedIn, userId } = useRecoilValue(authState);
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const mounted = useRef(false);
  const isMobile =
  typeof window !== "undefined" && window.innerWidth < BREAKPOINTS.md;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!product) return;

    const cards = cardRefs.current.filter(ref => ref !== null);
    const elementsToAnimate = [
      headlineRef.current,
      subTextRef.current,
      ...cards
    ].filter(el => el !== null);

    if (elementsToAnimate.length === 0) return;

    gsap.set(elementsToAnimate, { opacity: 0, y: 50 });

    const tl = gsap.to(elementsToAnimate, {
        scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top center+=100", 
            toggleActions: "play none none none", 
        },
        opacity: 1, 
        y: 0, 
        duration: 0.8,
        stagger: 0.4,
        ease: "power2.out"
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    }

  }, [product]);

  const [selectedColor, setSelectedColor] = useState<string>(VIRTUAL_FITTING_PRODUCT_COLOR);
  const [selectedModel, setSelectedModel] = useState<ModelKey>(MODEL.MAN);
  const [userGender, setUserGender] = useState<'M' | 'W' | null>(null);
  const apiGender: 'M' | 'W' | null =
  selectedModel === MODEL.WOMAN 
    ? 'W' 
    : selectedModel === MODEL.MAN 
      ? 'M' 
      : (selectedModel === MODEL.CUSTOM ? userGender : null);
  

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
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [simulatedDelay, setSimulatedDelay] = useState<number | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const blocker = useBlocker(
    useCallback(() => isProcessing, [isProcessing])
  );

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const confirmNavigation = window.confirm(
        "가상 착용이 진행 중입니다. 페이지를 이동하면 작업이 취소될 수 있어요. 그래도 이동하시겠어요?"
      );
      if (confirmNavigation) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    }
  }, [blocker]);

  const loadUserGender = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const gender = await fetchMyUserGender(); 
      if (gender) {
        const formattedGender = gender === 'FEMALE' ? 'W' : (gender === 'MALE' ? 'M' : null);
        setUserGender(formattedGender);
      }
    } catch (e) {
      console.error("사용자 성별 정보 로딩 실패:", e);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    loadUserGender();
  }, [loadUserGender]);

  const loadRegisteredImage = useCallback(async () => {
    setRegisteredLoading(true);
    if (!isLoggedIn || !userId) {
        setRegisteredImageUrl(null);
        setRegisteredLoading(false);
        return null;
    }
    try {
        const url = await fetchMyRegisteredImageUrl(userId); 

        if (url) {
            let ImgUrl = url.startsWith('http:') ? url.replace('http:', 'https:') : url;
            setRegisteredImageUrl(ImgUrl);
            return ImgUrl;
        }
        setRegisteredImageUrl(null);
        return null;

    } catch (e) {
        console.error("기존 이미지 로딩 실패:", e);
        setRegisteredImageUrl(null);
        return null;
    } finally {
        setRegisteredLoading(false);
    }
  }, [isLoggedIn, userId]);

  const openModal = async () => {
    await loadRegisteredImage();
    setIsModalOpen(true);
  };

  const openResultModal = useCallback(() => {
    if (generatedImageUrl) {
        setIsResultModalOpen(true);
    }
  }, [generatedImageUrl]);

  const closeResultModal = useCallback(() => {
      setIsResultModalOpen(false);
  }, []);


  const openReplace = async () => {
    setIsModalOpen(true);
  };
  
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    
    if (uploadPreview?.startsWith("blob:")) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(null);
  }, [uploadPreview]);

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
    setSelectedFile(null); 

    closeModal();
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setSelectedFile(file); 
      const newUrl = URL.createObjectURL(file);
      setUploadPreview(prevUrl => {
          if (prevUrl?.startsWith("blob:")) {
              URL.revokeObjectURL(prevUrl);
          }
          return newUrl;
      });
  }, []);

  const handleConfirmUpload = useCallback(async () => {
    const accessTokenString = getAccessTokenStringFromCookie();
    if (!selectedFile || !apiGender || !accessTokenString) { 
      // alert("필수 정보가 부족합니다 (파일, 모델 성별, 로그인 상태).");
      return; 
    }
    closeModal(); 

    try {
      const uploadResponseUrl = await uploadUserImage(accessTokenString, selectedFile); 
      
      if (!uploadResponseUrl) {
        throw new Error("사용자 이미지 등록에 실패했습니다.");
      }
      setModelSrc(prev => ({ ...prev, custom: uploadResponseUrl }));
      setSelectedModel(MODEL.CUSTOM); 

      if (uploadPreview) {
          URL.revokeObjectURL(uploadPreview);
      }
      
    } catch (e) {
      console.error("이미지 등록 실패:", e);
      const rawMessage = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      const cleanedMessage = cleanServerMessage(rawMessage); 
      
      alert(`${cleanedMessage}`);
    }
  }, [selectedFile, apiGender, uploadPreview, setModelSrc, setSelectedModel, closeModal, cleanServerMessage]);


  const callPrivateTryOnAPI = useCallback(async () => {
    const accessTokenString = getAccessTokenStringFromCookie();

    if ((!selectedFile && !modelSrc.custom) || !apiGender || !product || !isLoggedIn || !accessTokenString) {
        console.error("Private API 호출 실패: 필수 데이터 부족.");
        alert("가상 착용을 위해 파일을 선택하고 로그인 상태를 확인해주세요.");
        return; 
    }

    setIsProcessing(true);
    let imageBlob: Blob | File | null = selectedFile;

    try {
      if (!imageBlob && modelSrc.custom) {
        const response = await fetch(modelSrc.custom);
        if (!response.ok) throw new Error(`커스텀 모델 이미지를 가져오지 못했습니다: ${response.statusText}`);
        imageBlob = await response.blob();
      }

      if (!imageBlob) {
        throw new Error("모델 이미지를 준비할 수 없습니다.");
      }

      const params = {
        productId: VIRTUAL_FITTING_PRODUCT_ID,
        color: selectedColor,
        gender: apiGender,
        authUserId: accessTokenString,
      };

      const response = await tryOnPrivateFitting(params, imageBlob); 

      if (!response || response.status !== 200) {
        const serverMessage = response?.message;
        throw new Error(serverMessage); 
      }
      const resultImageUrl = response?.data.resultImageUrl;
      const resultSimulatedDelay = response?.data.simulatedDelayMillis ?? null;
      
      if (resultImageUrl) {
        setGeneratedImageUrl(resultImageUrl);
        setSimulatedDelay(resultSimulatedDelay);
        if (mounted.current) {
          alert("새 이미지로 가상 착용 이미지가 생성되었습니다.");
        }
      } else {
        throw new Error("가상 착용 요청에 성공했으나, 결과 이미지를 받지 못했습니다.");
      }
   } catch (e) {
      console.error("가상 착용 API 호출 실패:", e);
      const rawMessage = e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
      const cleanedMessage = cleanServerMessage(rawMessage); 
      alert(cleanedMessage);
    } finally {
        setIsProcessing(false);
    }
  }, [selectedFile, modelSrc.custom, apiGender, product, isLoggedIn, userId, setGeneratedImageUrl, setSimulatedDelay])

  const executeVirtualTryOn = async () => {
    const isMan = selectedModel === MODEL.MAN;
    const isWoman = selectedModel === MODEL.WOMAN;

    if (!isMan && !isWoman) {
        alert("가상 착용을 위해 남자 또는 여자 모델 슬롯을 선택해야 합니다.");
        return; 
    }

    if (!product) { 
        return; 
    }
    
    const apiGender: 'M' | 'W' = isWoman ? 'W' : 'M';
    const imageUrl = isWoman ? womanImg : manImg;
    let imageBlob: Blob | null = null;
    setIsProcessing(true);

    try {
        const response = await fetch(imageUrl); 
        if (!response.ok) throw new Error(`Failed to fetch default image: ${response.statusText}`);
        imageBlob = await response.blob();
    } catch (err) {
        console.error("기본 이미지 Blob 변환 실패 (경로 오류 가능성):", err);
        return;
    }
    try {
      const params: PublicTryOnQueryParams = {
        productId: VIRTUAL_FITTING_PRODUCT_ID,
        color: selectedColor,
        gender: apiGender,
      };
      
      const response = await tryOnPublicFitting(params, imageBlob); 
      
      const resultImageUrl = response?.data.resultImageUrl;
      const resultSimulatedDelay = response?.data.simulatedDelayMillis ?? null;
      console.log(resultImageUrl);

      if (resultImageUrl) {
        setGeneratedImageUrl(resultImageUrl);
        setSimulatedDelay(resultSimulatedDelay);
        if (mounted.current) {
          alert("가상 착용 이미지가 성공적으로 생성되었습니다.");
        }
          
      } else {
        throw new Error("가상 착용 요청에 성공했으나, 결과 이미지를 받지 못했습니다.");
      }

    } catch (err) {
      console.error("가상 착용 최종 처리 오류:", err);
      alert("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductTryOn = useCallback(() => {
    
    if (selectedModel === MODEL.MAN || selectedModel === MODEL.WOMAN) {
        executeVirtualTryOn(); 
    } else if (selectedModel === MODEL.CUSTOM) {
        if (!isLoggedIn) {
             alert("본인의 이미지로 가상착용을 위해선 로그인이 필요합니다.");
             return;
        }

        if (modelSrc.custom) {
            callPrivateTryOnAPI(); 
            
        } else if (selectedFile) {
            callPrivateTryOnAPI(); 

        } else {
            openModal();
        }
    }

  }, [selectedModel, executeVirtualTryOn, callPrivateTryOnAPI, isLoggedIn, modelSrc.custom, selectedFile, openModal]); 

  const handleColorChangeFromDetails = useCallback((newColor: string) => {
    setSelectedColor(newColor);
    setGeneratedImageUrl(null)
    setSimulatedDelay(null);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const detail = await fetchProductDetailByColor(VIRTUAL_FITTING_PRODUCT_ID, selectedColor);
        if (!detail) throw new Error("상품 상세를 찾을 수 없습니다.");
        
        if (mounted) {
          setProduct(detail);

        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => { mounted = false; };
  }, [productId, selectedColor]);

  useEffect(() => {
    if (!product || !scrollArrowRef.current || !wrapperRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "bottom bottom-=100",
        end: "+=200",
        scrub: 1,
        onLeave: () => setTimeout(() => navigate('/products'), 0),
        id: 'scroll-arrow-nav'
      }
    });

    tl.to(scrollArrowRef.current, {
      scaleY: 2.5,
      transformOrigin: "50% 100%",
      ease: "none"
    });

    return () => {
      ScrollTrigger.getById('scroll-arrow-nav')?.kill();
    };
  }, [product, navigate]);
  
  if (!product) return;

  return (
    <>
      <TooltipGlobalStyles />

      <SectionWrap ref={wrapperRef}>
        <HeadlineText ref={headlineRef}>
        {isMobile ? (
            <>
              지금 바실리움에서<br />
              가상착용 데모를 확인하세요.
            </>
          ) : (
            "지금 바실리움에서 가상착용 데모를 확인하세요."
          )}
      </HeadlineText>
      <SubText ref={subTextRef}>
        고객이 <StrongHighlight>‘입어본 듯’ 확신하고 결제하도록.</StrongHighlight> 단순히 옷을 보여주는 데서 그치지 않습니다.<br/>
        바실리움의 가상 피팅 기술은 실제 착용한 듯한 실감으로, 고객이 자신에게 어울리는 핏과 스타일을 직접 확인할 수 있게 합니다.<br/>
        체형에 꼭 맞는 추천을 제공하고, <StrongHighlight>쿠폰·결제·재고까지 한 번에 연동</StrongHighlight>되어 쇼핑 과정 전반이 매끄럽게 이어집니다.<br/>
        매장에서 직접 입어보는 듯한 경험을, 화면 속에서도 손끝 하나로 완성하세요.<br/>
      </SubText>
        <ContentWrapper>
          <RailAndModelWrapper>
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
        </RailAndModelWrapper>
          <DummyProductDetails
            product={product as any}
            onTryOn={handleProductTryOn}
            fittingResultUrl={generatedImageUrl}
            fittingDelay={simulatedDelay}
            onViewResult={openResultModal}
            isProcessing={isProcessing}
            onColorChange={handleColorChangeFromDetails}
          />
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
        isLoggedIn={isLoggedIn}
      />
            <ScrollArrow
        ref={scrollArrowRef}
        onClick={() => navigate('/products')}
        dangerouslySetInnerHTML={{ __html: rawSvgDoubleContent }}
      />
      
      {isResultModalOpen && generatedImageUrl && (
      <FittingResultModal
          open={isResultModalOpen}
          onClose={closeResultModal}
          imageUrl={generatedImageUrl}
          delay={simulatedDelay}
      />
      )}
    </>
  );
}

export { VirtualFittingSection };


const SectionWrap = styled.section`
  width: 100%;
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

  @media (max-width: ${BREAKPOINTS.md}px) {
    flex-direction: column;
    align-items: center;
    gap: 30px;
    padding: 0 10px;
  }
`
const RailAndModelWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
`;

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
  background: rgba(255,255,255,0.25); 
  border: 1px solid rgba(255,255,255,0.38);
  backdrop-filter: blur(2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25);
  cursor: pointer;

  img {
    filter: drop-shadow(0 0 1px rgba(0,0,0,0.4)) drop-shadow(0 0 2px rgba(0,0,0,0.6));
  }
`;

const HeadlineText = styled.div`
  font-size: 56px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
  letter-spacing: -2px;
  padding-bottom: 64px;
  margin: 0;
  background-image: linear-gradient(to right, #E9FAFF, #B8D2FF);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 36px;
    padding-bottom: 32px;
  }
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

  @media (max-width: ${BREAKPOINTS.md}px) {
    font-size: 1rem;
  }
`;

const StrongHighlight = styled.span`
  color: #B8D2FF; 
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
  overflow: hidden;

  ${({ $hasImage }) => $hasImage && `
    background: rgba(255,255,255,0.06);
  `}

  ${({ $active }) => $active && css`
    box-shadow: 0 8px 22px rgba(0,0,0,.22);
    outline: 3px solid #ffffff;
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
  bottom: 6px;
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

const ScrollArrow = styled.div`
  position: absolute;
  bottom: 100px;
  z-index: 10;
  animation: ${bounce} 2s infinite;
  left: 50%;
  transform: translate(-50%, 0);
  color: #E9FAFF; 
  cursor: pointer;

  svg {
    width: 80px; 
    height: 100px;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    display: block;
    vertical-align: middle;
  }
`;