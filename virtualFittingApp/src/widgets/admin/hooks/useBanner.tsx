import { type ChangeEvent, useEffect, useState } from "react";
import { POST_BANNERS } from "@/widgets/admin/api/admin.action";

function useBanner() {
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [photoCount, setPhotoCount] = useState<number>(1);
  const [photoList, setPhotoList] = useState<string[]>([]);
  const [banner, setBanner] = useState<File[] | null>(null);

  const onClickBanner = (idx: number) => {
    setCurrIdx(idx);
  };

  const onAddPhotoCount = () => {
    if (photoCount >= 6) {
      return;
    }
    setPhotoCount(photoCount + 1);
  };

  const onSubPhotoCount = (idx: number) => {
    if (photoCount <= 1) {
      return;
    }
    setPhotoCount(photoCount - 1);

    setPhotoList((prevList) => prevList.filter((_, i) => i !== idx));
    setBanner((prevBanner) => prevBanner?.filter((_, i) => i !== idx) ?? null);
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
    currIdx,
    photoCount,
    photoList,
    onAddPhotoCount,
    onSubPhotoCount,
    onChangePhotos,
    onClickBanner,
    onSubmitBanner,
  };
}

export { useBanner };
