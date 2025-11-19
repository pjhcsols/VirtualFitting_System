import { withRecoil } from './with-recoil';
import compose from 'compose-function';

export const withProviders = compose(withRecoil);