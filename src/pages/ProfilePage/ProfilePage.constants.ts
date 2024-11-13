import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';

import type { EditProfileFormData } from './ProfilePage.types';

export const EDIT_PROFILE_FORM_FIELDS: HoneyFormFieldsConfig<EditProfileFormData> = {
  firstName: {
    type: 'string',
    required: true,
    max: 50,
  },
  lastName: {
    type: 'string',
    required: true,
    max: 50,
  },
  phone: {
    type: 'string',
    required: true,
    filter: value => value?.replace(/\D/g, '').slice(0, 11),
  },
};
