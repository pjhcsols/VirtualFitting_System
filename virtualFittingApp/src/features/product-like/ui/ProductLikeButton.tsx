import { useState } from "react";
import icon_liked from "../assets/icon-liked.svg";
import icon_unliked from "../assets/icon-unliked.svg";
import styled from "styled-components";

type ProductLikeButtonProps = {
  isInitiallyLiked?: boolean;
  onToggle?: (liked: boolean) => void;
};

export const ProductLikeButton = ({
  isInitiallyLiked = false,
  onToggle,
}: ProductLikeButtonProps) => {
  const [liked, setLiked] = useState(isInitiallyLiked);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    onToggle?.(newLiked);
  };

  return (
    <IconImage
      src={liked ? icon_liked : icon_unliked}
      alt={liked ? "좋아요 취소" : "좋아요"}
      onClick={handleClick}
    />
  );
};

const IconImage = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  object-fit: contain;
`;
