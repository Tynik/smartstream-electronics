import type Stripe from 'stripe';
import type { Nullable } from '~/types';

export type UserId = string;

export type UserShippingAddressId = string;

export type UserBillingAddressId = string;

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

export type PaginatedList<Record> = {
  list: Record[];
};

export type UserShippingAddress = {
  id: UserShippingAddressId;
  userId: UserId;
  line1: string;
  line2: Nullable<string>;
  city: string;
  postcode: string;
  note: Nullable<string>;
};

export type UserBillingAddress = {
  id: UserBillingAddressId;
  userId: UserId;
  line1: string;
  line2: Nullable<string>;
  city: string;
  postcode: string;
};

export type Profile = {
  id: UserId;
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
  role: UserRole;
  shippingAddresses: UserShippingAddress[];
  billingAddresses: UserBillingAddress[];
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

export type FileRecord = {
  id: FileId;
  name: string;
  type: string;
  path: string;
  url: string;
};

export type Product = {
  id: ProductId;
  categoryId: CategoryId;
  stripeProductId: Nullable<StripeProductId>;
  title: string;
  subtitle: Nullable<string>;
  content: string;
  totalQuantity: number;
  files: FileRecord[];
};
