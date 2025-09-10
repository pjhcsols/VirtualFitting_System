import { withRecoil } from './with-recoil';
import { withRouter } from './with-router';
import compose from 'compose-function';

export const withProviders = compose(withRecoil, withRouter);