import * as S from "./style";

import { useState, type ChangeEvent } from "react";
import { type BrandUserType } from "@/pages/brand";

interface IBrandUserBusinessInfoWidget {
  data: BrandUserType;
  onChangeText: (e: ChangeEvent<HTMLInputElement>) => void;
}

function BrandUserBusinessInfoWidget({
  data,
  onChangeText,
}: IBrandUserBusinessInfoWidget) {
  return <></>;
}

export { BrandUserBusinessInfoWidget };
