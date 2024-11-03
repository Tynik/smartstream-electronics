import type {
  AccountProfile,
  Feature,
  FeatureCategory,
  FeatureCategoryId,
  PaginationPayload,
  Product,
} from './api.types';
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

type UpdateFeatureCategoryPayload = {
  id: FeatureCategoryId;
  name: string;
};

export const updateFeatureCategory = async (payload: UpdateFeatureCategoryPayload) =>
  (
    await netlifyRequest('update-feature-category', {
      payload,
      method: 'PATCH',
    })
  ).data;

export const getFeatureCategories = async () =>
  (await netlifyRequest<FeatureCategory[]>('get-feature-categories')).data;

export const getFeatures = async (categoryId: FeatureCategoryId) =>
  (
    await netlifyRequest<Feature[]>('get-features', {
      params: {
        categoryId,
      },
    })
  ).data;

type AddFeaturePayload = {
  categoryId: FeatureCategoryId;
  name: string;
};

export const addFeature = async (payload: AddFeaturePayload) =>
  (
    await netlifyRequest('add-feature', {
      payload,
      method: 'POST',
    })
  ).data;
