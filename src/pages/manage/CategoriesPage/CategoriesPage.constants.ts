import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';

import type { CategoryFormData } from './CategoriesPage.types';

export const CATEGORY_FORM_FIELDS: HoneyFormFieldsConfig<CategoryFormData> = {
  name: {
    type: 'string',
    required: true,
    max: 25,
  },
  icon: {
    type: 'string',
  },
  isVisible: {
    type: 'radio',
    defaultValue: true,
  },
};
