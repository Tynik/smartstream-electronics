import { v4 as uuidv4 } from 'uuid';

import type { CategoryRecord, Nullable } from '../netlify.types';
import { createHandler } from '../netlify.helpers';
import { assertUserRole, withCredentials } from '../netlify-auth.helpers';
import { netlifyStores } from '../netlify-store';

type AddCategoryPayload = {
  name: string;
  icon: Nullable<string>;
  isVisible: boolean;
};

export const handler = createHandler<AddCategoryPayload>(
  { allowMethods: ['POST'] },
  withCredentials(async ({ payload, userRecord }) => {
    assertUserRole(userRecord, 'admin');

    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    const categoryRecord: CategoryRecord = {
      id: uuidv4(),
      name: payload.name,
      icon: payload.icon,
      isVisible: payload.isVisible,
    };

    await netlifyStores.categories.create(categoryRecord.id, categoryRecord);

    return {
      status: 'ok',
      data: {},
    };
  }),
);
