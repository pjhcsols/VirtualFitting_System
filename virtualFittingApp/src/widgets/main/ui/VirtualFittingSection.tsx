import { useCallback, useId, useState, useEffect } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { BREAKPOINTS } from "@/shared";
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

const MODEL = { MAN: "man", WOMAN: "woman" } as const;
type ModelKey = typeof MODEL[keyof typeof MODEL];
const MODEL_SRC: Record<ModelKey, string> = { man: manImg, woman: womanImg };
const TXT = {
  addTooltip: "협약된 브랜드의 상품만 자신의 이미지로 가상착용이 가능합니다.",
  helpTooltip: "가상착용 체험하기",
};

function VirtualFittingSection({ productId = 1 }: { productId?: number }) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [productColors, setProductColors] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelKey>(MODEL.MAN);
  const [loading, setLoading] = useState(true);

  const addTipId = useId();
  const basilTipId = useId();

  const onSelectMan = useCallback(() => setSelectedModel(MODEL.MAN), []);
  const onSelectWoman = useCallback(() => setSelectedModel(MODEL.WOMAN), []);

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

  if (loading || !product) return <Centered>Loading…</Centered>;

  return (
    <>
      <TooltipGlobalStyles />

      <SectionWrap>
        <LeftRail>
          <GenderImageCard
            role="tab"
            aria-selected={selectedModel === MODEL.MAN}
            type="button"
            $img={MODEL_SRC.man}
            $active={selectedModel === MODEL.MAN}
            onClick={onSelectMan}
            title="남자 모델"
          />
          <GenderImageCard
            role="tab"
            aria-selected={selectedModel === MODEL.WOMAN}
            type="button"
            $img={MODEL_SRC.woman}
            $active={selectedModel === MODEL.WOMAN}
            onClick={onSelectWoman}
            title="여자 모델"
          />

          <PlusButton
            aria-label="사진/모델 추가"
            data-tooltip-id={addTipId}
            data-tooltip-content={TXT.addTooltip}
          >
            <img src={icon_add} alt="" />
          </PlusButton>
        </LeftRail>
        
        <ModelGlassCard>
          <MainModelImg src={MODEL_SRC[selectedModel]} alt={`${selectedModel} 모델`} loading="lazy" decoding="async" />
        </ModelGlassCard>

        <PanelBox>
          <ProductDetails
            product={product}
            productColors={productColors}
            onColorChange={() => {}}
          />
          <FloatInfoButton
            aria-label="도움말"
            data-tooltip-id={basilTipId}
            data-tooltip-content={TXT.helpTooltip}
          >
            <img src={icon_exclamatioin_mark} alt="" />
          </FloatInfoButton>
        </PanelBox>
      </SectionWrap>

      <Tooltip id={addTipId} place="right" className="basil-tooltip" opacity={1} offset={10} />
      <Tooltip id={basilTipId} place="left" className="basil-tooltip" opacity={1} offset={10} />
    </>
  );
}

export { VirtualFittingSection };


const SectionWrap = styled.section`
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
  grid-column: 1;                     /* 좌측 레일 */
  display: grid;
  gap: 25px;
  position: relative;
  z-index: 1; 
  margin-top: 12px;
  margin-left: 45px;
  justify-items: center;
  

  @media (max-width: ${BREAKPOINTS.lg}px) {
    grid-column: 1;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto;
  }
`;

const GenderImageCard = styled.button<{ $img: string; $active?: boolean }>`
  width: 80px;
  aspect-ratio: 8 / 18;
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
  max-height: 97%;
  object-fit: contain;
  border-radius: 12px;
  user-select: none;
  pointer-events: none;
`;

const PlusButton = styled.button`               
  position: relative;
  justify-self: center;   /* ← 카드들과 가로 중앙정렬 일치 */
  bottom: 0;
  margin-right: 0;

  width: 50px; height: 50px; border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;

  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.38);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25);
  cursor: pointer;
  transition: transform .18s ease, background .18s ease;

  &:hover { transform: scale(1.04); background: rgba(255,255,255,0.22); }
  img { width: 25px; height: 25px; opacity: .95; }

  z-index: 5;

 
`;

const ModelGlassCard = styled(GlassBox)`
  grid-column: 2;                     /* 메인(1번) */
  width: 100%;
  min-height: 520px;
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

const FloatInfoButton = styled.button`
  position: fixed;      
  right: 110px;
  bottom: 60px;
  z-index: 20;

  width: 50px; height: 50px; border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;

  background: rgba(255,255,255,0.16);
  border: 1px solid rgba(255,255,255,0.38);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.25);
  cursor: pointer;
  transition: transform .18s ease, background .18s ease;

  &:hover { transform: scale(1.04); background: rgba(255,255,255,0.22); }
  img { width: 25px; height: 25px; opacity: .95; }
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
`;
