import img_hoodie1 from '../assets/images/hoodie-1.png';
import img_hoodie2 from '../assets/images/hoodie-2.png';
import img_hoodie3 from '../assets/images/hoodie-3.png';
import svg_scroll_arrow from "../assets/icons/scroll.svg";

export const HOODIE_IMAGES = [
  { id: 1, src: img_hoodie1, name: "Classic Hoodie" },
  { id: 2, src: img_hoodie2, name: "Street Vibe Hoodie" },
  { id: 3, src: img_hoodie3, name: "Minimalist Hoodie" },
  { id: 4, src: img_hoodie1, name: "Classic Hoodie" },
  { id: 5, src: img_hoodie2, name: "Street Vibe Hoodie" },
  { id: 6, src: img_hoodie3, name: "Minimalist Hoodie" },
];

const SCROLL_ARROW_SVG = svg_scroll_arrow;

export const rawSvgContent = (() => {
    const svgData = SCROLL_ARROW_SVG;
    if (typeof svgData === 'string' && svgData.startsWith('data:image/svg+xml')) {
      const encodedContent = svgData.split(',')[1];
      if (encodedContent) {
        return decodeURIComponent(encodedContent);
      }
    }
    return svgData;
  })();