import Stripe from 'stripe';

export type Nullable<T> = T | null;

export type UserId = string;

export type StripeCustomerId = Stripe.Customer['id'];

export type UserShippingAddressId = string;

export type UserBillingAddressId = string;

export type FileId = string;

export type ManufacturerId = string;

export type DatasheetId = string;

export type CategoryId = string;

export type FeatureCategoryId = string;

export type FeatureId = string;

export type ProductId = string;

export type ProductFeatureId = string;

export type ApplicationId = string;

export type StripeProductId = Stripe.Product['id'];

export type OrderId = string;

export type UserRole = 'admin' | 'buyer';

export type UserStatus = 'active' | 'inactive';

export type OrderStatus = 'pending' | 'processed' | 'canceled' | 'archived';

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

export type UserShippingAddressRecord = {
  id: UserShippingAddressId;
  userId: UserId;
  line1: string;
  line2: Nullable<string>;
  city: string;
  postcode: string;
  note: Nullable<string>;
};

export type UserBillingAddressRecord = {
  id: UserBillingAddressId;
  userId: UserId;
  line1: string;
  line2: Nullable<string>;
  city: string;
  postcode: string;
};

export type FileRecord = {
  id: FileId;
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

export type CategoryRecord = {
  id: CategoryId;
  name: string;
  icon: string;
  isVisible: boolean;
};

export type FeatureCategoryRecord = {
  id: FeatureCategoryId;
  name: string;
};

export type FeatureRecord = {
  id: FeatureId;
  categoryId: FeatureCategoryId;
  name: string;
};

type ProductSeoRecord = {
  description: string;
  keywords: string[];
};

export type ProductRecord = {
  id: ProductId;
  categoryId: CategoryRecord;
  stripeProductId: StripeProductId;
  title: string;
  subtitle: Nullable<string>;
  seo: ProductSeoRecord;
  images: unknown[];
  content: string;
  totalQuantity: number;
  datasheetId: Nullable<DatasheetId>;
  applications: ApplicationRecord[];
};

export type ProductFeatureRecord = {
  id: ProductFeatureId;
  featureId: FeatureId;
  productId: ProductId;
  value: string;
};

export type OrderRecord = {
  id: OrderId;
  userId: UserId;
  shippingAddressId: UserShippingAddressId;
  billingAddressId: Nullable<UserBillingAddressId>;
  status: OrderStatus;
  totalPrice: number;
  created: number;
  updated: Nullable<number>;
};

export type OrderProductRecord = {
  id: string;
  orderId: OrderId;
  productId: ProductId;
  quantity: number;
  price: number;
};
