import { IconType } from "../types/IconType";

function ClothesIcon(props: IconType) {
  return (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11 37H4V17C4 14 6 10.5 9 8C12 5.5 18 4 18 4H30C30 4 36 5.5 39 8C42 10.5 44 14 44 17V37H37"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
      />
      <path
        d="M37 17V37V44H11V37V17"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
      />
      <path
        d="M30 4C30 7.31371 27.3137 10 24 10C20.6863 10 18 7.31371 18 4"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="4"
      />
    </svg>
  );
}

export { ClothesIcon };
