import type { Nullable } from '~/types';

export type AccountProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
};
