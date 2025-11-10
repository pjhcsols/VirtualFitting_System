import styled from "styled-components";
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

type ProductLikeButtonProps = {
  isInitiallyLiked: boolean;
  onToggle: () => Promise<void>;
  productId: number;
  isLoading?: boolean;
};

export const ProductLikeButton = ({
  isInitiallyLiked,
  onToggle,
  isLoading = false,
}: ProductLikeButtonProps) => {

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    await onToggle(); 
  };

  const IconComponent = isInitiallyLiked ? FavoriteOutlinedIcon : FavoriteBorderOutlinedIcon;
  const iconColor = isInitiallyLiked ? '#FF4D4D' : '#ffffffff';

  return (
    <IconWrapper
      onClick={handleClick}
      $isloading={isLoading}
      title={isInitiallyLiked ? "좋아요 취소" : "좋아요"}
    >
      <IconComponent 
        style={{ fontSize: 22, color: iconColor }}
      />
    </IconWrapper>
  );
};

const IconWrapper = styled.div<{ $isloading: boolean }>`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: ${props => props.$isloading ? 0.6 : 1};
  transition: opacity 0.2s;
  z-index: 10;
`;

