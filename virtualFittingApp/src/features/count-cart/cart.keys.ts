export const cartKeys = {
  count: (authUserId: string | null) => ['cart', 'count', authUserId] as const,
};