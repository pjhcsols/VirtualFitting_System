export const cartKeys = {
  all: ['cart'] as const,
  count: (accessToken: string | null) => ['cart', 'count', accessToken] as const,
};