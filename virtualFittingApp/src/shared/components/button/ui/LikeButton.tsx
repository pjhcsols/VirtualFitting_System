import { useState } from "react";
import { ICON_LIKED, ICON_UNLIKED } from "@/shared/constants";
import styled from "styled-components";

type LikeButtonProps = {
  isInitiallyLiked?: boolean;
  onToggle?: (liked: boolean) => void;
};

export const LikeButton = ({
  isInitiallyLiked = false,
  onToggle,
}: LikeButtonProps) => {
  const [liked, setLiked] = useState(isInitiallyLiked);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    onToggle?.(newLiked);
  };

  return (
    <IconImage
      src={liked ? ICON_LIKED : ICON_UNLIKED}
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