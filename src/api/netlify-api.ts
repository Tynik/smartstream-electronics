import type { AccountProfile, PaginationPayload, Product } from './api.types';
import { netlifyRequest } from './netlify-request';

export const getAccountProfile = async () =>
  (await netlifyRequest<AccountProfile>('get-account-profile')).data;

export const getProducts = async (payload: PaginationPayload) =>
  (
    await netlifyRequest<Product[]>('get-products', {
      params: payload,
    })
  ).data;
