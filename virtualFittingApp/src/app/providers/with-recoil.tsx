import { RecoilRoot } from 'recoil';

export const withRecoil = (component: () => React.ReactNode) => () => (
  <RecoilRoot>{component()}</RecoilRoot>
);