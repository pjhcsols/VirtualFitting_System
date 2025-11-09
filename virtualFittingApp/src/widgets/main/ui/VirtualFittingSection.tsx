import { useCallback, useState, useEffect } from "react";
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
  const { isLoggedIn, userId } = useRecoilValue(authState);
  const [product, setProduct] = useState<ProductDetail | null>(null);
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
    if (!selectedFile || !apiGender) {
      alert("파일 또는 모델 성별 정보가 부족합니다.");
      return; 
    }

    try {
      if (uploadPreview) {
          setModelSrc(prev => ({ ...prev, custom: uploadPreview }));
          setSelectedModel(MODEL.CUSTOM); 
          
          alert("새 이미지가 모델 슬롯에 등록되었습니다.");
      } else {
          throw new Error("미리보기 URL 없음");
      }
      
      closeModal();
    } catch (err) {
      console.error("이미지 등록 실패:", err);
      alert("이미지 등록에 실패했습니다. 다시 시도해주세요.");
    }
  }, [selectedFile, apiGender, uploadPreview, setModelSrc, setSelectedModel, closeModal]);


  const callPrivateTryOnAPI = useCallback(async () => {
    const accessTokenString = getAccessTokenStringFromCookie();

    if (!selectedFile || !apiGender || !product || !isLoggedIn || !accessTokenString) {
        console.error("Private API 호출 실패: 필수 데이터 부족.");
        alert("가상 착용을 위해 파일을 선택하고 로그인 상태를 확인해주세요.");
        return; 
    }

    const currentProductColor = VIRTUAL_FITTING_PRODUCT_COLOR;

    try {
        const params = {
            productId: VIRTUAL_FITTING_PRODUCT_ID,
            color: currentProductColor,
            gender: apiGender,
            authUserId: accessTokenString,
        };

        const response = await tryOnPrivateFitting(params, selectedFile); 

        const resultImageUrl = response?.data.resultImageUrl;
        const resultSimulatedDelay = response?.data.simulatedDelayMillis ?? null;
        
        if (resultImageUrl) {
            setGeneratedImageUrl(resultImageUrl);
            setSimulatedDelay(resultSimulatedDelay);
            alert("새 이미지로 가상 착용 이미지가 생성되었습니다.");
        } else {
            alert("가상 착용 요청에 실패했습니다. 서버 응답 오류.");
        }
    } catch (err) {
        console.error("Private API 최종 처리 오류:", err);
        alert("이미지 처리 중 오류가 발생했습니다.");
    }
  }, [selectedFile, apiGender, product, isLoggedIn, userId, setGeneratedImageUrl, setModelSrc, setSelectedModel]);

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
            color: VIRTUAL_FITTING_PRODUCT_COLOR,
            gender: apiGender,
        };
        
        const response = await tryOnPublicFitting(params, imageBlob); 
        
        const resultImageUrl = response?.data.resultImageUrl;
        const resultSimulatedDelay = response?.data.simulatedDelayMillis ?? null;

        if (resultImageUrl) {
            setGeneratedImageUrl(resultImageUrl);
            setSimulatedDelay(resultSimulatedDelay);
            alert("가상 착용 이미지가 성공적으로 생성되었습니다.");
            console.log(
                "debug:",
                { 
                productId: params.productId, 
                color: params.color, 
                gender: params.gender, 
                imageUrl: imageUrl, 

                fullResponse: response 
              }
            );

            
        } else {
            alert("가상 착용 요청에 실패했습니다. 서버 응답 오류.");
            console.log(
                "API 호출 실패 디버그:",
                { 
                productId: params.productId, 
                color: params.color, 
                gender: params.gender, 
                imageUrl: imageUrl, 
                fullResponse: response 
              }
            );
        }

    } catch (err) {
        console.error("가상 착용 최종 처리 오류:", err);
        alert("이미지 처리 중 오류가 발생했습니다.");
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const detail = await fetchProductDetailByColor(VIRTUAL_FITTING_PRODUCT_ID, VIRTUAL_FITTING_PRODUCT_COLOR);
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

      <SectionWrap>
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
          <DummyProductDetails
            product={product as any}
            onTryOn={handleProductTryOn}
            fittingResultUrl={generatedImageUrl}
            fittingDelay={simulatedDelay}
            onViewResult={openResultModal}
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
      <ScrollArrow dangerouslySetInnerHTML={{ __html: rawSvgDoubleContent }} />
      
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
  heitht: 130vh;
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
  object-fit: contain;  
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