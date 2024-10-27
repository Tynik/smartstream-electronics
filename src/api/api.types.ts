import type { Nullable } from '~/types';

export type ProductId = string;

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

export type Product = {
  id: ProductId;
};
