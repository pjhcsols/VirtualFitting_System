export const cartKeys = {
    all: ['cart'] as const,
    myCart: (accessToken: string) => [...cartKeys.all, 'me', accessToken] as const,
};
