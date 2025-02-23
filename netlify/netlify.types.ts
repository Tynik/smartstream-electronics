import type Stripe from 'stripe';

export type Nullable<T> = T | null;

export type NullableStringKeys<T> = {
  [K in keyof T]: T[K] extends Nullable<string> ? K : never;
}[keyof T];

export type DashCase<T extends string> = T extends `${infer First}-${infer Rest}`
  ? `${Lowercase<First>}-${DashCase<Rest>}`
  : Lowercase<T>;

export type UserId = string;

export type StripeCustomerId = Stripe.Customer['id'];

export type ShippingAddressId = string;

export type BillingAddressId = string;

export type FileId = string;

export type ManufacturerId = string;

export type DatasheetId = string;

export type CategoryId = string;

export type FeatureCategoryId = string;

export type MeasurementId = string;

export type FeatureId = string;

export type ProductId = string;

export type ProductFeatureId = string;

export type ApplicationId = string;

export type StripeProductId = Stripe.Product['id'];

export type OrderId = string;

export type UserRole = 'admin' | 'buyer';

export type UserStatus = 'active' | 'inactive';

export type OrderStatus = 'pending' | 'processed' | 'canceled' | 'archived';

export type UploadFileType = 'image' | 'datasheet';

export type AuthTokenPayload = {
  email: string;
};

export type ConfirmEmailTokenPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
};

export type UserRecord = {
  id: UserId;
  stripeCustomerId: Nullable<StripeCustomerId>;
  role: UserRole;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  email: string;
  phone: Nullable<string>;
  password: string;
  status: UserStatus;
  created: number;
  updated: Nullable<number>;
};

export type ShippingAddressRecord = {
  id: ShippingAddressId;
  userId: UserId;
  line1: string;
  line2: Nullable<string>;
  city: string;
  postcode: string;
  note: Nullable<string>;
};

export type BillingAddressRecord = {
  id: BillingAddressId;
  userId: UserId;
  line1: string;
  line2: Nullable<string>;
  city: string;
  postcode: string;
};

export type FileRecord = {
  id: FileId;
  name: string;
  type: string;
  path: string;
  url: string;
};

export type CategoryRecord = {
  id: CategoryId;
  name: string;
  icon: Nullable<string>;
  isVisible: boolean;
};

export type MeasurementRecord = {
  id: MeasurementId;
  name: string;
};

export type ManufacturerRecord = {
  id: ManufacturerId;
  logoFileId: Nullable<FileId>;
  name: string;
  url: Nullable<string>;
};

export type DatasheetRecord = {
  id: DatasheetId;
  fileId: FileId;
  manufacturerId: Nullable<ManufacturerId>;
  name: string;
  keywords: string[];
};

export type ApplicationRecord = {
  id: ApplicationId;
  name: string;
};

export type FeatureCategoryRecord = {
  id: FeatureCategoryId;
  name: string;
};

export type FeatureRecord = {
  id: FeatureId;
  categoryId: FeatureCategoryId;
  measurementId: MeasurementId;
  name: string;
};

type ProductSeoRecord = {
  description: string;
  keywords: string[];
};

export type ProductRecord = {
  id: ProductId;
  categoryId: CategoryId;
  stripeProductId: Nullable<StripeProductId>;
  applicationIds: ApplicationId[];
  title: string;
  subtitle: Nullable<string>;
  seo: ProductSeoRecord;
  content: string;
  totalQuantity: number;
};

export type ProductFileRecord = {
  id: string;
  categoryId: CategoryId;
  productId: ProductId;
  fileId: FileId;
  type: 'image' | 'datasheet' | 'manual' | 'schema';
};

export type ProductFeatureRecord = {
  id: ProductFeatureId;
  categoryId: CategoryId;
  productId: ProductId;
  featureId: FeatureId;
  value: string;
};

export type OrderRecord = {
  id: OrderId;
  userId: UserId;
  shippingAddressId: ShippingAddressId;
  billingAddressId: Nullable<BillingAddressId>;
  status: OrderStatus;
  totalPrice: number;
  created: number;
  updated: Nullable<number>;
};

export type OrderProductRecord = {
  id: string;
  userId: UserId;
  orderId: OrderId;
  categoryId: CategoryId;
  productId: ProductId;
  quantity: number;
  price: number;
};
