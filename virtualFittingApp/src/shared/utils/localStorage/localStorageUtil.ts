export const saveLikeStatus = (productId: number) => {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
  if (!likedProducts.includes(productId)) {
    likedProducts.push(productId);
  }
  localStorage.setItem("likedProducts", JSON.stringify(likedProducts));
};

export const removeLikeStatus = (productId: number) => {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
  const updatedLikes = likedProducts.filter((id: number) => id !== productId);
  localStorage.setItem("likedProducts", JSON.stringify(updatedLikes));
};

export const isLiked = (productId: number): boolean => {
  const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "[]");
  return likedProducts.includes(productId);
};
