export const saveLikeStatus = (productId: string) => {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
  if (!likedProducts.includes(productId)) {
    likedProducts.push(productId);
  }
  localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
};

export const removeLikeStatus = (productId: string) => {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
  const updatedLikes = likedProducts.filter((id: string) => id !== productId);
  localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
};

export const isLiked = (productId: string): boolean => {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
  return likedProducts.includes(productId);
};
