import type { Nullable } from '~/types';

type UserRole = 'admin' | 'buyer';

export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
  role: UserRole;
};
