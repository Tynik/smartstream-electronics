import type { Nullable } from '~/types';
import type {
  Profile,
  Feature,
  FeatureCategory,
  FeatureCategoryId,
  MeasurementId,
  PaginationPayload,
  Product,
  StripeProductId,
  FileId,
  Category,
  CategoryId,
  PaginatedList,
} from './api.types';
import { netlifyRequest } from './netlify-request';

export const getProfile = async () => (await netlifyRequest<Profile>('get-profile')).data;

type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
  phone: string;
};

export const updateProfile = async (payload: UpdateProfilePayload) =>
  (
    await netlifyRequest('update-profile', {
      payload,
      method: 'PATCH',
    })
  ).data;

type AddCategoryPayload = {
  name: string;
  icon: Nullable<string>;
  isVisible: boolean;
};

export const addCategory = async (payload: AddCategoryPayload) =>
  (
    await netlifyRequest('add-category', {
      payload,
      method: 'POST',
    })
  ).data;

export const getCategories = async () => (await netlifyRequest<Category[]>('get-categories')).data;

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

export const deleteCategory = async (categoryId: CategoryId) => {
  return (
    await netlifyRequest('delete-category', {
      params: {
        categoryId,
      },
      method: 'DELETE',
    })
  ).data;
};

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
  measurementId: MeasurementId;
  name: string;
};

export const addFeature = async (payload: AddFeaturePayload) =>
  (
    await netlifyRequest('add-feature', {
      payload,
      method: 'POST',
    })
  ).data;

type FileType = 'image' | 'datasheet';

export type UploadedFile = {
  id: FileId;
  name: string;
  type: string;
  path: string;
  url: string;
};

export const uploadFile = async (file: File, type: FileType) => {
  const fd = new FormData();

  fd.append('file', file);
  fd.append('type', type);

  return (
    await netlifyRequest<UploadedFile>('upload-file', {
      payload: fd,
      method: 'POST',
    })
  ).data;
};

export const deleteFile = async (fileId: FileId) => {
  return (
    await netlifyRequest('delete-file', {
      params: {
        fileId,
      },
      method: 'DELETE',
    })
  ).data;
};

type ProductFilePayload = {
  fileId: FileId;
  type: FileType;
};

type AddProductPayload = {
  categoryId: FeatureCategoryId;
  stripeProductId: Nullable<StripeProductId>;
  files: ProductFilePayload[];
  title: string;
  subtitle: Nullable<string>;
  content: string;
  totalQuantity: number;
};

export const addProduct = async (payload: AddProductPayload) =>
  (
    await netlifyRequest('add-product', {
      payload,
      method: 'POST',
    })
  ).data;

export const getProducts = async (payload: PaginationPayload) =>
  (
    await netlifyRequest<PaginatedList<Product>>('get-products', {
      params: payload,
    })
  ).data;
