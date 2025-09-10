import { useState } from "react";
import iconLiked from "../assets/icon-liked.svg";
import iconUnliked from "../assets/icon-unliked.svg";
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
      src={liked ? iconLiked : iconUnliked}
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
