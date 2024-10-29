import type { AccountProfile, FeatureCategory, PaginationPayload, Product } from './api.types';
import { netlifyRequest } from './netlify-request';

export const getAccountProfile = async () =>
  (await netlifyRequest<AccountProfile>('get-account-profile')).data;

export const getProducts = async (payload: PaginationPayload) =>
  (
    await netlifyRequest<Product[]>('get-products', {
      params: payload,
    })
  ).data;

type AddFeatureCategoryPayload = {
  name: string;
};

export const addFeatureCategory = async (payload: AddFeatureCategoryPayload) =>
  (
    await netlifyRequest('add-feature-category', {
      payload,
      method: 'POST',
    })
  ).data;

export const getFeatureCategories = async () =>
  (await netlifyRequest<FeatureCategory[]>('get-feature-categories')).data;
