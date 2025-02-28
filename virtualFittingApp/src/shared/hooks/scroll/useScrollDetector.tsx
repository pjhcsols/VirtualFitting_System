import { useEffect, useState } from "react";

function useScrollDetector() {
  const [isScroll, setIsScroll] = useState<boolean>(false);

  useEffect(() => {
    const scrollDetact = () => {
      setIsScroll(window.scrollY > 30);
    };

    window.addEventListener("scroll", scrollDetact);
    return () => {
      window.removeEventListener("scroll", scrollDetact);
    };
  }, []);

  return isScroll;
}

export { useScrollDetector };
