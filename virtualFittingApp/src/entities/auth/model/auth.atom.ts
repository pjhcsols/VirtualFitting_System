import { atom } from 'recoil';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
}

interface BasiliumJwtPayload extends JwtPayload {
  role: string;
}

const getInitialAuthState = (): AuthState => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access-token='))
    ?.split('=')[1];

  if (token) {
    try {
      const decodedToken = jwtDecode<BasiliumJwtPayload>(token);
      return { isLoggedIn: true, userId: decodedToken.sub ?? null };
    } catch (error) {
      console.error("Failed to decode token", error);
      return { isLoggedIn: false, userId: null };
    }
  }

  return { isLoggedIn: false, userId: null };
};

export const authState = atom<AuthState>({
  key: 'authState',
  default: getInitialAuthState(),
});

export const getAccessTokenStringFromCookie = (): string | null => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('access-token='))
    ?.split('=')[1];

  return token || null; 
};