import type { AccountProfile } from './api.types';
import { netlifyRequest } from './netlify-request';

export const getAccountProfile = async () =>
  (await netlifyRequest<AccountProfile>('get-account-profile')).data;
