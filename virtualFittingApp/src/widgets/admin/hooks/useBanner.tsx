import { type ChangeEvent, useRef, useState } from "react";
import { POST_BANNERS } from "@/widgets/admin/api/admin.action";
import { moveLeft, moveRight } from "@/shared";

function useBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [slideContainerWidth, setSlideContainerWidth] = useState<number>(0);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [photoCount, setPhotoCount] = useState<number>(1);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [banner, setBanner] = useState<File[] | null>(null);

  const onMoveBanner = (direction: boolean) => {
    if (!containerRef.current) {
      return;
    }
    if (direction && currIdx < photoCount - 1) {
      setCurrIdx(currIdx + 1);
      containerRef.current.style.transform = `${moveRight({
        elementWidth: slideContainerWidth,
        currIdx,
        idx: currIdx + 1,
      })}px`;
    } else if (!direction && currIdx > 0) {
      setCurrIdx(currIdx - 1);
      containerRef.current.style.transform = `${moveLeft({
        elementWidth: slideContainerWidth,
        currIdx,
        idx: currIdx - 1,
      })}px`;
    }
  };

  const onClickBanner = (idx: number) => {
    if (currIdx > idx) {
      moveLeft({
        elementWidth: slideContainerWidth,
        currIdx,
        idx,
      });
    } else {
      moveRight({
        elementWidth: slideContainerWidth,
        currIdx,
        idx,
      });
    }
    setCurrIdx(idx);
  };

  const onAddPhotoCount = () => {
    if (photoCount >= 6) {
      return;
    }
    setPhotoCount(photoCount + 1);
    setCurrIdx(photoCount);
  };

  const onSubPhotoCount = () => {
    if (photoCount <= 1) {
      return;
    }
    if (currIdx === photoCount - 1) {
      setCurrIdx(currIdx - 1);
    }
    setPhotoCount(photoCount - 1);
    setPhotoList((prevList) => prevList.filter((_, i) => i !== currIdx));
    setBanner(
      (prevBanner) => prevBanner?.filter((_, i) => i !== currIdx) ?? null,
    );
  };

  const onChangePhotos = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    if (idx >= photoCount) {
      console.warn(`Index ${idx} exceeds photoCount (${photoCount}).`);
      return;
    }

    const { files } = e.target;
    if (!files) {
      return;
    }
    const file = files[0];
    const thumbNail = URL.createObjectURL(file);

    setBanner((prevBanner) => {
      const updatedBanner = [...(prevBanner ?? [])];
      updatedBanner[idx] = file;
      return updatedBanner;
    });

    setPhotoList((prevList) => {
      const updatedList = [...prevList];
      updatedList[idx] = thumbNail;
      return updatedList;
    });

    return () => {
      URL.revokeObjectURL(thumbNail);
    };
  };

  const onSubmitBanner = async () => {
    try {
      const res = await POST_BANNERS({ banner });
      if (res) {
        return "yes";
      }
    } catch (err) {
      throw err;
    }
  };

  return {
    containerRef,
    currIdx,
    photoCount,
    photoList,
    setSlideContainerWidth,
    onAddPhotoCount,
    onSubPhotoCount,
    onMoveBanner,
    onChangePhotos,
    onClickBanner,
    onSubmitBanner,
  };
}

export { useBanner };
