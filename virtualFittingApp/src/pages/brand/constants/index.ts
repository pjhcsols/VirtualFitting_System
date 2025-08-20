import type { BrandUserType } from "@/pages/brand/types/brandUser";

type MypageTitlesType = {
  title: string;
  name: keyof BrandUserType;
};

export const BrandMyPageInputTitles: MypageTitlesType[] = [
  { title: "회사 명", name: "firmName" },
  { title: "회사 주소", name: "firmAddress" },
  { title: "회사 웹 사이트 URL", name: "firmWebUrl" },
];
