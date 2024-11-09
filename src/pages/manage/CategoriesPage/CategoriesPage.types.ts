import type { Nullable } from '~/types';

export type CategoryFormData = {
  name: string;
  icon: Nullable<string>;
  isVisible: boolean;
};
