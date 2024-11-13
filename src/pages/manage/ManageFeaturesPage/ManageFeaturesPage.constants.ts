import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';

import type { FeatureCategoryFormData, FeatureFormData } from '~/pages';

export const FEATURE_CATEGORY_FORM_FIELDS: HoneyFormFieldsConfig<FeatureCategoryFormData> = {
  name: {
    type: 'string',
    required: true,
    max: 25,
  },
};

export const FEATURE_FORM_FIELDS: HoneyFormFieldsConfig<FeatureFormData> = {
  name: {
    type: 'string',
    required: true,
    max: 25,
  },
};
