const STORAGE_KEY = "reviewpayloads";                        

export type ReviewPayloadRaw = {
  orderId: string;
  item: any;          
  deadline?: string;
  __ts?: number;
};

// 단일 키로 저장해오던 이전 데이터가 있으면 1회 마이그레이션
function migrateLegacySingleKey(arr: ReviewPayloadRaw[]) {
  const legacy = localStorage.getItem("reviewpayload");
  if (!legacy) return arr;
  try {
    const parsed = JSON.parse(legacy);
    arr.push(parsed);
    localStorage.removeItem("reviewpayload");
  } catch {}
  return arr;
}

// 유니크 키(동일 주문 중복 방지): item.id(or orderId) + date(or __ts)
function makeUniqKey(e: ReviewPayloadRaw) {
  const id = e.item?.id ?? e.orderId;
  const date = e.item?.date ?? e.__ts ?? "";
  return `${id}__${date}`;
}

export function saveReviewPayload(payload: Omit<ReviewPayloadRaw, "__ts">) {
  const entry: ReviewPayloadRaw = { ...payload, __ts: Date.now() };

  let list: ReviewPayloadRaw[] = [];
  try {
    list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {}
  list = migrateLegacySingleKey(list);

  const k = makeUniqKey(entry);
  const dedup = list.filter((e) => makeUniqKey(e) !== k);
  dedup.unshift(entry);

  // 보관 개수 제한(선택)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dedup.slice(0, 50)));
}

export function readReviewPayloads(): ReviewPayloadRaw[] {
  let list: ReviewPayloadRaw[] = [];
  try {
    list = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
  list = migrateLegacySingleKey(list);

  return [...list].sort((a, b) => (b.__ts ?? 0) - (a.__ts ?? 0));
}

export function clearReviewPayloads() {
  localStorage.removeItem(STORAGE_KEY);
}
