import type { Nullable } from '~/types';

export type ProductId = string;

export type MeasurementId = string;

export type FeatureCategoryId = string;

type UserRole = 'admin' | 'buyer';

export type PaginationPayload = {
  page: number;
  pageSize: number;
};

export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
  role: UserRole;
};

export type FeatureCategory = {
  id: FeatureCategoryId;
  name: string;
};

export type Feature = {
  id: FeatureCategoryId;
  categoryId: FeatureCategoryId;
  measurementId: MeasurementId;
  name: string;
};

export type Product = {
  id: ProductId;
};
