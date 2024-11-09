import type Stripe from 'stripe';
import type { Nullable } from '~/types';

export type FileId = string;

export type CategoryId = string;

export type ProductId = string;

export type StripeProductId = Stripe.Product['id'];

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

export type Category = {
  id: CategoryId;
  name: string;
  icon: Nullable<string>;
  isVisible: boolean;
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
  categoryId: CategoryId;
  stripeProductId: Nullable<StripeProductId>;
  title: string;
  subtitle: Nullable<string>;
  content: string;
  totalQuantity: number;
  files: string[];
};
