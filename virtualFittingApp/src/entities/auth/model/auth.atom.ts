import { atom } from 'recoil';

export const authState = atom<boolean>({
  key: 'authState',
  default: document.cookie.includes('access-token'),
});